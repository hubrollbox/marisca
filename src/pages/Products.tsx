import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ui/product-card";
import { CartFooter } from "@/components/ui/cart-footer";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { generateBreadcrumbSchema } from "@/utils/schema-markup";

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: products, isLoading } = useProducts();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const categories = ["all", "Crustáceos", "Bivalves", "Moluscos", "Peixes"];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

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
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Produtos de Marisco Fresco"
        description="Descubra a nossa seleção de marisco fresco da costa portuguesa. Lagosta, camarão, amêijoas, percebes e muito mais."
        canonical="https://marisca.pt/produtos"
        schemaMarkup={generateBreadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Produtos", url: "/produtos" }
        ])}
      />
      
      <Header 
        showSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
      />

      <main className="container mx-auto px-4 pb-32">
        <Breadcrumbs 
          items={[
            { label: "Produtos" }
          ]}
        />

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nossos Produtos</h1>
          <p className="text-muted-foreground">
            Marisco fresco da lota para a sua mesa, em horas
          </p>
        </header>

        {/* Category Filter */}
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2" aria-label="Filtros de categoria">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category === "all" ? "Todos" : category}
            </button>
          ))}
        </nav>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar a sua pesquisa ou volte mais tarde
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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