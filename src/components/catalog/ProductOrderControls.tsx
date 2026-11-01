import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import type { Product, ProductState } from "@/hooks/use-products";
import { saleBlock } from "@/lib/pricing";
import { STATE_LABELS } from "@/lib/catalog";
import { useState } from "react";

/** Linha do pedido deste produto (estado escolhido + quantidade), lida diretamente do carrinho. */
export function useProductLine(product: Product) {
  const { items } = useCart();
  const lines = items.filter((i) => i.product.id === product.id);
  const [localState, setLocalState] = useState<ProductState>(product.states[0]);
  const state = lines[0]?.state ?? (product.states.includes(localState) ? localState : product.states[0]);
  const quantity = lines.find((l) => l.state === state)?.quantity ?? 0;
  const totalForProduct = lines.reduce((s, l) => s + l.quantity, 0);
  return { state, quantity, totalForProduct, setLocalState };
}

export function StateToggle({
  product,
  state,
  onChange,
  className,
}: {
  product: Product;
  state: ProductState;
  onChange: (s: ProductState) => void;
  className?: string;
}) {
  if (product.states.length < 2) return null;
  return (
    <div
      role="radiogroup"
      aria-label={`Preparação de ${product.name}`}
      className={cn("inline-flex rounded-full border border-border bg-background p-0.5", className)}
    >
      {product.states.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={state === s}
          onClick={() => onChange(s)}
          className={cn(
            "min-h-11 min-w-[4.5rem] rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            state === s ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
          )}
        >
          {STATE_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

export function QuantityStepper({
  product,
  quantity,
  canIncrease,
  onChange,
}: {
  product: Product;
  quantity: number;
  canIncrease: boolean;
  onChange: (q: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Quantidade de ${product.name}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 0}
        aria-label={`Diminuir ${product.name}`}
      >
        <Minus />
      </Button>
      <span className="min-w-[3rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
        {product.unit && <span className="ml-0.5 font-normal text-muted-foreground">{product.unit}</span>}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full"
        onClick={() => onChange(quantity + 1)}
        disabled={!canIncrease}
        aria-label={`Aumentar ${product.name}`}
      >
        <Plus />
      </Button>
    </div>
  );
}

/** Alternador Cru/Cozido + seletor de quantidade, ligados ao pedido. */
export function ProductOrderControls({ product, className }: { product: Product; className?: string }) {
  const { setLineQuantity, changeLineState } = useCart();
  const { state, quantity, totalForProduct, setLocalState } = useProductLine(product);
  const canIncrease = saleBlock(product, totalForProduct + 1) === null;

  const handleState = (s: ProductState) => {
    setLocalState(s);
    if (quantity > 0) changeLineState(product, state, s);
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <StateToggle product={product} state={state} onChange={handleState} />
      <div className="ml-auto">
        <QuantityStepper
          product={product}
          quantity={quantity}
          canIncrease={canIncrease}
          onChange={(q) => setLineQuantity(product, state, q)}
        />
      </div>
    </div>
  );
}
