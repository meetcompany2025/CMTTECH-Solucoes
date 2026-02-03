import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Shield, Zap, Sun, CheckCircle, Phone, Mail, Star, Users, Award } from "lucide-react";
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
    title: "Redes & Fibra Óptica",
    description: "Infraestruturas de rede de alta performance para a sua empresa.",
    image: servicesNetwork,
    link: "/servicos#redes"
  },
  {
    icon: Shield,
    title: "Vídeo Vigilância",
    description: "Sistemas de CCTV profissionais para segurança total.",
    image: servicesCctv,
    link: "/servicos#cctv"
  },
  {
    icon: Zap,
    title: "Automação & Eletricidade",
    description: "Soluções de automação e instalações elétricas de qualidade.",
    image: servicesAutomation,
    link: "/servicos#automacao"
  },
  {
    icon: Sun,
    title: "Energia Solar",
    description: "Energia renovável e sustentável para o seu negócio.",
    image: servicesSolar,
    link: "/servicos#solar"
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
  { value: "10+", label: "Anos de Experiência", icon: Award },
  { value: "50+", label: "Projetos Realizados", icon: Star },
  { value: "30+", label: "Clientes Satisfeitos", icon: Users },
];

const features = [
  { title: "Equipa Certificada", desc: "Profissionais qualificados" },
  { title: "Projetos à Medida", desc: "Soluções personalizadas" },
  { title: "Suporte 24/7", desc: "Assistência contínua" },
  { title: "Garantia Total", desc: "Qualidade assegurada" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Modern & Impactful */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-blue-950/70" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">Líder em Soluções Tecnológicas</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                Transformamos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Tecnologia em Resultados
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                Especialistas em telecomunicações, redes de dados, vídeo vigilância 
                e automação. Impulsione o seu negócio com as melhores soluções de Angola.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/contactos">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-14 text-base font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/servicos">
                  <Button size="lg" variant="outline" className="border-slate-500/50 text-white hover:bg-white/10 px-8 h-14 text-base font-semibold backdrop-blur-sm">
                    Explorar Serviços
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Stats Cards on Hero */}
            <div className="hidden lg:block">
              <div className="grid gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <stat.icon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden bg-slate-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Interactive Cards */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              Serviços
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Soluções que Impulsionam Negócios
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Da infraestrutura à segurança, oferecemos tudo o que a sua empresa precisa para prosperar na era digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{service.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{service.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Saber mais
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Modern Layout */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src={servicesNetwork}
                    alt="Redes de Dados"
                    className="rounded-2xl shadow-lg h-40 w-full object-cover"
                  />
                  <img 
                    src={servicesCctv}
                    alt="Vídeo Vigilância"
                    className="rounded-2xl shadow-lg h-56 w-full object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img 
                    src={servicesAutomation}
                    alt="Automação"
                    className="rounded-2xl shadow-lg h-56 w-full object-cover"
                  />
                  <img 
                    src={servicesSolar}
                    alt="Energia Solar"
                    className="rounded-2xl shadow-lg h-40 w-full object-cover"
                  />
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
            </div>
            
            <div className="lg:pl-8">
              <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full mb-4">
                Sobre Nós
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Porquê Escolher a CMTTECH?
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Há mais de 10 anos que ajudamos empresas angolanas a alcançar 
                o seu potencial através de soluções tecnológicas inovadoras e confiáveis.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {features.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </div>
                    <p className="text-sm text-slate-500 pl-8">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Link to="/sobre">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8">
                  Conheça a Nossa História
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section - Marquee Style */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              Clientes
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Empresas que Confiam em Nós
            </h2>
            <p className="text-slate-600">
              Parceiros de referência em diversos sectores de Angola
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="group flex items-center justify-center p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-12 object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/portfolio">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600">
                Ver Portfólio Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient & Modern */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Transformar o Seu Negócio?
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Agende uma consulta gratuita e descubra como podemos ajudar a sua empresa 
              a crescer com as melhores soluções tecnológicas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contactos">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-10 h-14 text-base font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:-translate-y-0.5">
                  <Mail className="mr-2 h-5 w-5" />
                  Pedir Orçamento Gratuito
                </Button>
              </Link>
              <a href="tel:+244942546887">
                <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-white/10 px-10 h-14 text-base font-semibold">
                  <Phone className="mr-2 h-5 w-5" />
                  +244 942 546 887
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
