import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useProducts } from "../hooks/use-products";
import { Header } from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductCard } from "../components/ui/product-card";
import { CartFooter } from "../components/ui/cart-footer";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { generateBreadcrumbSchema } from "../utils/schema-markup";
import { cn } from "../lib/utils";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: products, isLoading, isError, refetch } = useProducts();

  // Categorias tiradas dos próprios produtos (sem listas fixas que se desatualizam)
  const categories = useMemo(() => {
    const set = new Set((products ?? []).map((p) => p.category).filter(Boolean) as string[]);
    return ["all", ...[...set].sort((a, b) => a.localeCompare(b, "pt"))];
  }, [products]);

  const term = searchTerm.toLowerCase();
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="A carregar">
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

        {categories.length > 1 && (
          <nav className="flex gap-2 mb-8 overflow-x-auto pb-2" aria-label="Filtros de categoria">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap transition-all",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80",
                )}
                aria-pressed={selectedCategory === category}
              >
                {category === "all" ? "Todos" : category}
              </button>
            ))}
          </nav>
        )}

        {isError ? (
          <Card className="p-8 text-center space-y-3">
            <p className="text-muted-foreground">Não foi possível carregar os produtos.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar a sua pesquisa ou volte mais tarde</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <CartFooter />
    </div>
  );
};

export default Products;