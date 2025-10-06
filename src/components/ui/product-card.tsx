import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  weight?: string;
  available: boolean;
  states: Array<"CRU" | "COZIDO" | "GRELHADO">;
  prepTime?: string;
  prep_time?: string;
  description?: string;
  stock?: number;
  category?: string;
  slug?: string;
  scientific_name?: string;
  presentation?: string;
  average_weight?: string;
  ideal_conservation?: string;
  quality_checklist?: string;
  closed_season?: string;
  origin?: string;
  legal_notes?: string;
  sensory_description?: string;
  consumption_suggestion?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, state: "CRU" | "COZIDO" | "GRELHADO") => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedState, setSelectedState] = useState<"CRU" | "COZIDO" | "GRELHADO">(product.states[0]);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedState);
    setIsOpen(false);
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-200",
          "hover:shadow-float hover:-translate-y-1",
          !product.available && "opacity-60"
        )}>
          <div className="aspect-square relative">
            <img 
              src={product.image_url || product.image || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {product.available && (
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 bg-accent text-accent-foreground font-medium"
              >
                Disponível hoje
              </Badge>
            )}
          </div>
          
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{product.weight}</div>
              <div className="font-bold text-lg text-primary">€{product.price.toFixed(2)}</div>
            </div>
            <div className="flex gap-1">
              {product.states.map((state) => (
                <Badge key={state} variant="outline" className="text-xs">
                  {state}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md mx-4">
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img 
              src={product.image_url || product.image || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
            {product.description && (
              <p className="text-muted-foreground text-sm">{product.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              {product.weight && (
                <span className="text-muted-foreground">{product.weight}</span>
              )}
              <span className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</span>
            </div>

            {product.states.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado:</label>
                <div className="flex gap-2">
                  {product.states.map((state) => (
                    <Button
                      key={state}
                      variant={selectedState === state ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedState(state)}
                      className="flex-1"
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {(product.prepTime || product.prep_time) && (
              <div className="text-sm text-muted-foreground">
                Tempo de preparação: {product.prepTime || product.prep_time}
              </div>
            )}

            <Button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold py-3"
              disabled={!product.available}
            >
              Adicionar por €{(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}