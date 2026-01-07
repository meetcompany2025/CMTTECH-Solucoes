import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Building2, FileText, CheckCircle } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
}

type CheckoutStep = "info" | "payment" | "confirmation";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<CheckoutStep>("info");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    nif: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setStep("payment");
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmation");
    clearCart();
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Entraremos em contacto em breve com os detalhes do pagamento.",
    });
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <section className="section-padding bg-background min-h-screen">
        <div className="container-padding mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Carrinho Vazio
          </h1>
          <p className="text-muted-foreground mb-8">
            Não tem produtos no carrinho. Visite a nossa loja para adicionar produtos.
          </p>
          <Button variant="secondary" asChild>
            <Link to="/loja">Ir para a Loja</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-16">
        <div className="container-padding mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-background mb-2">
            {step === "confirmation" ? "Pedido Confirmado" : "Checkout"}
          </h1>
          <p className="text-background/80">
            {step === "info" && "Preencha os seus dados para continuar"}
            {step === "payment" && "Escolha o método de pagamento"}
            {step === "confirmation" && "O seu pedido foi registado com sucesso"}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          {step === "confirmation" ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Obrigado pelo seu pedido!
              </h2>
              <p className="text-muted-foreground mb-8">
                Recebemos o seu pedido e entraremos em contacto através do email{" "}
                <strong>{formData.email}</strong> com os detalhes para pagamento e
                confirmação.
              </p>
              <div className="bg-muted rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Próximos passos:</h3>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>1. Receberá um email com o resumo do pedido</li>
                  <li>2. A nossa equipa irá confirmar a disponibilidade</li>
                  <li>3. Receberá os dados para pagamento</li>
                  <li>4. Após confirmação do pagamento, processamos a encomenda</li>
                </ul>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary" asChild>
                  <Link to="/loja">Continuar a Comprar</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Voltar ao Início</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                {step === "info" && (
                  <form onSubmit={handleSubmitInfo}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Dados de Contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="O seu nome"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="email@exemplo.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+244 9XX XXX XXX"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Empresa</Label>
                            <Input
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Nome da empresa"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nif">NIF</Label>
                            <Input
                              id="nif"
                              name="nif"
                              value={formData.nif}
                              onChange={handleInputChange}
                              placeholder="Número de Identificação Fiscal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Morada de Entrega</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Endereço completo"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Informações adicionais sobre o pedido..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button type="submit" variant="hero" size="lg">
                            Continuar para Pagamento
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                )}

                {step === "payment" && (
                  <form onSubmit={handleSubmitPayment}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setStep("info")}
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <CardTitle>Método de Pagamento</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className="space-y-4"
                        >
                          <label
                            htmlFor="transfer"
                            className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                              paymentMethod === "transfer"
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-secondary/50"
                            }`}
                          >
                            <RadioGroupItem value="transfer" id="transfer" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-secondary" />
                                <span className="font-medium">
                                  Transferência Bancária
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Receberá os dados bancários por email após confirmar o
                                pedido. O pedido será processado após confirmação do
                                pagamento.
                              </p>
                            </div>
                          </label>

                          <label
                            htmlFor="reference"
                            className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                              paymentMethod === "reference"
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-secondary/50"
                            }`}
                          >
                            <RadioGroupItem value="reference" id="reference" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-secondary" />
                                <span className="font-medium">
                                  Pagamento por Referência
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Receberá uma referência de pagamento que pode usar em
                                qualquer banco ou através do Multicaixa Express.
                              </p>
                            </div>
                          </label>

                          <label
                            htmlFor="consultation"
                            className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                              paymentMethod === "consultation"
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-secondary/50"
                            }`}
                          >
                            <RadioGroupItem value="consultation" id="consultation" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-secondary" />
                                <span className="font-medium">
                                  Pagamento Sob Consulta
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                A nossa equipa entrará em contacto para discutir
                                condições de pagamento personalizadas para o seu pedido.
                              </p>
                            </div>
                          </label>
                        </RadioGroup>

                        <div className="flex justify-end pt-4">
                          <Button type="submit" variant="hero" size="lg">
                            Confirmar Pedido
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-secondary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envio</span>
                        <span className="text-muted-foreground">A calcular</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-secondary">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
