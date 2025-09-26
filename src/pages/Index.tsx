import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartFooter } from "@/components/ui/cart-footer";
import { ProductCard } from "@/components/ui/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Search, User, Loader2, MapPin } from "lucide-react";
import { MariscaLogo } from "@/components/MariscaLogo";
import heroImage from "@/assets/hero-seafood.jpg";
import { useCart } from "@/hooks/use-cart";

export default function Index() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const { data: products, isLoading } = useProducts();
  const { user } = useAuth();

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addToCart = (product: any, quantity: number, state: "CRU" | "COZIDO") => {
    addItem(product, quantity, state);
    toast({ title: "Adicionado ao carrinho", description: `${quantity}x ${product.name} (${state})` });
  };

  const handleUpdateQuantity = (productId: string, state: "CRU" | "COZIDO", newQuantity: number) => {
    updateQuantity(productId, state, newQuantity);
  };

  const handleRemoveItem = (productId: string, state: "CRU" | "COZIDO") => {
    removeItem(productId, state);
    toast({ title: "Removido do carrinho", description: "Item removido com sucesso" });
  };

  const onCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-sand">
      {/* Header */}
      <header className="bg-gradient-ocean text-white sticky top-0 z-40 shadow-elegant">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MariscaLogo size="sm" className="filter brightness-0 invert" />
              <div>
                <h1 className="text-xl font-bold tracking-wide">Marisca</h1>
                <p className="text-white/80 text-xs">A essência que vem do mar</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => user ? navigate("/dashboard") : navigate("/auth")}
              className="hover:bg-white/10"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Procurar marisco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Marisco fresco"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl font-bold text-white mb-1">
            Marisco Fresco da Costa Portuguesa
          </h2>
          <p className="text-white/80 text-sm">
            Entregue em casa em menos de 2 horas
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Produtos Disponíveis
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} produtos
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 pb-24">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      </main>

      <CartFooter
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={onCheckout}
      />
    </div>
  );
}
