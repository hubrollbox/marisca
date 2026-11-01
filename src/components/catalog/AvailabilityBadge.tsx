import { Badge } from "@/components/ui/badge";
import { saleBlock } from "@/lib/pricing";
import { availabilityLabel } from "@/lib/catalog";
import type { Product } from "@/hooks/use-products";

/** Etiqueta de disponibilidade: Disponível hoje / Esgotado / Em defeso / Indisponível */
export function AvailabilityBadge({ product, className }: { product: Product; className?: string }) {
  const blocked = saleBlock(product, 1) !== null;
  return (
    <Badge variant={blocked ? "destructive" : "secondary"} className={className}>
      {availabilityLabel(product)}
    </Badge>
  );
}
