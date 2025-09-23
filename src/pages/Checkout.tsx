import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartItem } from "@/components/ui/cart-footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete: () => void;
}

export default function Checkout({ items, onOrderComplete }: CheckoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= 30 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  const timeSlots = [
    "10:00 - 12:00",
    "12:00 - 14:00", 
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      user_id: user?.id || null,
      guest_email: user ? null : formData.get("email") as string,
      total_amount: total,
      delivery_fee: deliveryFee,
      delivery_address: {
        name: formData.get("name") as string,
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postalCode") as string,
        phone: formData.get("phone") as string,
      },
      delivery_time_slot: formData.get("timeSlot") as string,
      notes: formData.get("notes") as string,
      payment_method: "pending",
    };

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        state: item.state,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Encomenda criada com sucesso!",
        description: `Número da encomenda: ${order.id.slice(0, 8)}`,
      });

      onOrderComplete();
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao criar encomenda",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione produtos ao carrinho para continuar.
          </p>
          <Button onClick={() => navigate("/")} className="bg-gradient-sunset">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às Compras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Finalizar Encomenda</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo da Encomenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.state}`} className="flex items-center gap-3">
                <img 
                  src={item.product.image_url || item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.state}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity}x €{item.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-sm">
                  €{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} itens)</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>{deliveryFee === 0 ? "GRÁTIS" : `€${deliveryFee.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" required />
              </div>
              
              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Morada</Label>
                <Input id="street" name="street" placeholder="Rua, número, andar" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input id="postalCode" name="postalCode" placeholder="0000-000" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select name="timeSlot" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                placeholder="Instruções especiais para entrega..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O pagamento será processado na entrega ou através de link seguro.
              </p>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold py-3"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A processar...
              </>
            ) : (
              `Confirmar Encomenda - €${total.toFixed(2)}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}