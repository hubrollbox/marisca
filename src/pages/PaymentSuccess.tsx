import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, Loader2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { STATE_LABELS } from "@/components/ui/product-card";

interface OrderSummary {
  id: string;
  reference: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_fee: number;
  delivery_time_slot: string | null;
  items: Array<{ name: string; quantity: number; state: "CRU" | "COZIDO"; unit_price: number }>;
}

const MAX_WAIT_MS = 60_000;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();
  const startedAt = useRef(Date.now());
  const cleared = useRef(false);

  // A confirmação vem da Stripe (servidor). Aqui só lemos o estado e esperamos por ela.
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order-status", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<OrderSummary>("order-status", {
        body: { session_id: sessionId },
      });
      if (error) throw error;
      return data!;
    },
    refetchInterval: (query) => {
      const o = query.state.data;
      if (o && o.payment_status !== "pending") return false;
      return Date.now() - startedAt.current < MAX_WAIT_MS ? 2500 : false;
    },
    retry: 2,
  });

  const paid = order?.payment_status === "paid";
  const failed = order?.payment_status === "failed";
  const waiting = !!order && !paid && !failed;
  const gaveUp = waiting && Date.now() - startedAt.current >= MAX_WAIT_MS;

  useEffect(() => {
    if (paid && !cleared.current) {
      cleared.current = true;
      clear();
    }
  }, [paid, clear]);

  if (!sessionId || isError) {
    return (
      <div className="min-h-screen bg-gradient-sand p-4 flex items-center">
        <Card className="max-w-md mx-auto text-center p-6 space-y-4">
          <h1 className="text-xl font-heading font-bold">Não encontrámos esta encomenda</h1>
          <p className="text-muted-foreground text-sm">
            Se pagou, receberá um email de confirmação. Pode também contactar-nos: info@marisca.pt
          </p>
          <Button onClick={() => navigate("/")} variant="cta">Voltar à loja</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sand" role="status" aria-label="A confirmar">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sand p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              {paid ? (
                <CheckCircle className="w-8 h-8 text-primary" />
              ) : failed ? (
                <XCircle className="w-8 h-8 text-destructive" />
              ) : (
                <Clock className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-heading text-primary">
              {paid ? "Pagamento Confirmado!" : failed ? "Pagamento não concluído" : "A confirmar pagamento…"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground" aria-live="polite">
              {paid
                ? "A sua encomenda foi recebida. Enviámos a confirmação por email."
                : failed
                  ? "O pagamento foi cancelado ou expirou. O seu carrinho continua guardado."
                  : gaveUp
                    ? "Ainda não recebemos a confirmação do banco. Receberá um email assim que ficar confirmado."
                    : "Estamos à espera da confirmação do banco. Demora normalmente poucos segundos."}
            </p>

            {order && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Encomenda #{order.reference}
                </h3>
                <div className="space-y-2 text-sm">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between gap-2">
                      <span>
                        {item.quantity}x {item.name} ({STATE_LABELS[item.state] ?? item.state})
                      </span>
                      <span>€{(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span>€{order.delivery_fee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                {order.delivery_time_slot && (
                  <p className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                    <strong>Entrega:</strong> {order.delivery_time_slot}
                  </p>
                )}
              </div>
            )}

            {paid && (
              <div className="bg-secondary/40 border border-secondary rounded-lg p-4 text-left">
                <h4 className="font-medium text-primary mb-2">O que acontece agora?</h4>
                <ul className="text-sm text-foreground space-y-1">
                  <li>✓ Selecionamos o seu marisco na lota</li>
                  <li>✓ Preparamos a encomenda com cuidado</li>
                  <li>✓ Entregamos no horário escolhido</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              {failed ? (
                <Button onClick={() => navigate("/checkout")} variant="cta" className="flex-1">
                  Tentar novamente
                </Button>
              ) : (
                <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
                  Ver Encomendas
                </Button>
              )}
              <Button onClick={() => navigate("/")} variant={failed ? "outline" : "cta"} className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
