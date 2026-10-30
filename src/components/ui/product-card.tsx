import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductState } from "@/hooks/use-products";
import { saleBlock, SALE_BLOCK_LABELS } from "@/lib/pricing";

export const STATE_LABELS: Record<ProductState, string> = { CRU: "Cru", COZIDO: "Cozido" };

function ProductImage({ product, className }: { product: Product; className?: string }) {
  if (!product.image_url) {
    return (
      <div className={cn("w-full h-full bg-muted flex items-center justify-center", className)}>
        <p className="text-muted-foreground text-sm font-medium">Foto em breve</p>
      </div>
    );
  }
  return (
    <img
      src={product.image_url}
      alt={product.name}
      className={cn("w-full h-full object-cover", className)}
      loading="lazy"
    />
  );
}

/** Etiqueta de disponibilidade: Disponível hoje / Esgotado / Em defeso / Indisponível */
export function AvailabilityBadge({ product, className }: { product: Product; className?: string }) {
  const block = saleBlock(product, 1);
  if (block) {
    return (
      <Badge variant="destructive" className={className}>
        {SALE_BLOCK_LABELS[block]}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className={className}>
      Disponível hoje
    </Badge>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<ProductState>(product.states[0]);

  const inCart = items.filter((i) => i.product.id === product.id).reduce((s, i) => s + i.quantity, 0);
  const block = saleBlock(product, inCart + quantity);
  const canIncrease = product.stock === null || inCart + quantity < product.stock;

  const handleAdd = () => {
    addItem(product, quantity, state);
    toast({ title: "Adicionado ao carrinho", description: `${quantity}x ${product.name} (${STATE_LABELS[state]})` });
    setIsOpen(false);
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-elegant hover:-translate-y-1",
            saleBlock(product, 1) && "opacity-70",
          )}
        >
          <div className="aspect-square relative">
            <ProductImage product={product} />
            <AvailabilityBadge product={product} className="absolute top-2 right-2" />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-heading font-semibold text-foreground line-clamp-2">{product.name}</h3>
            {product.scientific_name && (
              <p className="text-xs text-muted-foreground italic line-clamp-1">{product.scientific_name}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{product.weight}</div>
              <div className="font-bold text-lg text-primary">€{product.price.toFixed(2)}</div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md mx-4">
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <ProductImage product={product} />
          </div>

          <div className="space-y-3">
            <DialogTitle className="text-xl font-heading font-bold text-foreground">{product.name}</DialogTitle>
            {product.scientific_name && <p className="text-xs text-muted-foreground italic">{product.scientific_name}</p>}
            {product.description && <p className="text-muted-foreground text-sm">{product.description}</p>}

            <div className="flex items-center justify-between">
              {product.weight && <span className="text-muted-foreground">{product.weight}</span>}
              <span className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</span>
            </div>

            {product.states.length > 1 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Preparação:</span>
                <div className="flex gap-2">
                  {product.states.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={state === s ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setState(s)}
                      aria-pressed={state === s}
                    >
                      {STATE_LABELS[s]}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8"
                  disabled={!canIncrease}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-muted-foreground">Restam {product.stock} unidades</p>
            )}

            <Button onClick={handleAdd} size="lg" variant="cta" className="w-full" disabled={!!block}>
              {block ? SALE_BLOCK_LABELS[block] : `Adicionar por €${(product.price * quantity).toFixed(2)}`}
            </Button>
            <Link
              to={`/produtos/${product.id}`}
              className="block text-center text-sm text-primary underline-offset-4 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Ver ficha completa
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
