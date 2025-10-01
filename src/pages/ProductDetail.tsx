import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartFooter } from "@/components/ui/cart-footer";
import { Footer } from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const [selectedState, setSelectedState] = useState<"CRU" | "COZIDO">("CRU");
  const [quantity, setQuantity] = useState(1);

  const product = products?.find(p => p.id === id);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedState);
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho`,
      });
    }
  };

  const handleUpdateQuantity = (productId: string, state: "CRU" | "COZIDO", newQuantity: number) => {
    updateQuantity(productId, state, newQuantity);
  };

  const handleRemoveItem = (productId: string, state: "CRU" | "COZIDO") => {
    removeItem(productId, state);
  };

  const onCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O produto que procura não existe ou foi removido
          </p>
          <Button onClick={() => navigate("/produtos")}>
            Ver todos os produtos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-32">
        <Breadcrumbs 
          items={[
            { label: "Produtos", path: "/produtos" },
            { label: product.name }
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-muted-foreground text-lg">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">
                €{product.price}
              </div>
              {product.weight && (
                <Badge variant="secondary">
                  {product.weight}
                </Badge>
              )}
            </div>

            {!product.available && (
              <Badge variant="destructive">
                Indisponível
              </Badge>
            )}

            {product.available && (
              <div className="space-y-4">
                {/* State Selection */}
                {product.states && product.states.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preparação:</label>
                    <div className="flex gap-2">
                      {product.states.map((state) => (
                        <Button
                          key={state}
                          variant={selectedState === state ? "default" : "outline"}
                          onClick={() => setSelectedState(state)}
                          className="flex-1"
                        >
                          {state === "CRU" ? "Cru" : "Cozido"}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 text-center font-medium">{quantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="conservation">Conservação</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.weight && (
                      <div>
                        <h4 className="font-semibold">Peso Médio</h4>
                        <p className="text-muted-foreground">{product.weight}</p>
                      </div>
                    )}
                    {product.prep_time && (
                      <div>
                        <h4 className="font-semibold">Tempo de Preparação</h4>
                        <p className="text-muted-foreground">{product.prep_time}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Origem</h4>
                      <p className="text-muted-foreground">Lota de Leixões</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conservation" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Conservação</h4>
                      <p className="text-muted-foreground">
                        Manter refrigerado entre 0°C e 4°C. Consumir no prazo de 24-48 horas após a entrega.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Entrega</h4>
                      <p className="text-muted-foreground">
                        Entrega no mesmo dia em embalagem isotérmica para manter a frescura.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Como sei se o marisco está fresco?</h4>
                      <p className="text-muted-foreground">
                        Todo o nosso marisco é entregue no mesmo dia da captura, garantindo máxima frescura.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Posso devolver se não estiver satisfeito?</h4>
                      <p className="text-muted-foreground">
                        Sim, garantimos a qualidade. Em caso de insatisfação, entre em contacto connosco.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {items.length > 0 && (
        <CartFooter
          items={items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={onCheckout}
        />
      )}
    </div>
  );
};

export default ProductDetail;