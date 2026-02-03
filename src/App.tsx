import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Loja from "./pages/Loja";
import ProductDetails from "./pages/ProductDetails";
import Servicos from "./pages/Servicos";
import Portfolio from "./pages/Portfolio";
import Sobre from "./pages/Sobre";
import Contactos from "./pages/Contactos";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ClientArea from "./pages/ClientArea";
import UserOrders from "./pages/UserOrders";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminRoute } from "@/components/routing/admin-route";
import { AdminLayout } from "@/components/layout/admin-layout";
import AdminDashboard from "./pages/admin/dashboard";
import ProductsList from "./pages/admin/products/list";
import ProductForm from "./pages/admin/products/form";
import CategoriesList from "./pages/admin/categories/list";
import CategoryForm from "./pages/admin/categories/form";
import OrdersList from "./pages/admin/orders/list";
import OrderDetails from "./pages/admin/orders/details";
import StockOverview from "./pages/admin/stock/overview";
import StockAlertsList from "./pages/admin/stock/alerts/list";
import StockAlertForm from "./pages/admin/stock/alerts/form";
import CustomersList from "./pages/admin/customers/list";
import CustomerDetails from "./pages/admin/customers/details";
import PaymentsList from "./pages/admin/payments/list";
import DeliveryMethodsList from "./pages/admin/sales/delivery-methods";
import CouponsList from "./pages/admin/sales/coupons";
import SettingsList from "./pages/admin/settings/index";
import UserProfile from "./pages/admin/profile/index";
import AuditLogsList from "./pages/admin/audit-logs/index";
import NotificationsList from "./pages/admin/notifications/index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/loja" element={<Loja />} />
                <Route path="/produto/:id" element={<ProductDetails />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contactos" element={<Contactos />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/minha-conta" element={<ClientArea />} />
                <Route path="/meus-pedidos" element={<UserOrders />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="categories/new" element={<CategoryForm />} />
                <Route path="categories/:id/edit" element={<CategoryForm />} />
                <Route path="orders" element={<OrdersList />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="stock" element={<StockOverview />} />
                <Route path="stock/alerts" element={<StockAlertsList />} />
                <Route path="stock/alerts/new" element={<StockAlertForm />} />
                <Route path="stock/alerts/:id" element={<StockAlertForm />} />
                <Route path="payments" element={<PaymentsList />} />
                <Route path="customers" element={<CustomersList />} />
                <Route path="customers/:id" element={<CustomerDetails />} />
                <Route path="delivery-methods" element={<DeliveryMethodsList />} />
                <Route path="coupons" element={<CouponsList />} />
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="audit-logs" element={<AuditLogsList />} />
                <Route path="settings" element={<SettingsList />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
