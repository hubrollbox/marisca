import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Product } from "@/components/ui/product-card";

export interface CartItem {
  product: Product;
  quantity: number;
  state: "CRU" | "COZIDO";
}

interface CartFooterProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, state: "CRU" | "COZIDO", newQuantity: number) => void;
  onRemoveItem: (productId: string, state: "CRU" | "COZIDO") => void;
  onCheckout: () => void;
}

export function CartFooter({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartFooterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (totalItems === 0) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-ocean shadow-ocean z-50">
            <Button 
              className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="flex-1 text-left">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
              <span className="font-bold">€{totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle className="text-left">Carrinho de Compras</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full mt-4">
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.product.id}-${item.state}`}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border"
                >
                  <img 
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.state}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        €{item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (item.quantity === 1) {
                          onRemoveItem(item.product.id, item.state);
                        } else {
                          onUpdateQuantity(item.product.id, item.state, item.quantity - 1);
                        }
                      }}
                      className="h-8 w-8"
                    >
                      {item.quantity === 1 ? <X className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    </Button>
                    
                    <span className="font-semibold w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.product.id, item.state, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="font-semibold text-sm">
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  onCheckout();
                }}
                className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold py-3"
                size="lg"
              >
                Finalizar Encomenda
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}