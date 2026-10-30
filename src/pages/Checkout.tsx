import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FunctionsHttpError } from "@supabase/supabase-js";
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
import { SALE_BLOCK_LABELS, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";
import { STATE_LABELS } from "@/components/ui/product-card";
import { ArrowLeft, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";

const TIME_SLOTS = ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];

type Problem = { id: string; name: string; reason: string };

/** Lê a mensagem de erro que a função de pagamento devolve. */
async function readFunctionError(error: unknown): Promise<{ message: string; problems?: Problem[] }> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      return { message: body?.error ?? "Erro ao processar pagamento", problems: body?.problems };
    } catch {
      // resposta sem JSON
    }
  }
  return { message: "Erro ao processar pagamento. Tente novamente em alguns momentos." };
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    items, totalItems, subtotal, deliveryFee, total, hasBlockingIssues, catalogLoaded,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState({ name: "", street: "", city: "", postalCode: "", phone: "" });
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Pré-preencher com a morada favorita do cliente
  const { data: savedAddress } = useQuery({
    queryKey: ["default-address", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!savedAddress) return;
    setAddress((a) => ({
      ...a,
      street: a.street || savedAddress.street,
      city: a.city || savedAddress.city,
      postalCode: a.postalCode || savedAddress.postal_code,
    }));
  }, [savedAddress]);

  useEffect(() => {
    if (searchParams.get("cancelado")) {
      toast({ title: "Pagamento cancelado", description: "O seu carrinho continua guardado." });
    }
  }, [searchParams]);

  const setField = (field: keyof typeof address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProblems([]);

    const parsedAddress = addressSchema.safeParse(address);
    if (!parsedAddress.success) {
      toast({ title: "Verifique a morada", description: parsedAddress.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    let validatedGuestEmail: string | undefined;
    if (!user) {
      const parsedEmail = guestEmailSchema.safeParse({ email: guestEmail });
      if (!parsedEmail.success) {
        toast({ title: "Email inválido", description: parsedEmail.error.errors[0]?.message, variant: "destructive" });
        return;
      }
      validatedGuestEmail = parsedEmail.data.email;
    }
    const parsedNotes = checkoutNotesSchema.safeParse({ notes: notes || undefined });
    if (!parsedNotes.success) {
      toast({ title: "Observações demasiado longas", variant: "destructive" });
      return;
    }
    if (!timeSlot) {
      toast({ title: "Horário obrigatório", description: "Selecione um horário de entrega", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Só enviamos o quê e quanto — o preço é sempre calculado no servidor
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          items: items.map((i) => ({ id: i.product.id, quantity: i.quantity, state: i.state })),
          deliveryAddress: parsedAddress.data,
          deliveryTimeSlot: timeSlot,
          notes: parsedNotes.data.notes,
          guestEmail: validatedGuestEmail,
        },
      });

      if (error) {
        const { message, problems: p } = await readFunctionError(error);
        if (p?.length) setProblems(p);
        toast({ title: "Não foi possível continuar", description: message, variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!data?.url) throw new Error("Sem link de pagamento");

      // Mesma janela; o carrinho só é limpo quando o pagamento estiver confirmado
      window.location.href = data.url;
    } catch (err) {
      console.error("Error submitting order:", err);
      toast({ title: "Erro no pedido", description: "Tente novamente em alguns momentos.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto py-8 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos ao carrinho para continuar.</p>
          <Button onClick={() => navigate("/")} variant="cta">
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
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-heading font-semibold">Finalizar Encomenda</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo da Encomenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.state}`} className="flex items-center gap-3">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded-md" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-muted" aria-hidden />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{STATE_LABELS[item.state]}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity}x €{item.product.price.toFixed(2)}
                    </span>
                  </div>
                  {item.block && (
                    <p className="text-xs font-medium text-destructive">{SALE_BLOCK_LABELS[item.block]}</p>
                  )}
                </div>
                <div className="font-semibold text-sm">€{(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            {problems.length > 0 && (
              <div className="rounded-md border border-destructive/40 p-3 text-sm" role="alert">
                {problems.map((p) => (
                  <p key={p.id + p.reason}>
                    <strong>{p.name}:</strong> {p.reason}
                  </p>
                ))}
              </div>
            )}

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
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground">
                  Entrega grátis a partir de €{FREE_DELIVERY_THRESHOLD.toFixed(2)}
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmitOrder} className="space-y-6" noValidate>
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
                <Input id="name" autoComplete="name" value={address.name} onChange={setField("name")} required />
              </div>

              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    autoComplete="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Sem conta? Não há problema — enviamos a confirmação para este email.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" autoComplete="tel" value={address.phone} onChange={setField("phone")} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Morada</Label>
                <Input
                  id="street"
                  autoComplete="street-address"
                  placeholder="Rua, número, andar"
                  value={address.street}
                  onChange={setField("street")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" autoComplete="address-level2" value={address.city} onChange={setField("city")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    placeholder="0000-000"
                    value={address.postalCode}
                    onChange={setField("postalCode")}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger aria-label="Horário de entrega">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                aria-label="Observações"
                placeholder="Instruções especiais para entrega..."
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vai ser encaminhado para a página segura da Stripe para pagar com cartão. Volta aqui automaticamente.
              </p>
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="cta"
            className="w-full py-3"
            size="lg"
            disabled={loading || hasBlockingIssues || !catalogLoaded}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A abrir pagamento...
              </>
            ) : hasBlockingIssues ? (
              "Reveja o carrinho"
            ) : (
              `Pagar €${total.toFixed(2)}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
