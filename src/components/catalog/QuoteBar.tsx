import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

/** Barra fixa no fundo: leva ao pedido de orçamento. Não mostra preços. */
export function QuoteBar() {
  const navigate = useNavigate();
  const { items } = useCart();
  const count = items.length;
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary-foreground/10 bg-primary p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-elegant">
      <div className="mx-auto max-w-md">
        <Button variant="cta" size="lg" className="h-12 w-full rounded-full text-base" onClick={() => navigate("/checkout")}>
          Pedir orçamento · {count} {count === 1 ? "item" : "itens"}
        </Button>
      </div>
    </div>
  );
}
