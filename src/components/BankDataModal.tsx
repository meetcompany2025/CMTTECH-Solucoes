import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Check, Building2 } from "lucide-react";
import { useState } from "react";

interface BankDataProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function BankDataModal({ isOpen, onClose, orderId }: BankDataProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const bankData = {
    bank: "BAI - Banco Angolano de Investimentos",
    holder: "CMTTECH Soluções Tecnológicas, Lda",
    accountNumber: "0040 0000 8745 2341 1012 5",
    iban: "AO06 0040 0000 8745 2341 1012 5",
    nbi: "0040 0000 87452341012 5"
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      
      // Remove do estado após 2 segundos
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const isCopied = copiedItems.has(label);
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(text, label)}
        className="flex items-center space-x-1"
      >
        {isCopied ? (
          <>
            <Check className="h-3 w-3 text-green-600" />
            <span className="text-xs">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span className="text-xs">Copiar</span>
          </>
        )}
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <DialogTitle className="text-xl">Dados Bancários - CMTTECH</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Pedido #{orderId} - Aguardando confirmação de pagamento
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Instruções de Pagamento</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Realize a transferência para os dados bancários abaixo</li>
              <li>• Use o número do pedido #{orderId} como referência</li>
              <li>• O pagamento pode levar até 24h para ser confirmado</li>
              <li>• Você receberá um e-mail quando o pagamento for confirmado</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banco</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-sm">{bankData.bank}</span>
                  <CopyButton text={bankData.bank} label="bank" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Titular da Conta</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-sm">{bankData.holder}</span>
                  <CopyButton text={bankData.holder} label="holder" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Número da Conta</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-sm">{bankData.accountNumber}</span>
                  <CopyButton text={bankData.accountNumber} label="account" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">IBAN</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-sm">{bankData.iban}</span>
                  <CopyButton text={bankData.iban} label="iban" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">NBI (Número Básico de Identificação)</label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <span className="font-mono text-sm">{bankData.nbi}</span>
                <CopyButton text={bankData.nbi} label="nbi" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
            <p className="text-sm text-yellow-700">
              Após efetuar a transferência, mantenha o comprovante. Em caso de dúvidas, 
              entre em contato com nosso suporte informando o número do pedido #{orderId}.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => window.print()}>
              Imprimir Dados
            </Button>
            <Button onClick={onClose}>
              Entendido
            </Button>
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}