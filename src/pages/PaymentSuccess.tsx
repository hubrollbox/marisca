import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";

type OrderItem = {
  quantity: number;
  state: string;
  unit_price: number | string;
  products: { name: string } | null;
};

type Order = {
  id: string;
  payment_status: string;
  status: string;
  delivery_fee: number | string;
  total_amount: number | string;
  delivery_time_slot: string | null;
  order_items: OrderItem[];
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // The Stripe webhook is the only component allowed to confirm payment.
        // This page is read-only and briefly polls while the webhook is processed.
        for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
          const { data, error } = await supabase
            .from("orders")
            .select(`
              id, payment_status, status, delivery_fee, total_amount, delivery_time_slot,
              order_items (quantity, state, unit_price, products (name))
            `)
            .eq("stripe_session_id", sessionId)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            const currentOrder = data as unknown as Order;
            if (!cancelled) setOrder(currentOrder);
            if (currentOrder.payment_status === "paid") {
              if (!cancelled) clear();
              break;
            }
          }

          if (attempt < 5) await wait(1500);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clear]);

  const paymentConfirmed = order?.payment_status === "paid";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sky">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">A confirmar o pagamento</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="text-center">
          <CardHeader>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${paymentConfirmed ? "bg-green-100" : "bg-amber-100"}`}>
              {paymentConfirmed
                ? <CheckCircle className="w-8 h-8 text-green-600" />
                : <Clock className="w-8 h-8 text-amber-600" />}
            </div>
            <CardTitle className={`text-2xl ${paymentConfirmed ? "text-green-700" : "text-amber-700"}`}>
              {paymentConfirmed ? "Pagamento confirmado" : "Pagamento em confirmação"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {paymentConfirmed
                ? "A sua encomenda foi recebida e será processada em breve."
                : "Ainda não foi possível confirmar o pagamento. Não volte a pagar. Consulte novamente dentro de instantes ou contacte-nos se a situação se mantiver."}
            </p>

            {order && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Encomenda #{order.id.slice(0, 8)}
                </h3>
                <div className="space-y-2 text-sm">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between gap-3">
                      <span>{item.quantity}x {item.products?.name ?? "Produto"} ({item.state})</span>
                      <span>€{(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {Number(order.delivery_fee) > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span>€{Number(order.delivery_fee).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
                {order.delivery_time_slot && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Entrega:</strong> {order.delivery_time_slot}
                    </p>
                  </div>
                )}
              </div>
            )}

            {paymentConfirmed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">O que acontece agora?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>Confirmaremos a sua encomenda.</li>
                  <li>Prepararemos o seu marisco.</li>
                  <li>Entregaremos no horário escolhido.</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
                Ver encomendas
              </Button>
              <Button onClick={() => navigate("/")} className="flex-1 bg-gradient-sunset">
                <Home className="w-4 h-4 mr-2" />
                Continuar compras
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
