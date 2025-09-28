import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { MariscaLogo } from "@/components/MariscaLogo";
import { ProductCard } from "@/components/ui/product-card";
import { CartFooter } from "@/components/ui/cart-footer";
import { Footer } from "@/components/Footer";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, isLoading } = useProducts();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addToCart = (product: any, quantity: number, state: "CRU" | "COZIDO") => {
    addItem(product, quantity, state);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const handleUpdateQuantity = (productId: string, state: "CRU" | "COZIDO", newQuantity: number) => {
    updateQuantity(productId, state, newQuantity);
  };

  const handleRemoveItem = (productId: string, state: "CRU" | "COZIDO") => {
    removeItem(productId, state);
  };

  const onCheckout = () => {
    window.location.href = "/checkout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <MariscaLogo className="h-8" />
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nossos Produtos</h1>
          <p className="text-muted-foreground">
            Marisco fresco da lota para a sua mesa, em horas
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar a sua pesquisa ou volte mais tarde
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
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

export default Products;