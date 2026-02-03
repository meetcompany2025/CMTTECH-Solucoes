import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, User, LogOut, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import cmttechLogo from "@/assets/cmttech-logo.jpg";
import { CartButton } from "@/components/cart/CartButton";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Loja", href: "/loja" },
  { name: "Serviços", href: "/servicos" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Sobre Nós", href: "/sobre" },
  { name: "Contactos", href: "/contactos" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <nav className="container-padding mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={cmttechLogo} alt="CMTTECH Soluções" className="h-10 w-auto rounded" />
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-primary">CMTTECH</span>
            <span className="block text-xs text-muted-foreground">SOLUÇÕES</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                location.pathname === item.href
                  ? "text-secondary bg-secondary/10"
                  : "text-foreground hover:text-secondary hover:bg-secondary/5"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <CartButton />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Minha Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/minha-conta" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Área de Cliente
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-pedidos" className="cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Meus Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Terminar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}
          
          <a href="tel:+244942546887">
            <Button variant="ghost" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">+244 942 546 887</span>
            </Button>
          </a>
          <Link to="/contactos">
            <Button variant="hero" size="sm">
              Pedir Orçamento
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-effect border-t border-border">
          <div className="container-padding py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === item.href
                    ? "text-secondary bg-secondary/10"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/minha-conta" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Área de Cliente
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full gap-2" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                    <LogOut className="h-4 w-4" />
                    Terminar Sessão
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Entrar / Registar
                  </Button>
                </Link>
              )}
              <a href="tel:+244942546887" className="w-full">
                <Button variant="ghost" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  +244 942 546 887
                </Button>
              </a>
              <Link to="/contactos" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="hero" className="w-full">
                  Pedir Orçamento
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
