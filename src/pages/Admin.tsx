import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Package, Plus, Edit, Eye, Trash2, 
  Users, ShoppingCart, TrendingUp, Loader2,
  Settings, LogOut 
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  weight?: string;
  available: boolean;
  states: Array<"CRU" | "COZIDO">;
  stock?: number;
  image_url?: string;
  prep_time?: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  guest_email?: string;
  user_id?: string;
  order_items: Array<{
    quantity: number;
    products: { name: string };
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

export default function Admin() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    states: ["CRU"] as Array<"CRU" | "COZIDO">,
    stock: "",
    prep_time: ""
  });

  // Check if user is admin (simple check - in production use proper role system)
  const isAdmin = user?.email === "admin@marisca.pt" || user?.email?.includes("admin");

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    try {
      const [productsResult, ordersResult] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select(`
          *,
          order_items (
            quantity,
            products (name)
          )
        `).order("created_at", { ascending: false }).limit(20)
      ]);

      if (productsResult.error) throw productsResult.error;
      if (ordersResult.error) throw ordersResult.error;

      setProducts(productsResult.data || []);
      setOrders(ordersResult.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        weight: newProduct.weight,
        states: newProduct.states,
        stock: parseInt(newProduct.stock) || 0,
        prep_time: newProduct.prep_time,
        available: true
      });

      if (error) throw error;

      toast({
        title: "Produto criado",
        description: "Produto adicionado com sucesso",
      });

      setNewProduct({
        name: "",
        description: "",
        price: "",
        weight: "",
        states: ["CRU"],
        stock: "",
        prep_time: ""
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
        const { error } = await supabase
          .from("orders")
          .update({ status: newStatus as "pendente" | "confirmado" | "preparado" | "em_entrega" | "entregue" | "cancelado" })
          .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Estado atualizado",
        description: "Estado da encomenda atualizado com sucesso",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar estado",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
            <p className="text-muted-foreground mb-4">
              Não tem permissões para aceder a esta área.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar à loja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayOrders = orders.filter(order => 
    new Date(order.created_at).toDateString() === new Date().toDateString()
  );

  const todayRevenue = todayOrders.reduce((sum, order) => 
    sum + parseFloat(order.total_amount.toString()), 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: "overview", label: "Visão Geral", icon: TrendingUp },
              { id: "orders", label: "Encomendas", icon: ShoppingCart },
              { id: "products", label: "Produtos", icon: Package },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Encomendas Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayOrders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{todayRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Produtos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.available).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Encomendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString('pt-PT')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{statusLabels[order.status as keyof typeof statusLabels]}</Badge>
                          <p className="font-semibold">€{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Encomendas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">#{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString('pt-PT')}
                          </p>
                          <p className="text-sm">
                            Cliente: {order.guest_email || "Utilizador registado"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">€{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium">Itens:</p>
                        {order.order_items.map((item, index) => (
                          <p key={index} className="text-muted-foreground">
                            {item.quantity}x {item.products.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Produtos</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Novo Produto</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Nome do produto"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                        <Textarea
                          placeholder="Descrição"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Preço (EUR)"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                        <Input
                          placeholder="Peso (ex: 500g)"
                          value={newProduct.weight}
                          onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                        />
                        <Input
                          placeholder="Tempo de preparação (ex: 15-20 min)"
                          value={newProduct.prep_time}
                          onChange={(e) => setNewProduct({...newProduct, prep_time: e.target.value})}
                        />
                        <Input
                          type="number"
                          placeholder="Stock"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                        <Button onClick={handleCreateProduct} className="w-full">
                          Criar Produto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img 
                            src={product.image_url || "/placeholder.svg"} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.available && (
                            <Badge className="absolute top-2 right-2 bg-accent">
                              Disponível
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold">€{product.price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground">
                              Stock: {product.stock || 0}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {product.states.map((state) => (
                              <Badge key={state} variant="outline" className="text-xs">
                                {state}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}