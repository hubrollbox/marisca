import { useState } from "react";
import { Header } from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CatalogList } from "../components/catalog/CatalogList";
import { QuoteBar } from "../components/catalog/QuoteBar";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { generateBreadcrumbSchema } from "../utils/schema-markup";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Produtos de Marisco Fresco"
        description="Descubra a nossa seleção de marisco fresco da costa portuguesa. Lagosta, camarão, amêijoas, percebes e muito mais."
        canonical="https://marisca.pt/produtos"
        schemaMarkup={generateBreadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Produtos", url: "/produtos" },
        ])}
      />

      <Header showSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="max-w-md mx-auto px-4 pb-32">
        <Breadcrumbs items={[{ label: "Produtos" }]} />

        <header className="mb-4">
          <h1 className="text-2xl font-heading font-bold mb-1">Os nossos produtos</h1>
          <p className="text-muted-foreground">Marisco fresco da lota para a sua mesa, em horas.</p>
        </header>

        <CatalogList searchTerm={searchTerm} />
      </main>

      <Footer />

      <QuoteBar />
    </div>
  );
};

export default Products;
