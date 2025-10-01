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
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { addressSchema, guestEmailSchema, checkoutNotesSchema } from "@/lib/validations";
import { ArrowLeft, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= 30 ? 0 : 4.99;
  const totalAmount = subtotal + deliveryFee;

  const timeSlots = [
    "10:00 - 12:00",
    "12:00 - 14:00", 
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
  ];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Collect form data
      const formData = new FormData(e.target as HTMLFormElement);
      const deliveryAddress = {
        name: formData.get('name') as string,
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        phone: formData.get('phone') as string,
      };

      // Validate form data
      addressSchema.parse(deliveryAddress);
      
      if (!user && guestEmail) {
        guestEmailSchema.parse({ email: guestEmail });
      }
      
      if (notes) {
        checkoutNotesSchema.parse({ notes });
      }

      const timeSlot = formData.get('timeSlot') as string;
      if (!timeSlot) {
        toast({
          title: "Horário obrigatório",
          description: "Por favor selecione um horário de entrega",
          variant: "destructive",
        });
        return;
      }

      // Prepare payment request
      const paymentRequest = {
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          state: item.state
        })),
        deliveryAddress,
        deliveryTimeSlot: timeSlot,
        notes,
        guestEmail: !user ? guestEmail : undefined
      };

      // Call the edge function to create payment session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentRequest
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Erro ao processar pagamento",
          description: "Tente novamente em alguns momentos",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.open(data.url, '_blank');
        clear();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar sessão de pagamento",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error submitting order:', error);
      const errorMessage = error.name === 'ZodError' 
        ? `Erro de validação: ${error.errors[0]?.message}`
        : 'Erro ao processar pedido';
      
      toast({
        title: "Erro no pedido",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                <span>€{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input 
                    id="guestEmail" 
                    name="guestEmail" 
                    type="email" 
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required 
                  />
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A processar...
                </>
              ) : (
                `Confirmar Encomenda - €${totalAmount.toFixed(2)}`
              )}
            </Button>
        </form>
      </div>
    </div>
  );
}