import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { SALE_BLOCK_LABELS } from "@/lib/pricing";
import { STATE_LABELS, PRICE_ON_QUOTE } from "@/lib/catalog";
import { buildSubmitOrderBody, quoteFormSchema, quoteSuccessMessage } from "@/lib/quote-request";
import { ArrowLeft, CheckCircle, Clock, MapPin, Loader2 } from "lucide-react";

const TIME_SLOTS = ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];
const NO_SLOT = "sem-preferencia";

/** Lê a mensagem de erro PT-PT que a função devolve ({ error }). */
async function readFunctionError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (typeof body?.error === "string") return body.error;
    } catch {
      // resposta sem JSON
    }
  }
  return "Não foi possível enviar o pedido. Tente novamente em alguns momentos.";
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, hasBlockingIssues, catalogLoaded, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", street: "", city: "", postalCode: "",
  });
  const [timeSlot, setTimeSlot] = useState(NO_SLOT);
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: tem de ficar vazio

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
    setForm((f) => ({
      ...f,
      email: f.email || user?.email || "",
      street: f.street || savedAddress?.street || "",
      city: f.city || savedAddress?.city || "",
      postalCode: f.postalCode || savedAddress?.postal_code || "",
    }));
  }, [savedAddress, user]);

  const setField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = quoteFormSchema.safeParse({
      ...form,
      deliveryTimeSlot: timeSlot === NO_SLOT ? undefined : timeSlot,
      notes: notes || undefined,
    });
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const body = buildSubmitOrderBody(
        parsed.data,
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity, state: i.state })),
        website,
      );
      const { data, error } = await supabase.functions.invoke("submit-order", { body });
      if (error) {
        toast({ title: "Pedido não enviado", description: await readFunctionError(error), variant: "destructive" });
        return;
      }
      if (!data?.ok || typeof data.orderRef !== "string") {
        toast({ title: "Pedido não enviado", description: data?.error ?? "Tente novamente.", variant: "destructive" });
        return;
      }
      // Só limpa o carrinho depois da confirmação do servidor
      setSuccessRef(data.orderRef);
      clear();
    } catch (err) {
      console.error("Error submitting quote:", err);
      toast({ title: "Pedido não enviado", description: "Tente novamente em alguns momentos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (successRef) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-md mx-auto mt-8 text-center">
          <CardContent className="p-6 space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-primary" />
            <p className="text-lg font-heading font-semibold" role="status">{quoteSuccessMessage(successRef)}</p>
            <Button onClick={() => navigate("/")} variant="cta" className="w-full min-h-11">Voltar à loja</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto py-8 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Pedido vazio</h1>
          <p className="text-muted-foreground mb-6">Escolha os produtos para pedir orçamento.</p>
          <Button onClick={() => navigate("/")} variant="cta" className="min-h-11">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-md mx-auto p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-heading font-semibold">Pedir orçamento</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O seu pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.state}`} className="flex items-center gap-3">
                {item.product.image_url && (
                  <img src={item.product.image_url} alt="" className="w-14 h-14 object-cover rounded-md" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{STATE_LABELS[item.state]}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity}
                      {item.product.unit ? ` ${item.product.unit}` : "x"}
                    </span>
                  </div>
                  {item.block && (
                    <p className="text-xs font-medium text-destructive">{SALE_BLOCK_LABELS[item.block]}</p>
                  )}
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span>{items.length} {items.length === 1 ? "item" : "itens"}</span>
              <span className="font-semibold">{PRICE_ON_QUOTE}</span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Honeypot anti-spam: invisível para pessoas */}
          <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contacto e entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" autoComplete="name" value={form.name} onChange={setField("name")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={form.email} onChange={setField("email")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={setField("phone")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" autoComplete="street-address" placeholder="Rua, número, andar" value={form.street} onChange={setField("street")} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Localidade</Label>
                  <Input id="city" autoComplete="address-level2" value={form.city} onChange={setField("city")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código postal</Label>
                  <Input id="postalCode" autoComplete="postal-code" inputMode="numeric" placeholder="0000-000" value={form.postalCode} onChange={setField("postalCode")} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário preferido (opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger aria-label="Horário preferido" className="min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SLOT}>Sem preferência</SelectItem>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                aria-label="Notas"
                placeholder="Tamanho preferido, instruções de entrega..."
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Pedido de orçamento, sem obrigação de pagamento. Enviamos o preço, a data e a hora de entrega e as
              formas de pagamento. O contrato só se forma quando aceitar o orçamento.
            </p>
            <p>Produtos perecíveis: não há direito de livre resolução depois da entrega do orçamento aceite.</p>
          </div>

          <Button
            type="submit"
            variant="cta"
            className="w-full min-h-11"
            size="lg"
            disabled={loading || hasBlockingIssues || !catalogLoaded}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A enviar...
              </>
            ) : hasBlockingIssues ? (
              "Reveja o pedido"
            ) : (
              "Enviar pedido de orçamento"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
