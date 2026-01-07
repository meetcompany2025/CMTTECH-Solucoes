import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";
import cmttechLogo from "@/assets/cmttech-logo.jpg";

const values = [
  {
    icon: Target,
    title: "Compromisso",
    description: "Dedicação total à satisfação do cliente em cada projeto.",
  },
  {
    icon: Award,
    title: "Qualidade",
    description: "Excelência técnica em todos os serviços prestados.",
  },
  {
    icon: Users,
    title: "Equipa",
    description: "Profissionais qualificados e em constante formação.",
  },
  {
    icon: Heart,
    title: "Integridade",
    description: "Transparência e ética em todas as relações comerciais.",
  },
];

const areas = [
  "Telecomunicações",
  "Tecnologias de Informação",
  "Automação Industrial",
  "Instalações Elétricas",
  "Energia Solar",
  "Vídeo Vigilância",
  "Formação Profissional",
  "Manutenção Preventiva",
];

export default function Sobre() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Sobre a CMTTECH
          </h1>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Conheça a nossa história, missão e valores que nos guiam na prestação de serviços de excelência.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={cmttechLogo} alt="CMTTECH" className="h-16 w-auto rounded" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">CMTTECH SOLUÇÕES</h2>
                  <span className="text-muted-foreground">(SU), LDA</span>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A CMTTECH SOLUÇÕES (SU) LDA é uma empresa de direito angolano com o NIF 5000504327, 
                com sede na província da Huíla, município do Lubango, cujo objeto social é a prestação 
                de serviços em Telecomunicações, Tecnologias de Informação, Automação e Eletricidade.
              </p>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Prestamos serviços especializados de alto nível para a satisfação dos nossos clientes, 
                desde o ato das negociações, início do trabalho, até à entrega deste. Garantimos uma 
                relação com os nossos clientes de forma credibilizada quanto ao custo benefício dos 
                serviços, com o objetivo de satisfazer ambas as partes.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Atuamos rigorosamente nos parâmetros de Análise, Design, Desenvolvimento, 
                Implementação e a Manutenção de Infraestruturas e Sistemas.
              </p>
            </div>

            <div className="space-y-6">
              {/* Mission */}
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="h-6 w-6 text-secondary" />
                    <h3 className="text-xl font-bold text-foreground">Missão</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Apoiar no desenvolvimento das instituições públicas e privadas com soluções 
                    de tecnologias de Informação e sistemas de Telecomunicações.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-secondary" />
                    <h3 className="text-xl font-bold text-foreground">Princípios e Valores</h3>
                  </div>
                  <p className="text-muted-foreground">
                    A nossa empresa possui capital humano de elevada capacidade intelectual, 
                    firmado no conhecimento e experiência. Estamos continuamente em busca de 
                    novos conhecimentos e valores, em relação às melhores práticas e experiências 
                    no mercado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted">
        <div className="container-padding mx-auto">
          <SectionTitle 
            title="Os Nossos Valores"
            subtitle="Os princípios que orientam o nosso trabalho e a relação com os clientes."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4">
                    <value.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <SectionTitle 
            title="Áreas de Atuação"
            subtitle="Oferecemos soluções completas em diversas áreas tecnológicas."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {areas.map((area, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-foreground font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-hero-gradient">
        <div className="container-padding mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Vamos Trabalhar Juntos?
          </h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para conhecer melhor os nossos serviços e como podemos ajudar a sua empresa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contactos">
              <Button variant="hero" size="xl" className="gap-2">
                Entrar em Contacto
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="heroOutline" size="xl">
                Ver Portfólio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
