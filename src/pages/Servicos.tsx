import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { 
  Network, 
  Shield, 
  Zap, 
  Sun, 
  Wrench, 
  GraduationCap, 
  ArrowRight,
  CheckCircle 
} from "lucide-react";
import servicesNetwork from "@/assets/services-network.jpg";
import servicesCctv from "@/assets/services-cctv.jpg";
import servicesAutomation from "@/assets/services-automation.jpg";
import servicesSolar from "@/assets/services-solar.jpg";

const services = [
  {
    icon: Network,
    title: "Redes de Dados e Fibra Óptica",
    description: "Implementação completa de infraestruturas de rede de alta performance para empresas.",
    image: servicesNetwork,
    features: [
      "Cabeamento estruturado Cat5e/Cat6/Cat6a",
      "Redes de fibra óptica monomodo e multimodo",
      "Redes ponto a ponto e multiponto",
      "Configuração de switches e routers",
      "Redes Wi-Fi empresariais (UniFi, Cisco)",
      "Interligação de sites remotos",
    ],
  },
  {
    icon: Shield,
    title: "Sistemas de Vídeo Vigilância",
    description: "Soluções profissionais de CCTV para segurança empresarial e institucional.",
    image: servicesCctv,
    features: [
      "Câmaras IP de alta resolução (4K)",
      "Sistemas DVR/NVR profissionais",
      "Centros de monitoramento",
      "Acesso remoto via smartphone",
      "Integração com sistemas de alarme",
      "Armazenamento em cloud",
    ],
  },
  {
    icon: Zap,
    title: "Instalações Elétricas",
    description: "Projetos e instalações elétricas de baixa e média tensão.",
    image: servicesAutomation,
    features: [
      "Quadros elétricos industriais",
      "Instalações de baixa tensão",
      "Manutenção preventiva e corretiva",
      "Reparação de painéis LED",
      "Sistemas de backup (UPS/Geradores)",
      "Certificações e testes",
    ],
  },
  {
    icon: Sun,
    title: "Sistemas Solares",
    description: "Energia renovável e sustentável para empresas e propriedades rurais.",
    image: servicesSolar,
    features: [
      "Painéis solares fotovoltaicos",
      "Sistemas on-grid e off-grid",
      "Bombagem solar para agricultura",
      "Inversores e baterias",
      "Dimensionamento de sistemas",
      "Instalação e manutenção",
    ],
  },
  {
    icon: Wrench,
    title: "Automação Industrial",
    description: "Sistemas de controlo automático para processos industriais.",
    image: servicesAutomation,
    features: [
      "Programação de PLCs (Siemens, Allen Bradley)",
      "Sistemas SCADA",
      "Controlo de processos",
      "Sensores e actuadores",
      "Integração de sistemas",
      "Manutenção preventiva",
    ],
  },
  {
    icon: GraduationCap,
    title: "Formação Profissional",
    description: "Academia de Redes Cisco e formações técnicas especializadas.",
    image: servicesNetwork,
    features: [
      "Cursos CCNA (Cisco Certified)",
      "Formação em fibra óptica",
      "Workshops de automação",
      "Certificações profissionais",
      "Formação in-company",
      "Suporte pós-formação",
    ],
  },
];

export default function Servicos() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Os Nossos Serviços
          </h1>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Soluções completas em telecomunicações, tecnologias de informação, 
            automação e eletricidade para empresas de todos os sectores.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <service.icon className="h-12 w-12 text-secondary" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contactos">
                    <Button variant="secondary" size="lg" className="gap-2">
                      Solicitar Orçamento
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-hero-gradient">
        <div className="container-padding mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Precisa de uma Solução Personalizada?
          </h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            A nossa equipa está pronta para desenvolver projetos à medida das suas necessidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contactos">
              <Button variant="hero" size="xl" className="gap-2">
                Falar com Especialista
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
