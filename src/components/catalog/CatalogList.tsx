import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/use-products";
import { groupByCategory, PRICE_ON_QUOTE } from "@/lib/catalog";
import { ProductRow } from "./ProductRow";

/** Catálogo público: chips de categoria + lista agrupada. */
export function CatalogList({ searchTerm = "" }: { searchTerm?: string }) {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const [active, setActive] = useState<string>("all");

  const groups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = (products ?? []).filter(
      (p) =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.scientific_name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
    );
    return groupByCategory(filtered);
  }, [products, searchTerm]);

  const visible = active === "all" ? groups : groups.filter((g) => g.category === active);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10" role="status" aria-label="A carregar produtos">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 py-8 text-center">
        <p className="text-muted-foreground">Não foi possível carregar os produtos.</p>
        <Button variant="outline" className="min-h-11" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {groups.length > 1 && (
        <nav
          className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
          aria-label="Categorias"
        >
          {[{ category: "all" }, ...groups].map(({ category }) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {category === "all" ? "Todos" : category}
            </button>
          ))}
        </nav>
      )}

      <p className="mb-4 text-sm text-muted-foreground">
        {PRICE_ON_QUOTE} — o valor final depende da lota do dia e do peso.
      </p>

      {visible.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
        </p>
      ) : (
        <div className="space-y-6">
          {visible.map((group) => (
            <section key={group.category} aria-labelledby={`cat-${group.category}`}>
              <h2
                id={`cat-${group.category}`}
                className="mb-2 font-heading text-sm font-bold uppercase tracking-wide text-foreground"
              >
                {group.category}
              </h2>
              <ul className="space-y-2">
                {group.products.map((p) => (
                  <ProductRow key={p.id} product={p} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
