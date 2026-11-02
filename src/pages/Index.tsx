import { useState } from "react";
import { QuoteBar } from "../components/catalog/QuoteBar";
import { CatalogList } from "../components/catalog/CatalogList";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Testimonials } from "../components/Testimonials";
import { generateWebsiteSchema } from "../utils/schema-markup";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Marisca - Da Maré para a Sua Mesa"
        description="Marisco fresco da lota para a sua mesa em poucas horas. Frescura, autenticidade e qualidade diretamente do mar."
        canonical="https://marisca.pt"
        schemaMarkup={generateWebsiteSchema()}
      />

      <Header showSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <section className="relative h-36 sm:h-48 overflow-hidden">
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

      <main className="max-w-md mx-auto px-4 py-6 pb-28">
        <h2 className="mb-4 text-lg font-heading font-semibold text-foreground">Disponível hoje</h2>
        <CatalogList searchTerm={searchTerm} />
      </main>

      <Testimonials />

      <Footer />

      <QuoteBar />
    </div>
  );
}
