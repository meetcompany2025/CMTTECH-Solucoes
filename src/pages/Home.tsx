import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Shield, Zap, Sun, CheckCircle } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";
import servicesNetwork from "@/assets/services-network.jpg";
import servicesCctv from "@/assets/services-cctv.jpg";
import servicesAutomation from "@/assets/services-automation.jpg";
import servicesSolar from "@/assets/services-solar.jpg";
import client1 from '@/assets/clients/client1.png';
import client2 from '@/assets/clients/client2.png';
import client3 from '@/assets/clients/client3.png';
import client4 from '@/assets/clients/client4.png';
import client5 from '@/assets/clients/client5.png';
import client6 from '@/assets/clients/client6.png';
import client7 from '@/assets/clients/client7.png';
import client8 from '@/assets/clients/client8.png';
import client9 from '@/assets/clients/client9.png';
import client10 from '@/assets/clients/client10.png';
import client11 from '@/assets/clients/client11.png';
import client12 from '@/assets/clients/client12.png';
import client13 from '@/assets/clients/client13.png';
import client14 from '@/assets/clients/client14.png';
import client155 from '@/assets/clients/client15.png';

const services = [
  {
    icon: Network,
    title: "Redes de Dados e Fibra Óptica",
    description: "Implementação e manutenção de infraestruturas de rede de alta performance.",
    image: servicesNetwork,
  },
  {
    icon: Shield,
    title: "Vídeo Vigilância",
    description: "Sistemas de CCTV profissionais para segurança empresarial e institucional.",
    image: servicesCctv,
  },
  {
    icon: Zap,
    title: "Automação e Eletricidade",
    description: "Soluções de automação industrial e instalações elétricas de qualidade.",
    image: servicesAutomation,
  },
  {
    icon: Sun,
    title: "Sistemas Solares",
    description: "Energia renovável e sustentável para sua empresa ou propriedade.",
    image: servicesSolar,
  },
];

const clients = [
  { name: "Cliente 1", logo: client1 },
  { name: "Cliente 2", logo: client2 },
  { name: "Cliente 3", logo: client3 },
  { name: "Cliente 4", logo: client4 },
  { name: "Cliente 5", logo: client5 },
  { name: "Cliente 6", logo: client6 },
  { name: "Cliente 7", logo: client7 },
  { name: "Cliente 8", logo: client8 },
  { name: "Cliente 9", logo: client9 },
  { name: "Cliente 10", logo: client10 },
  { name: "Cliente 11", logo: client11 },
  { name: "Cliente 12", logo: client12 },
  { name: "Cliente 13", logo: client13 },
  { name: "Cliente 14", logo: client14 },
  { name: "Cliente 15", logo: client155 },
];

const stats = [
  { value: "10+", label: "Anos de Experiência" },
  { value: "50+", label: "Projetos Realizados" },
  { value: "30+", label: "Clientes Satisfeitos" },
  { value: "100%", label: "Comprometimento" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-overlay-gradient" />
        
        <div className="container-padding relative z-10 mx-auto py-20">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-secondary bg-secondary/10 rounded-full border border-secondary/20">
              Telecomunicações • IT • Automação • Eletricidade
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight">
              Soluções Tecnológicas para o <span className="text-secondary">Sucesso</span> do Seu Negócio
            </h1>
            <p className="text-lg md:text-xl text-background/80 mb-8 leading-relaxed">
              A CMTTECH SOLUÇÕES é uma empresa angolana especializada em infraestruturas de 
              telecomunicações, redes de dados, vídeo vigilância e sistemas de automação.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contactos">
                <Button variant="hero" size="xl" className="gap-2">
                  Solicitar Orçamento
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/servicos">
                <Button variant="heroOutline" size="xl">
                  Nossos Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-background/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-background/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container-padding mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <SectionTitle 
            title="Os Nossos Serviços"
            subtitle="Oferecemos soluções completas em telecomunicações e tecnologias de informação para empresas de todos os sectores."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="group overflow-hidden hover-lift border-0 shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <service.icon className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/servicos">
              <Button variant="outline" size="lg" className="gap-2">
                Ver Todos os Serviços
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-muted">
        <div className="container-padding mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle 
                title="Porquê Escolher a CMTTECH?"
                subtitle="Somos uma empresa comprometida com a excelência e satisfação dos nossos clientes."
                centered={false}
              />
              
              <div className="space-y-4">
                {[
                  "Equipa técnica altamente qualificada e certificada",
                  "Experiência comprovada em projetos de grande escala",
                  "Soluções personalizadas para cada cliente",
                  "Suporte técnico e manutenção contínua",
                  "Parceiros das melhores marcas do mercado",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/sobre">
                  <Button variant="secondary" size="lg" className="gap-2">
                    Conheça a Nossa História
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={servicesNetwork}
                  alt="Redes de Dados"
                  className="rounded-xl shadow-lg"
                />
                <img 
                  src={servicesCctv}
                  alt="Vídeo Vigilância"
                  className="rounded-xl shadow-lg mt-8"
                />
                <img 
                  src={servicesAutomation}
                  alt="Automação"
                  className="rounded-xl shadow-lg -mt-8"
                />
                <img 
                  src={servicesSolar}
                  alt="Energia Solar"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <SectionTitle 
            title="Clientes que Confiam em Nós"
            subtitle="Trabalhamos com empresas e instituições de referência em Angola."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-6 bg-card rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all duration-300"
              >
                <img
                src={client.logo}
                alt={client.name}
                className="max-h-12 object-contain grayscale hover:grayscale-0 transition"
              />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="gap-2">
                Ver Portfólio Completo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hero-gradient">
        <div className="container-padding mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Pronto para Transformar o Seu Negócio?
          </h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para uma consulta gratuita. 
            Estamos prontos para desenvolver a solução ideal para a sua empresa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contactos">
              <Button variant="hero" size="xl" className="gap-2">
                Pedir Orçamento Gratuito
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+244942546887">
              <Button variant="heroOutline" size="xl">
                +244 942 546 887
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
