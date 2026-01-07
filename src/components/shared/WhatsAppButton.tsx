import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "244942546887";
  const message = encodeURIComponent("Olá! Gostaria de obter mais informações sobre os serviços da CMTTECH.");
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,45%)] text-[hsl(0,0%,100%)] px-4 py-3 rounded-full shadow-lg hover:bg-[hsl(142,70%,40%)] transition-all duration-300 hover:scale-105 group"
      aria-label="Contactar via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline font-medium">WhatsApp</span>
    </a>
  );
}
