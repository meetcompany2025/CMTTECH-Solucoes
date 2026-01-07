import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ArrowRight, ExternalLink } from "lucide-react";

const categories = [
  { id: "all", name: "Todos" },
  { id: "redes", name: "Redes de Dados" },
  { id: "fibra", name: "Fibra Óptica" },
  { id: "cctv", name: "Vídeo Vigilância" },
  { id: "automacao", name: "Automação" },
  { id: "solar", name: "Energia Solar" },
  { id: "eletrico", name: "Instalações Elétricas" },
];

const projects = [
  {
    id: 1,
    title: "ENDE Lunda Sul",
    description: "Implementação de rede de dados, rede estabilizada e uma rede sem fio ponto a ponto de 1.5 km.",
    category: "redes",
    client: "ENDE",
    location: "Lunda Sul, Angola",
  },
  {
    id: 2,
    title: "Estádio Nacional da Tundavala",
    description: "Manutenção da rede de cobre e óptica para infraestrutura desportiva.",
    category: "fibra",
    client: "Governo da Huíla",
    location: "Lubango, Huíla",
  },
  {
    id: 3,
    title: "EMADEL - Zona Económica Especial",
    description: "Implementação de uma rede ponto a ponto para a Zona Económica Especial.",
    category: "redes",
    client: "EMADEL",
    location: "Angola",
  },
  {
    id: 4,
    title: "Omatapalo - Condomínio",
    description: "Implementação de rede ponto multiponto incluindo partilha de internet com sistema UniFi.",
    category: "redes",
    client: "Omatapalo",
    location: "Angola",
  },
  {
    id: 5,
    title: "ENDE Huíla - Vídeo Vigilância",
    description: "Implementação de sistema de vídeo vigilância no Posto de Seccionamento da Matala.",
    category: "cctv",
    client: "ENDE",
    location: "Matala, Huíla",
  },
  {
    id: 6,
    title: "SIEMA - Interligação Fibra",
    description: "Interligação de sites de rede de fibra óptica para empresa industrial.",
    category: "fibra",
    client: "SIEMA",
    location: "Angola",
  },
  {
    id: 7,
    title: "Consórcio Omatapalo e Mota Engil",
    description: "Interligação de fibra óptica entre estaleiro e Barragem Kuvelai.",
    category: "fibra",
    client: "Omatapalo / Mota Engil",
    location: "Calucuve, Angola",
  },
  {
    id: 8,
    title: "Angola Telecom - Rede Metro",
    description: "Reparação de avaria com corte total na rede metro.",
    category: "fibra",
    client: "Angola Telecom",
    location: "Angola",
  },
  {
    id: 9,
    title: "EPAS Huíla - Automação",
    description: "Manutenção preventiva de infraestrutura de automação do sistema de captação de água.",
    category: "automacao",
    client: "EPAS Huíla",
    location: "Lubango, Huíla",
  },
  {
    id: 10,
    title: "Governo da Huíla - Painéis LED",
    description: "Reparação dos painéis de LED no Pavilhão Nossa Senhora do Monte e Estádio da Tundavala.",
    category: "eletrico",
    client: "Governo da Huíla",
    location: "Lubango, Huíla",
  },
  {
    id: 11,
    title: "Polícia Nacional - Centro de Monitoramento",
    description: "Implementação de um centro de monitoramento para a Polícia Nacional.",
    category: "cctv",
    client: "Polícia Nacional",
    location: "Angola",
  },
  {
    id: 12,
    title: "Banco Atlântico - Manutenção",
    description: "Contrato de manutenção preventiva e corretiva de infraestrutura e equipamentos.",
    category: "redes",
    client: "Banco Atlântico",
    location: "Várias Províncias",
  },
  {
    id: 13,
    title: "Banco BAI - Sistema Elétrico",
    description: "Subcontratação para manutenção preventiva e corretiva do sistema elétrico.",
    category: "eletrico",
    client: "Banco BAI",
    location: "Angola",
  },
  {
    id: 14,
    title: "Hotel Chick Chick - Quadros Elétricos",
    description: "Manutenção corretiva em quadros elétricos do hotel.",
    category: "eletrico",
    client: "Hotel Chick Chick",
    location: "Angola",
  },
  {
    id: 15,
    title: "Fazenda - Painéis Solares",
    description: "Instalação de painéis solares para captação em furo de água.",
    category: "solar",
    client: "Fazenda Privada",
    location: "Huíla, Angola",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = projects.filter(
    (project) => activeCategory === "all" || project.category === activeCategory
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Portfólio de Projetos
          </h1>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Conheça alguns dos projetos que realizámos para empresas e instituições de referência em Angola.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover-lift overflow-hidden">
                <div className="h-2 bg-tech-gradient" />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                      {categories.find((c) => c.id === project.category)?.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium text-foreground">{project.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Local:</span>
                      <span className="font-medium text-foreground">{project.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted">
        <div className="container-padding mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Seu Projeto Pode Ser o Próximo
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para discutir como podemos ajudar a sua empresa.
          </p>
          <Link to="/contactos">
            <Button variant="secondary" size="xl" className="gap-2">
              Iniciar um Projeto
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
