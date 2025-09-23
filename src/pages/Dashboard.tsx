import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, User, LogOut, Loader2 } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_fee: number;
  delivery_time_slot?: string;
  created_at: string;
  delivery_address: any;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    state: string;
    products: {
      name: string;
      image_url?: string;
    };
  }>;
}

const statusLabels = {
  pendente: "Pendente",
  confirmado: "Confirmado", 
  preparado: "Preparado",
  em_entrega: "Em Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado"
};

const statusIcons = {
  pendente: Clock,
  confirmado: CheckCircle,
  preparado: Package,
  em_entrega: Truck,
  entregue: CheckCircle,
  cancelado: Clock
};

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800", 
  preparado: "bg-purple-100 text-purple-800",
  em_entrega: "bg-orange-100 text-orange-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            state,
            products (
              name,
              image_url
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar encomendas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
            >
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

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Encomendas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Ainda não tem encomendas</p>
                <Button 
                  onClick={() => navigate("/")}
                  className="mt-4 bg-gradient-sunset"
                >
                  Fazer primeira encomenda
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                  const statusColor = statusColors[order.status as keyof typeof statusColors];
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
                        <Badge className={statusColor}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <img 
                              src={item.products.image_url || "/placeholder.svg"}
                              alt={item.products.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="flex-1">{item.products.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.state}
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