import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { OrderRepository } from "@/data/repositories/order.repository.impl";
import { PaymentRepository } from "@/data/repositories/payment.repository.impl";
import { PaymentInitiateRequest, PaymentInitiateResponse } from "@/domain/entities/payment.entity";
import { OrderCreateDTO } from "@/data/dto/order.dto";
import { Order } from "@/domain/entities/order.entity";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  FileText, 
  CheckCircle, 
  Loader2, 
  ShoppingCart,
  Copy,
  Shield,
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import { httpClient } from "@/infrastructure/http/http-client";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
}

type CheckoutStep = "info" | "payment" | "confirmation";

export default function Checkout() {
  return (
    <ProtectedRoute redirectTo="/auth">
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>("info");
  const [loading, setLoading] = useState(false);
  const [debugStep, setDebugStep] = useState<CheckoutStep>("info");

  // Estados para as variáveis selecionadas pelo usuário
  const [selectedEnderecoEntrega, setSelectedEnderecoEntrega] = useState<string>("");
  const [selectedEnderecoFaturacao, setSelectedEnderecoFaturacao] = useState<string>("");
  const [selectedMetodoEntrega, setSelectedMetodoEntrega] = useState<string>("");
  const [cupomCodigo, setCupomCodigo] = useState<string>("");
  const [notasCliente, setNotasCliente] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("reference"); // Padrão: Multicaixa Express

  // Estados para dados do pedido e pagamento criados
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentInitiateResponse | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Para rastrear conclusão do pagamento EMIS

  // Estados para seleção de endereços disponíveis
  const [userEnderecos, setUserEnderecos] = useState<any[]>([]);
  const [metodosEntrega, setMetodosEntrega] = useState<any[]>([]);
  const [loadingMetodosEntrega, setLoadingMetodosEntrega] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Função para buscar métodos de entrega
  const fetchMetodosEntrega = async () => {
    try {
      setLoadingMetodosEntrega(true);
      console.log('Buscando métodos de entrega...');

      // Usar o httpClient configurado com autenticação
      const response = await httpClient.get('/sales/delivery-methods?skip=0&limit=100');

      console.log('Resposta dos métodos de entrega:', response.data);

      // Ajustar conforme o formato da resposta
      const metodos = response.data.items || response.data || [];
      setMetodosEntrega(metodos);
      
      // Selecionar automaticamente o primeiro método de entrega
      if (metodos.length > 0 && !selectedMetodoEntrega) {
        setSelectedMetodoEntrega(metodos[0].id);
        console.log('Primeiro método de entrega selecionado:', metodos[0].id);
      }

    } catch (error) {
      console.error('Erro ao buscar métodos de entrega:', error);

      // Fallback com métodos estáticos (IMPORTANTE: usar UUIDs válidos)
      const fallbackMetodos = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          nome: 'Entrega Padrão (2-3 dias)',
          descricao: 'Entrega padrão em 2-3 dias úteis',
          preco: 0.0
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          nome: 'Entrega Expressa (24h)',
          descricao: 'Entrega rápida em até 24 horas',
          preco: 15.0
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          nome: 'Retirar na Loja',
          descricao: 'Retirada gratuita no local',
          preco: 0.0
        }
      ];
      setMetodosEntrega(fallbackMetodos);
      
      // Selecionar automaticamente o primeiro método fallback
      if (!selectedMetodoEntrega) {
        setSelectedMetodoEntrega(fallbackMetodos[0].id);
        console.log('Primeiro método de entrega (fallback) selecionado:', fallbackMetodos[0].id);
      }
    } finally {
      setLoadingMetodosEntrega(false);
    }
  };

  // Debug log para verificar dados do usuário
  useEffect(() => {
    console.log('=== DEBUG CHECKOUT ===');
    console.log('User completo:', JSON.stringify(user, null, 2));
    console.log('User ID:', user?.id);
    console.log('Username:', user?.username);
    console.log('Cliente existe:', !!user?.cliente);
    console.log('Cliente:', user?.cliente);
    console.log('Endereços:', user?.cliente?.enderecos);
    console.log('Tipo de endereços:', typeof user?.cliente?.enderecos);
    console.log('Length endereços:', user?.cliente?.enderecos?.length);
    console.log('====================');
  }, [user]);

  // Monitor step changes
  useEffect(() => {
    console.log('📍 Step mudou para:', step);
    setDebugStep(step);
  }, [step]);

  // Monitor createdOrder changes
  useEffect(() => {
    if (createdOrder) {
      console.log('✅ createdOrder foi setado:', {
        id: createdOrder.id,
        numero_pedido: createdOrder.numero_pedido,
        total: createdOrder.total,
        metodo_pagamento: createdOrder.metodo_pagamento,
      });
    } else {
      console.log('⚠️ createdOrder é null');
    }
  }, [createdOrder]);

  // Monitor createdPayment changes
  useEffect(() => {
    if (createdPayment) {
      console.log('✅ createdPayment foi setado:', {
        pagamento_id: createdPayment.pagamento_id,
        estado: createdPayment.estado,
        url_pagamento: createdPayment.url_pagamento,
      });
    } else {
      console.log('⚠️ createdPayment é null');
    }
  }, [createdPayment]);

  // Debug final
  useEffect(() => {
    console.log('🎯 Estado atual:', {
      step,
      debugStep,
      createdOrderExists: !!createdOrder,
      createdPaymentExists: !!createdPayment,
      paymentCompleted,
      shouldRenderConfirmation: step === "confirmation" && !!createdOrder,
    });
  }, [step, debugStep, createdOrder, createdPayment, paymentCompleted]);

  // Buscar métodos de entrega quando o componente montar
  useEffect(() => {
    fetchMetodosEntrega();
  }, []);

  // Buscar dados do usuário e endereços quando disponível
  useEffect(() => {
    // Não resetar loadingUserData para true se já tivermos dados
    if (!user) {
      console.log('Usuário ainda não carregou, aguardando...');
      // Mantém loadingUserData como true para mostrar "Carregando..."
      return;
    }

    console.log('User encontrado no useEffect, processando...');

    if (user.cliente && Array.isArray(user.cliente.enderecos)) {
      const enderecos = user.cliente.enderecos;
      console.log('Enderecos é array:', Array.isArray(enderecos));
      console.log('Enderecos encontrados:', enderecos);
      console.log('Número de enderecos:', enderecos.length);

      setUserEnderecos(enderecos);

      // Selecionar endereço predefinido automaticamente se ainda não selecionado
      if (!selectedEnderecoEntrega) {
        const enderecoPredefinido = enderecos.find((e: any) => e.predefinido);
        if (enderecoPredefinido) {
          setSelectedEnderecoEntrega(enderecoPredefinido.id);
          setSelectedEnderecoFaturacao(enderecoPredefinido.id); // Usar o mesmo para faturação
          console.log('Endereço predefinido selecionado:', enderecoPredefinido.id);
        } else if (enderecos.length > 0) {
          // Se não há endereço predefinido, seleciona o primeiro
          setSelectedEnderecoEntrega(enderecos[0].id);
          setSelectedEnderecoFaturacao(enderecos[0].id);
          console.log('Primeiro endereço selecionado:', enderecos[0].id);
        }
      }
    } else if (user.cliente) {
      console.log('Cliente existe mas enderecos não é array:', user.cliente.enderecos);
      setUserEnderecos([]);
    } else {
      console.log('Cliente não encontrado no usuário');
      setUserEnderecos([]);
    }

    // Sempre definir loadingUserData como false quando user existe
    setLoadingUserData(false);
  }, [user, selectedEnderecoEntrega]);

  // Lista de variáveis do sistema
  const checkoutVariables = {
    // Dados obrigatórios
    cliente_id: user?.cliente?.id || "",
    endereco_entrega_id: selectedEnderecoEntrega,
    endereco_faturacao_id: selectedEnderecoFaturacao,
    metodo_entrega_id: selectedMetodoEntrega,
    cupom_codigo: cupomCodigo.trim() || null,
    notas_cliente: notasCliente.trim() || null,
    metodo_pagamento: paymentMethod,

    // Dados do usuário (readonly)
    userInfo: {
      nome: user?.cliente?.nome || user?.username || "",
      email: user?.cliente?.email || user?.email || "",
      telefone: user?.cliente?.telefone || "",
      nif: user?.cliente?.nif || "",
    }
  };

  // Validação antes de enviar
  const validateOrderData = () => {
    const errors: string[] = [];

    if (!checkoutVariables.cliente_id) {
      errors.push("ID do cliente não encontrado");
    }

    if (!checkoutVariables.endereco_entrega_id) {
      errors.push("Selecione um endereço de entrega");
    }

    if (!checkoutVariables.endereco_faturacao_id) {
      errors.push("Selecione um endereço de faturação");
    }

    if (!checkoutVariables.metodo_entrega_id) {
      errors.push("Selecione um método de entrega");
    }

    if (items.length === 0) {
      errors.push("Seu carrinho está vazio");
    }

    return errors;
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateOrderData();
    if (errors.length > 0) {
      toast({
        title: "Erro de Validação",
        description: errors.join("\n"),
        variant: "destructive"
      });
      return;
    }

    setStep("payment");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const orderRepository = new OrderRepository();
      const paymentRepository = new PaymentRepository();

      // Validação de produtos não bloqueia mais o fluxo - apenas como warning
      console.log('=== VERIFICANDO PRODUTOS NO CARRINHO ===');
      // Não vamos buscar produtos da API para não bloquear o checkout
      // Apenas validamos se os IDs no carrinho são UUIDs válidos

      // Log simples dos itens no carrinho para debug
      console.log('Itens no carrinho para o pedido:', items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })));

      console.log('✅ Prosseguindo com criação do pedido...');

      // Helper function to generate valid UUID for test data
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Debug: Verificar itens no carrinho
      console.log('=== ITENS NO CARRINHO ===');
      console.log('Cart items:', items);
      console.log('Product IDs in cart:', items.map(item => ({ id: item.id, name: item.name })));

      // Helper function to validate UUID (sem gerar novos)
      const validateUUID = (id: string | number): string => {
        const strId = String(id);
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(strId)) {
          return strId;
        }

        // Se não for UUID válido, lançar erro em vez de gerar
        throw new Error(`ID de produto inválido: ${strId}. Deve ser um UUID válido.`);
      };

      // Create order items from cart com validação UUID
      const orderItems = items.map(item => {
        try {
          return {
            produto_id: validateUUID(item.id), // Valida UUID sem gerar novos
            variante_id: null,
            quantidade: item.quantity,
          };
        } catch (error) {
          console.error(`Erro no item "${item.name}" com ID "${item.id}":`, error);
          throw new Error(`Produto "${item.name}" tem ID inválido. Remova o item do carrinho e adicione novamente.`);
        }
      });

      console.log('Order items validados:', orderItems);

      // Create order com payload correto da API usando variáveis selecionadas
      const orderData: OrderCreateDTO = {
        cliente_id: checkoutVariables.cliente_id, // ID do cliente do usuário
        endereco_entrega_id: checkoutVariables.endereco_entrega_id, // Endereço selecionado
        endereco_faturacao_id: checkoutVariables.endereco_faturacao_id, // Endereço de faturação
        metodo_entrega_id: checkoutVariables.metodo_entrega_id, // Método de entrega
        metodo_pagamento: checkoutVariables.metodo_pagamento, // Método de pagamento
        cupom_codigo: checkoutVariables.cupom_codigo, // Cupom (opcional)
        notas_cliente: checkoutVariables.notas_cliente, // Notas do cliente
        itens: orderItems,
      };

      console.log('📦 Criando pedido com dados:', orderData);
      const order = await orderRepository.createOrder(orderData);
      console.log('✅ Pedido criado:', order);
      console.log('📋 Número do pedido:', order.numero_pedido);
      console.log('💳 ID do pedido para pagamento:', order.id);

      // Map payment method to API values (corrigido conforme erro)
      const metodoPagamentoMap: { [key: string]: string } = {
        "transfer": "transferencia",  // Transferência Bancária
        "reference": "emis",           // Multicaixa Express
      };

      // Map payment type to API values
      const tipoPagamentoMap: { [key: string]: string } = {
        "transfer": "BOLETO",         // Transferência usa tipo boleto (conforme erro)
        "reference": "DEBITCARD",      // Multicaixa Express usa débito
      };

      // Get client IP
      const clientIP = await getClientIP();

      // Create payment initiation
      const paymentData: PaymentInitiateRequest = {
        encomenda_id: order.id,
        metodo: metodoPagamentoMap[paymentMethod] || "emis", // Padrão: Multicaixa Express
        moeda: "AOA",
        tipo_pagamento: tipoPagamentoMap[paymentMethod] || "DEBITCARD",
        ip_cliente: clientIP,
        user_agent: navigator.userAgent,
        url_retorno: `${window.location.origin}/order-success/${order.id}`,
      };

      console.log('💰 Iniciando pagamento com dados:', paymentData);
      const payment = await paymentRepository.initiatePayment(paymentData);
      console.log('✅ Pagamento iniciado:', payment);
      console.log('🔗 URL de pagamento:', payment.url_pagamento);

      toast({
        title: "Pedido criado!",
        description: `Seu pedido #${order.numero_pedido} foi criado com sucesso.`,
      });

      // Armazenar dados nos estados com logs
      console.log('🔄 Setando estados...');
      setCreatedOrder(order);
      setCreatedPayment(payment);
      setPaymentCompleted(false);
      console.log('✅ Estados setados');

      // MUDAR PARA STEP CONFIRMATION (não mais modais)
      console.log('📍 Mudando para step confirmation');
      setStep("confirmation");
      console.log('✅ Step mudado para confirmation');
    } catch (error) {
      console.error('❌ Error creating order:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack',
      });
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao processar seu pedido. Tente novamente.";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get client IP
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not get client IP:', error);
      return '';
    }
  };

  // Listener para mensagens do iframe EMIS
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes('emis') || event.origin.includes(window.location.hostname)) {
        const data = event.data;

        if (data.type === 'PAYMENT_SUCCESS') {
          setPaymentCompleted(true);
          toast({
            title: "Pagamento Confirmado!",
            description: "Seu pagamento foi processado com sucesso.",
          });
        } else if (data.type === 'PAYMENT_ERROR') {
          toast({
            title: "Erro no Pagamento",
            description: data.message || 'Ocorreu um erro durante o pagamento',
            variant: "destructive"
          });
        } else if (data.type === 'PAYMENT_CANCEL') {
          toast({
            title: "Pagamento Cancelado",
            description: "Você cancelou o pagamento. Pode tentar novamente.",
            variant: "destructive"
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Função para copiar texto para o clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${label} foi copiado para a área de transferência.`,
      });
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

  // Componente auxiliar para exibir dados bancários
  const BankDataRow = ({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      <div className="flex-1">
        <span className="text-xs text-gray-500 uppercase font-medium block mb-1">{label}</span>
        <span className="font-mono text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="ml-4 flex items-center space-x-1 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
      >
        <Copy className="h-4 w-4" />
        <span className="text-xs font-medium">Copiar</span>
      </Button>
    </div>
  );

  const handleAddToCart = (product: any) => {
    // This would typically open a modal or navigate to product details
    // For now, just show a toast
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-muted-foreground mb-8">
            Seu carrinho de compras está vazio. Adicione produtos para continuar.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link to="/loja" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 text-sm transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Produtos
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step === "info" 
                  ? "bg-black text-white" 
                  : ["payment", "confirmation"].includes(step)
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {["payment", "confirmation"].includes(step) ? "✓" : "1"}
              </div>
              <span className={`text-sm font-medium ml-2 ${
                ["info", "payment", "confirmation"].includes(step)
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}>
                Informações
              </span>
            </div>

            {/* Connector 1 */}
            <div className={`w-12 h-px ${
              ["payment", "confirmation"].includes(step)
                ? "bg-black"
                : "bg-gray-300"
            }`}></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step === "payment"
                  ? "bg-black text-white"
                  : step === "confirmation"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step === "confirmation" ? "✓" : "2"}
              </div>
              <span className={`text-sm font-medium ml-2 ${
                ["payment", "confirmation"].includes(step)
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}>
                Pagamento
              </span>
            </div>

            {/* Connector 2 */}
            <div className={`w-12 h-px ${
              step === "confirmation"
                ? "bg-black"
                : "bg-gray-300"
            }`}></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step === "confirmation"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ml-2 ${
                step === "confirmation"
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}>
                Confirmação
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "info" && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações da Encomenda</h2>
                  <div>
                    {/* Dados do Usuário (Readonly) */}
                    <div className="mb-6 p-5 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-sm mb-4 text-gray-900">Dados do Cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Nome:</span> {checkoutVariables.userInfo.nome}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {checkoutVariables.userInfo.email}
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span> {checkoutVariables.userInfo.telefone || "Não informado"}
                      </div>
                      <div>
                        <span className="font-medium">NIF:</span> {checkoutVariables.userInfo.nif || "Não informado"}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitInfo} className="space-y-6">
                    {/* Endereço de Entrega */}
                    <div>
                      <Label htmlFor="endereco_entrega">Endereço de Entrega *</Label>
                      {loadingUserData ? (
                        <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
                          Carregando endereços...
                        </div>
                      ) : (
                        <select
                          id="endereco_entrega"
                          value={selectedEnderecoEntrega}
                          onChange={(e) => setSelectedEnderecoEntrega(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Selecione um endereço de entrega</option>
                          {userEnderecos.length === 0 ? (
                            <option value="" disabled>Nenhum endereço encontrado</option>
                          ) : (
                            userEnderecos.map(endereco => (
                              <option key={endereco.id} value={endereco.id}>
                                {endereco.nome_destinatario} - {endereco.rua}, {endereco.numero_casa}, {endereco.bairro}, {endereco.municipio}, {endereco.provincia}
                                {endereco.tipo === "faturacao" ? " (Faturação)" : " (Entrega)"}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                      {!loadingUserData && userEnderecos.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          Você não possui endereços cadastrados. Adicione um endereço no seu perfil.
                        </p>
                      )}
                    </div>

                    {/* Endereço de Faturação */}
                    <div>
                      <Label htmlFor="endereco_faturacao">Endereço de Faturação *</Label>
                      {loadingUserData ? (
                        <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
                          Carregando endereços...
                        </div>
                      ) : (
                        <select
                          id="endereco_faturacao"
                          value={selectedEnderecoFaturacao}
                          onChange={(e) => setSelectedEnderecoFaturacao(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Selecione um endereço de faturação</option>
                          {userEnderecos.length === 0 ? (
                            <option value="" disabled>Nenhum endereço encontrado</option>
                          ) : (
                            userEnderecos.map(endereco => (
                              <option key={endereco.id} value={endereco.id}>
                                {endereco.nome_destinatario} - {endereco.rua}, {endereco.numero_casa}, {endereco.bairro}, {endereco.municipio}, {endereco.provincia}
                                {endereco.tipo === "faturacao" ? " (Faturação)" : " (Entrega)"}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Você pode usar o mesmo endereço para entrega e faturação.
                      </p>
                    </div>

                    {/* Método de Entrega */}
                    <div>
                      <Label htmlFor="metodo_entrega">Método de Entrega *</Label>
                      {loadingMetodosEntrega ? (
                        <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
                          Carregando métodos de entrega...
                        </div>
                      ) : (
                        <select
                          id="metodo_entrega"
                          value={selectedMetodoEntrega}
                          onChange={(e) => setSelectedMetodoEntrega(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Selecione um método de entrega</option>
                          {metodosEntrega.map(metodo => (
                            <option key={metodo.id} value={metodo.id}>
                              {metodo.nome || `${metodo.descricao} (${metodo.id})`}
                            </option>
                          ))}
                        </select>
                      )}
                      {!loadingMetodosEntrega && metodosEntrega.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          Nenhum método de entrega disponível no momento.
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        O método de entrega selecionado será usado para calcular o prazo e custo.
                      </p>
                    </div>

                    {/* Cupom de Desconto */}
                    <div>
                      <Label htmlFor="cupom">Código de Cupom (Opcional)</Label>
                      <Input
                        id="cupom"
                        type="text"
                        value={cupomCodigo}
                        onChange={(e) => setCupomCodigo(e.target.value)}
                        placeholder="Digite seu cupom de desconto"
                      />
                    </div>

                    {/* Notas do Cliente */}
                    <div>
                      <Label htmlFor="notas">Notas do Pedido (Opcional)</Label>
                      <Textarea
                        id="notas"
                        value={notasCliente}
                        onChange={(e) => setNotasCliente(e.target.value)}
                        rows={3}
                        placeholder="Alguma observação especial sobre seu pedido?"
                      />
                    </div>
                      <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white h-12 rounded-xl font-semibold transition-colors">
                        Continuar para Pagamento
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Método de Pagamento</h2>
                  <div>
                  <form onSubmit={handleSubmitPayment} className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4" />
                          Transferência Bancária
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reference" id="reference" />
                        <Label htmlFor="reference" className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Multicaixa Express
                        </Label>
                      </div>
                    </RadioGroup>

                      <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white h-12 rounded-xl font-semibold transition-colors" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            A processar...
                          </>
                        ) : (
                          "Finalizar Pedido"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {step === "confirmation" && createdOrder && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Pedido Confirmado - #{createdOrder.numero_pedido}</h2>
                  </div>
                  <div className="space-y-6">
                  {/* Cabeçalho de Sucesso */}
                  <div className="text-center py-6 border-b border-gray-100">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">Obrigado pelo seu pedido!</h3>
                    <p className="text-gray-600">
                      {paymentCompleted
                        ? "Seu pagamento foi confirmado e seu pedido está sendo processado."
                        : "Seu pedido foi recebido com sucesso. Complete o pagamento abaixo."
                      }
                    </p>
                  </div>

                  {/* Seção de Pagamento - Transferência Bancária */}
                  {paymentMethod === "transfer" && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
                      {/* Título com ícone */}
                      <div className="flex items-center space-x-2 border-b border-blue-100 pb-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900 text-base">
                          Dados para Pagamento via Transferência Bancária
                        </h4>
                      </div>

                      {/* Instruções */}
                      <div className="bg-white border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                        <p className="font-medium mb-2 text-gray-900">Instruções:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Realize a transferência usando os dados abaixo</li>
                          <li>Use o número do pedido como referência</li>
                          <li>O pagamento pode levar até 24h para ser confirmado</li>
                        </ul>
                      </div>

                      {/* Dados bancários com botões de cópia */}
                      <div className="space-y-3">
                        <BankDataRow
                          label="Banco"
                          value="BAI - Banco Angolano de Investimentos"
                          onCopy={() => copyToClipboard("BAI - Banco Angolano de Investimentos", "Banco")}
                        />

                        <BankDataRow
                          label="Titular"
                          value="CMTTECH Soluções Tecnológicas, Lda"
                          onCopy={() => copyToClipboard("CMTTECH Soluções Tecnológicas, Lda", "Titular")}
                        />

                        <BankDataRow
                          label="Número da Conta"
                          value="0040 0000 8745 2341 1012 5"
                          onCopy={() => copyToClipboard("0040 0000 8745 2341 1012 5", "Número da Conta")}
                        />

                        <BankDataRow
                          label="IBAN"
                          value="AO06 0040 0000 8745 2341 1012 5"
                          onCopy={() => copyToClipboard("AO06 0040 0000 8745 2341 1012 5", "IBAN")}
                        />

                        <BankDataRow
                          label="NBI"
                          value="0040 0000 87452341012 5"
                          onCopy={() => copyToClipboard("0040 0000 87452341012 5", "NBI")}
                        />

                        {/* Referência do pedido (sem cópia) */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-yellow-800">Referência do Pedido:</span>
                            <span className="font-mono font-bold text-yellow-900">
                              #{createdOrder.numero_pedido}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Aviso importante */}
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm">
                        <p className="font-semibold text-yellow-900 mb-1">⚠️ Importante</p>
                        <p className="text-yellow-800">
                          Após efetuar a transferência, mantenha o comprovante. Em caso de dúvidas,
                          entre em contato com nosso suporte informando o número do pedido #{createdOrder.numero_pedido}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Seção de Pagamento - Multicaixa Express (EMIS) */}
                  {paymentMethod === "reference" && createdPayment && !paymentCompleted && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-6 space-y-4">
                      {/* Título com ícone */}
                      <div className="flex items-center space-x-2 border-b border-green-100 pb-3">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-gray-900 text-base">
                          Pagamento via Multicaixa Express
                        </h4>
                      </div>

                      {/* Instruções */}
                      <div className="bg-white border border-green-100 rounded-lg p-4 text-sm text-gray-800">
                        <p className="font-medium mb-2 text-gray-900">Instruções:</p>
                        <ul className="space-y-1 list-disc list-inside text-gray-700">
                          <li>Complete o pagamento no formulário abaixo</li>
                          <li>Não feche esta página durante o processo</li>
                          <li>Você será redirecionado automaticamente após a confirmação</li>
                        </ul>
                      </div>

                      {/* Detalhes do pagamento */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white border border-gray-200 rounded p-3">
                          <span className="text-sm text-gray-600 block mb-1">ID do Pagamento</span>
                          <span className="font-mono text-sm font-medium">{createdPayment.pagamento_id}</span>
                        </div>

                        <div className="bg-white border border-gray-200 rounded p-3">
                          <span className="text-sm text-gray-600 block mb-1">Estado</span>
                          <span className="font-medium capitalize text-green-700">
                            {createdPayment.estado}
                          </span>
                        </div>

                        {createdPayment.tempo_expiracao && (
                          <div className="bg-white border border-gray-200 rounded p-3 md:col-span-2">
                            <span className="text-sm text-gray-600 block mb-1">Expira em</span>
                            <span className="font-medium">
                              {new Date(createdPayment.tempo_expiracao).toLocaleString('pt-AO', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Iframe de Pagamento */}
                      <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
                        <div className="bg-green-100 px-4 py-2 border-b border-green-200">
                          <p className="text-sm font-medium text-green-800 flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Ambiente de Pagamento Seguro
                          </p>
                        </div>
                        <div className="relative" style={{ height: '500px' }}>
                          <iframe
                            src={createdPayment.url_pagamento}
                            className="w-full h-full border-0"
                            title="Pagamento EMIS - Multicaixa Express"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation allow-modals"
                            loading="eager"
                          />
                        </div>
                      </div>

                      {/* Opção de abrir em nova aba */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Problemas com o formulário acima?</p>
                        <a
                          href={createdPayment.url_pagamento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Abrir pagamento em nova aba
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Pagamento Concluído (EMIS) */}
                  {paymentMethod === "reference" && paymentCompleted && (
                    <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                      <h4 className="text-2xl font-bold text-green-800 mb-2">
                        Pagamento Confirmado!
                      </h4>
                      <p className="text-green-700 mb-4">
                        Seu pagamento foi processado com sucesso e seu pedido está sendo preparado.
                      </p>
                      <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
                        <p className="text-sm text-gray-600">ID do Pagamento</p>
                        <p className="font-mono font-bold text-gray-900">
                          {createdPayment?.pagamento_id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resumo do Pedido */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-gray-600" />
                      Resumo do Pedido
                    </h4>

                    <div className="space-y-3">
                      {/* Lista de itens */}
                      {createdOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.produto_nome}</p>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantidade} × {formatPrice(item.preco_unitario || item.subtotal / item.quantidade)}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      ))}

                      {/* Totais */}
                      <div className="space-y-2 pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatPrice(createdOrder.subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxa de Entrega</span>
                          <span className="font-medium">
                            {createdOrder.taxa_entrega > 0 ? formatPrice(createdOrder.taxa_entrega) : 'Grátis'}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Desconto</span>
                          <span className="font-medium text-green-600">
                            {createdOrder.desconto > 0 ? `- ${formatPrice(createdOrder.desconto)}` : '—'}
                          </span>
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-3 border-t-2">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(createdOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link to="/loja" className="w-full">
                          <Button variant="outline" className="w-full h-12 rounded-xl border-gray-300 hover:bg-gray-50 font-semibold transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continuar Comprando
                          </Button>
                        </Link>

                        <Link to="/meus-pedidos" className="w-full">
                          <Button className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Ver Meus Pedidos
                          </Button>
                        </Link>
                    </div>

                    {/* Opção adicional: Voltar ao checkout */}
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setStep("payment");
                          setCreatedOrder(null);
                          setCreatedPayment(null);
                          setPaymentCompleted(false);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Criar novo pedido
                      </Button>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumo do Pedido</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <span className="text-xs font-medium">{item.brand}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-600">Sub-Total</span>
                      <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-600">Desconto (0%)</span>
                      <span className="font-medium text-gray-900">-</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-gray-600">Taxa de entrega</span>
                      <span className="font-medium text-green-600">Grátis</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t-2 border-gray-900">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

