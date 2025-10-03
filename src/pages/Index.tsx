import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartFooter } from "@/components/ui/cart-footer";
import { ProductCard } from "@/components/ui/product-card";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import heroImage from "@/assets/hero-seafood.jpg";
import { useCart } from "@/hooks/use-cart";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Testimonials } from "@/components/Testimonials";
import { generateWebsiteSchema } from "@/utils/schema-markup";

export default function Index() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const { data: products, isLoading } = useProducts();

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
      <SEO
        title="Marisca - Da Maré para a Sua Mesa"
        description="Marisco fresco da lota para a sua mesa em poucas horas. Frescura, autenticidade e qualidade diretamente do mar."
        canonical="https://marisca.pt"
        schemaMarkup={generateWebsiteSchema()}
      />
      
      <Header 
        showSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
      />

      {/* Hero Section */}
      <section className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Marisco fresco da costa portuguesa"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-bold text-white mb-1">
            Marisco Fresco da Costa Portuguesa
          </h1>
          <p className="text-white/80 text-sm">
            Da lota para a sua mesa, em horas
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
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image_url || "/placeholder.svg",
                  weight: product.weight || "",
                  available: product.available,
                  states: product.states,
                  prepTime: product.prep_time || "",
                  description: product.description || "",
                  stock: product.stock,
                }}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      </main>

      <Testimonials />

      <CartFooter
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={onCheckout}
      />

      <Footer />
    </div>
  );
}
