import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[72px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}
