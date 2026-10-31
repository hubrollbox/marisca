import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Package, User, LogOut, Loader2 } from "lucide-react";
import { AddressManager } from "@/components/AddressManager";
import { STATE_LABELS } from "@/components/ui/product-card";
import {
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_ICONS,
  ORDER_STATUS_LABELS,
  isOrderStatus,
} from "@/lib/order-status";

interface Order {
  id: string;
  status: string;
  payment_status: string | null;
  total_amount: number;
  delivery_fee: number;
  delivery_time_slot?: string | null;
  created_at: string;
  delivery_address: unknown;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    state: "CRU" | "COZIDO";
    products: { name: string; image_url?: string | null } | null;
  }>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const { data: orders = [], isLoading: loadingOrders, isError, refetch } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items (quantity, unit_price, state, products (name, image_url))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Voltar">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">A Minha Conta</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Terminar sessão">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </CardContent>
        </Card>

        {/* Address Manager */}
        <AddressManager />

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Encomendas</CardTitle>
          </CardHeader>
          <CardContent>
            {isError ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-muted-foreground">Não foi possível carregar as encomendas.</p>
                <Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button>
              </div>
            ) : loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Ainda não tem encomendas</p>
                <Button onClick={() => navigate("/")} variant="cta" className="mt-4">
                  Fazer primeira encomenda
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = isOrderStatus(order.status) ? order.status : "pendente";
                  const StatusIcon = ORDER_STATUS_ICONS[status];
                  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            Encomenda #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                        <Badge className={ORDER_STATUS_CLASSES[status]}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.payment_status === "pending" && status === "pendente"
                            ? "A aguardar pagamento"
                            : ORDER_STATUS_LABELS[status]}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {item.products?.image_url ? (
                              <img src={item.products.image_url} alt={item.products.name} className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted" aria-hidden />
                            )}
                            <span className="flex-1">{item.products?.name ?? "Produto"}</span>
                            <Badge variant="outline" className="text-xs">
                              {STATE_LABELS[item.state] ?? item.state}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.quantity}x
                            </span>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.order_items.length - 2} itens adicionais
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                          </p>
                          {order.delivery_time_slot && (
                            <p className="text-xs text-muted-foreground">
                              {order.delivery_time_slot}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            €{parseFloat(order.total_amount.toString()).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}