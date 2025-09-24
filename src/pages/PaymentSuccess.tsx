import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      fetchOrderBySessionId();
    }
  }, [sessionId]);

  const fetchOrderBySessionId = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            state,
            products (name, price)
          )
        `)
        .eq('stripe_payment_intent_id', sessionId)
        .single();

      if (error) throw error;
      setOrder(data);

      // Update payment status to paid
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'confirmado' 
        })
        .eq('id', data.id);

    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sky">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              A sua encomenda foi recebida e será processada em breve.
            </p>

            {order && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Encomenda #{order.id.slice(0, 8)}
                </h3>
                
                <div className="space-y-2 text-sm">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.products.name} ({item.state})</span>
                      <span>€{(item.products.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span>€{parseFloat(order.delivery_fee).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{parseFloat(order.total_amount).toFixed(2)}</span>
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

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">O que acontece agora?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Confirmaremos a sua encomenda em breve</li>
                  <li>✓ Prepararemos o seu marisco fresco</li>
                  <li>✓ Entregaremos no horário escolhido</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1"
                >
                  Ver Encomendas
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gradient-sunset"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continuar Compras
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}