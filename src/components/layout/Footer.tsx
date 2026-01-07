import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import cmttechLogo from "@/assets/cmttech-logo.jpg";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-padding mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={cmttechLogo} alt="CMTTECH" className="h-12 w-auto rounded" />
              <div>
                <h3 className="text-xl font-bold">CMTTECH</h3>
                <span className="text-sm text-primary-foreground/70">SOLUÇÕES (SU), LDA</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Empresa angolana especializada em Telecomunicações, Tecnologias de Informação, 
              Automação e Eletricidade, com sede na província da Huíla.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { name: "Início", href: "/" },
                { name: "Loja Online", href: "/loja" },
                { name: "Serviços", href: "/servicos" },
                { name: "Portfólio", href: "/portfolio" },
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Contactos", href: "/contactos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Redes de Dados e Fibra Óptica</li>
              <li>Vídeo Vigilância</li>
              <li>Automação Industrial</li>
              <li>Instalações Elétricas</li>
              <li>Sistemas Solares</li>
              <li>Manutenção Preventiva</li>
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contactos</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Lubango, Huíla, Angola
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <div className="text-sm text-primary-foreground/80">
                  <a href="tel:+244942546887" className="block hover:text-primary-foreground">+244 942 546 887</a>
                  <a href="tel:+244942594868" className="block hover:text-primary-foreground">+244 942 594 868</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <a href="mailto:comercial@cmttechsolucoes.com" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  comercial@cmttechsolucoes.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2025 CMTTECH SOLUÇÕES (SU), LDA. Todos os direitos reservados.</p>
            <p>NIF: 5000504327</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
