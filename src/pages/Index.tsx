import { useState } from "react";
import { CartFooter } from "../components/ui/cart-footer";
import { ProductCard } from "../components/ui/product-card";
import { useProducts } from "../hooks/use-products";
import { Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Testimonials } from "../components/Testimonials";
import { generateWebsiteSchema } from "../utils/schema-markup";
import { Button } from "../components/ui/button";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, isLoading, isError, refetch } = useProducts();

  const filteredProducts =
    products?.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="min-h-screen bg-gradient-sand">
      <SEO
        title="Marisca - Da Maré para a Sua Mesa"
        description="Marisco fresco da lota para a sua mesa em poucas horas. Frescura, autenticidade e qualidade diretamente do mar."
        canonical="https://marisca.pt"
        schemaMarkup={generateWebsiteSchema()}
      />

      <Header showSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <section className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
        <img
          src="/hero-home.jpg"
          alt="Barco de pesca e armadilhas na praia, costa portuguesa"
          className="w-full h-full object-cover object-[50%_60%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-heading font-bold text-primary-foreground mb-1">
            Marisco Fresco da Costa Portuguesa
          </h1>
          <p className="text-primary-foreground/90 text-sm">Da maré para a sua mesa, em horas.</p>
        </div>
      </section>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-semibold text-foreground">Produtos Disponíveis</h2>
          <span className="text-sm text-muted-foreground">{filteredProducts.length} produtos</span>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-24">
          {isLoading ? (
            <div className="flex items-center justify-center py-8" role="status" aria-label="A carregar produtos">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-muted-foreground">Não foi possível carregar os produtos.</p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </main>

      <Testimonials />

      <CartFooter />

      <Footer />
    </div>
  );
}
