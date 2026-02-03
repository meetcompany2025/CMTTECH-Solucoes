import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Shield, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  orderId: string;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  paymentUrl, 
  onSuccess, 
  onError, 
  orderId 
}: PaymentModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar se a mensagem é do domínio de pagamento esperado
      if (event.origin.includes('emis') || event.origin.includes(window.location.hostname)) {
        const data = event.data;
        
        if (data.type === 'PAYMENT_SUCCESS') {
          onSuccess(orderId);
        } else if (data.type === 'PAYMENT_ERROR') {
          onError(data.message || 'Ocorreu um erro durante o pagamento');
        } else if (data.type === 'PAYMENT_CANCEL') {
          onClose();
        }
      }
    };

    // Adicionar listener para mensagens do iframe
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onError, onClose, orderId]);

  const handleClose = () => {
    onClose();
    // Opcional: Mostrar mensagem de cancelamento
    onError('Pagamento cancelado pelo usuário');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Pagamento Seguro com Multicaixa Express
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Ambiente de pagamento seguro e criptografado
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 w-full bg-gray-50">
          <div className="h-full flex flex-col">
            {/* Barra de informações */}
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Não feche esta janela durante o processo de pagamento.
                </p>
              </div>
            </div>
            
            {/* Container do iframe */}
            <div className="flex-1 p-4">
              <div className="w-full h-full bg-white rounded-lg shadow-sm border overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={paymentUrl}
                  className="w-full h-full border-0"
                  title="Pagamento EMIS - Multicaixa Express"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation allow-modals"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-100 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                Complete o pagamento no formulário acima.
              </p>
              <p className="text-xs text-gray-600">
                Após a confirmação, você será redirecionado automaticamente.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Pagamento 100% Seguro</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}