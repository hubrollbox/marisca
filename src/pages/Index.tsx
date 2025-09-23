import { useState } from "react";
import { ProductCard, Product } from "@/components/ui/product-card";
import { CartFooter, CartItem } from "@/components/ui/cart-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import heroSeafood from "@/assets/hero-seafood.jpg";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product, quantity: number, state: "CRU" | "COZIDO") => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.state === state
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { product, quantity, state }]);
    }

    toast({
      title: "Adicionado ao carrinho",
      description: `${quantity}x ${product.name} (${state})`,
    });
  };

  const handleUpdateQuantity = (productId: string, state: "CRU" | "COZIDO", newQuantity: number) => {
    setCartItems(cartItems.map(item =>
      item.product.id === productId && item.state === state
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveItem = (productId: string, state: "CRU" | "COZIDO") => {
    setCartItems(cartItems.filter(item =>
      !(item.product.id === productId && item.state === state)
    ));
    
    toast({
      title: "Removido do carrinho",
      description: "Item removido com sucesso",
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Funcionalidade em desenvolvimento. Conecte ao Supabase para finalizar!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="bg-gradient-ocean text-white sticky top-0 z-40 shadow-ocean">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">MariscoFresh</h1>
              <p className="text-white/80 text-sm">Marisco fresco ao domicílio</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin className="w-4 h-4" />
              <span>Lisboa, Porto</span>
            </div>
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
          src={heroSeafood} 
          alt="Marisco fresco"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Marisco Fresco da Costa Portuguesa
          </h2>
          <p className="text-muted-foreground">
            Entregue em casa em menos de 2 horas
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Produtos Disponíveis
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} produtos
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      <CartFooter
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
