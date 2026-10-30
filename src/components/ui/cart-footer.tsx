import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { SALE_BLOCK_LABELS, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";
import { STATE_LABELS } from "@/components/ui/product-card";

/** Barra do carrinho fixa no fundo do ecrã. Lê tudo do carrinho, sem props. */
export function CartFooter() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {
    items, updateQuantity, removeItem, totalItems, subtotal, deliveryFee, total,
    hasPriceChanges, hasBlockingIssues, acceptCurrentPrices,
  } = useCart();

  if (totalItems === 0) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-ocean shadow-elegant z-50">
          <Button
            className="w-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="flex-1 text-left">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
              {(hasPriceChanges || hasBlockingIssues) && " · rever"}
            </span>
            <span className="font-bold">€{total.toFixed(2)}</span>
          </Button>
        </div>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-left font-heading">Carrinho</SheetTitle>
        </SheetHeader>

        {hasPriceChanges && (
          <div className="mt-3 rounded-lg border border-secondary bg-muted p-3 text-sm">
            <p className="font-medium">Alguns preços mudaram desde que adicionou os produtos.</p>
            <p className="text-muted-foreground">Os preços do marisco acompanham a lota do dia.</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={acceptCurrentPrices}>
              Entendido
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.state}`}
              className="flex items-center gap-3 p-3 bg-card rounded-lg border"
            >
              {item.product.image_url ? (
                <img src={item.product.image_url} alt={item.product.name} className="w-14 h-14 object-cover rounded-md" />
              ) : (
                <div className="w-14 h-14 rounded-md bg-muted" aria-hidden />
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">{STATE_LABELS[item.state]}</Badge>
                  <span className="text-xs text-muted-foreground">
                    €{item.product.price.toFixed(2)}
                    {item.previousPrice !== null && (
                      <span className="line-through ml-1">€{item.previousPrice.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                {item.block && (
                  <p className="text-xs font-medium text-destructive">
                    {SALE_BLOCK_LABELS[item.block]}
                    {item.block === "insufficient_stock" && item.product.stock !== null && ` (máx. ${item.product.stock})`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={item.quantity === 1 ? "Remover" : "Diminuir"}
                  onClick={() =>
                    item.quantity === 1
                      ? removeItem(item.product.id, item.state)
                      : updateQuantity(item.product.id, item.state, item.quantity - 1)
                  }
                >
                  {item.quantity === 1 ? <X className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </Button>
                <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Aumentar"
                  disabled={item.block !== null && item.block !== "insufficient_stock" ? true : item.block === "insufficient_stock"}
                  onClick={() => updateQuantity(item.product.id, item.state, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entrega</span>
            <span>{deliveryFee === 0 ? "Grátis" : `€${deliveryFee.toFixed(2)}`}</span>
          </div>
          {deliveryFee > 0 && (
            <p className="text-xs text-muted-foreground">
              Entrega grátis a partir de €{FREE_DELIVERY_THRESHOLD.toFixed(2)}
            </p>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">€{total.toFixed(2)}</span>
          </div>
          {hasBlockingIssues && (
            <p className="text-xs text-destructive">Remova ou ajuste os produtos assinalados para continuar.</p>
          )}
          <Button
            onClick={() => {
              setIsOpen(false);
              navigate("/checkout");
            }}
            variant="cta"
            size="lg"
            className="w-full"
            disabled={hasBlockingIssues}
          >
            Finalizar Encomenda
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
