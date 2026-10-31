import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { ArrowLeft, Package, ShoppingCart, TrendingUp, Loader2, LogOut, Inbox } from "lucide-react";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminInbox } from "@/components/admin/AdminInbox";

const TABS = [
  { id: "overview", label: "Visão Geral", icon: TrendingUp },
  { id: "orders", label: "Encomendas", icon: ShoppingCart },
  { id: "products", label: "Produtos", icon: Package },
  { id: "inbox", label: "Pedidos", icon: Inbox },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Admin() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="A carregar">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
            <p className="text-muted-foreground mb-4">Não tem permissões para aceder a esta área.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar à loja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Voltar à loja">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Gestão Marisca</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Terminar sessão"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex gap-2 mt-4 overflow-x-auto" aria-label="Secções">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "inbox" && <AdminInbox />}
      </div>
    </div>
  );
}
