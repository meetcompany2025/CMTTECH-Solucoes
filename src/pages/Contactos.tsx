import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contactos() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Entraremos em contacto consigo brevemente.",
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      details: ["+244 942 546 887", "+244 942 594 868"],
      action: "tel:+244942546887",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["comercial@cmttechsolucoes.com"],
      action: "mailto:comercial@cmttechsolucoes.com",
    },
    {
      icon: MapPin,
      title: "Morada",
      details: ["Lubango, Huíla", "Angola"],
      action: null,
    },
    {
      icon: Clock,
      title: "Horário",
      details: ["Seg - Sex: 08:00 - 17:00", "Sáb: 08:00 - 12:00"],
      action: null,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Entre em Contacto
          </h1>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Estamos prontos para ajudar. Solicite um orçamento gratuito ou tire as suas dúvidas.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Informações de Contacto
                </h2>
                <p className="text-muted-foreground">
                  Entre em contacto connosco através de qualquer um dos meios abaixo.
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="flex items-start gap-4 py-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <info.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      {info.details.map((detail, dIndex) => (
                        info.action ? (
                          <a 
                            key={dIndex}
                            href={info.action}
                            className="block text-muted-foreground hover:text-secondary transition-colors"
                          >
                            {detail}
                          </a>
                        ) : (
                          <span key={dIndex} className="block text-muted-foreground">
                            {detail}
                          </span>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* WhatsApp CTA */}
              <a 
                href="https://wa.me/244942546887?text=Olá!%20Gostaria%20de%20obter%20mais%20informações%20sobre%20os%20serviços%20da%20CMTTECH."
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="whatsapp" size="lg" className="w-full gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contactar via WhatsApp
                </Button>
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Envie-nos uma Mensagem
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
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
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+244 XXX XXX XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Ex: Pedido de orçamento para rede de dados"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Descreva o seu projeto ou dúvida..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="secondary" 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Respondemos em até 24 horas úteis</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-80 bg-muted flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Lubango, Huíla, Angola</p>
        </div>
      </section>
    </>
  );
}
