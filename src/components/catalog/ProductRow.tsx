import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Product } from "@/hooks/use-products";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { ProductOrderControls, useProductLine } from "./ProductOrderControls";

/** Uma linha compacta do catálogo. Sem preço; miniatura só se houver foto. */
export function ProductRow({ product }: { product: Product }) {
  const { totalForProduct } = useProductLine(product);
  const selected = totalForProduct > 0;

  return (
    <li
      className={cn(
        "rounded-lg border p-3 transition-colors",
        selected ? "border-primary bg-cream" : "border-border bg-card",
      )}
    >
      <div className="flex items-start gap-3">
        {product.image_url && (
          <img
            src={product.image_url}
            alt=""
            className="h-14 w-14 shrink-0 rounded-md object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <Link
            to={`/produtos/${product.id}`}
            className="block font-heading text-base font-bold leading-tight text-foreground underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
          {product.scientific_name && (
            <p className="truncate text-xs italic text-muted-foreground">{product.scientific_name}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <AvailabilityBadge product={product} />
            {product.unit && (
              <span className="text-xs text-muted-foreground">{product.unit === "kg" ? "Ao kg" : "À unidade"}</span>
            )}
          </div>
        </div>
      </div>
      <ProductOrderControls product={product} className="mt-2" />
    </li>
  );
}
