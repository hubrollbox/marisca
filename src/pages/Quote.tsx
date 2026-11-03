import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarClock, CheckCircle, Loader2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { STATE_LABELS } from "@/lib/catalog";
import { orderStatusLabel } from "@/lib/order-status";
import {
  ACCEPT_WARNING,
  EXPIRED_QUOTE_TEXT,
  PAYMENT_OPTION_LABELS,
  QuoteError,
  availablePaymentOptions,
  formatDeliveryDate,
  formatEur,
  formatQty,
  formatValidUntil,
  lineSubtotal,
  paymentMethodLabel,
  pendingQuoteText,
  shouldReloadAfterAcceptError,
  toQuoteError,
  weightToleranceText,
  type PaymentMethod,
  type Quote as QuoteData,
  type QuoteItem,
} from "@/lib/quote-view";

const stateLabel = (s: string) => (STATE_LABELS as Record<string, string>)[s] ?? s;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Orçamento" description="O seu orçamento Marisca." />
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-11 w-11">
            <Link to="/" aria-label="Voltar à loja">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-heading font-semibold">Orçamento</h1>
        </div>
      </div>
      <main className="max-w-2xl mx-auto p-4 space-y-6">{children}</main>
    </div>
  );
}

function Notice({ children, action = true }: { children: React.ReactNode; action?: boolean }) {
  return (
    <Card className="text-center">
      <CardContent className="p-6 space-y-4">
        <p className="text-lg font-heading font-semibold" role="status">{children}</p>
        {action && (
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/produtos">Ver produtos</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ItemsList({ items }: { items: QuoteItem[] }) {
  return (
    <>
      {/* Mobile: uma ficha por produto */}
      <ul className="sm:hidden divide-y">
        {items.map((item, i) => {
          const sub = lineSubtotal(item);
          return (
            <li key={i} className="py-3 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{item.name}</span>
                <Badge variant="outline" className="text-xs">{stateLabel(item.state)}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 text-sm">
                <dt className="text-muted-foreground">{item.finalQty != null ? "Peso real" : "Peso estimado"}</dt>
                <dd className="text-right">{formatQty(item.finalQty ?? item.estimatedQty, item.unit)}</dd>
                <dt className="text-muted-foreground">Preço por {item.unit}</dt>
                <dd className="text-right">{formatEur(item.unitPrice)}</dd>
                <dt className="text-muted-foreground">{sub.isFinal ? "Subtotal" : "Subtotal estimado"}</dt>
                <dd className="text-right font-semibold">{formatEur(sub.value)}</dd>
              </dl>
            </li>
          );
        })}
      </ul>

      {/* Ecrãs maiores: tabela */}
      <table className="hidden sm:table w-full text-sm">
        <caption className="sr-only">Produtos do orçamento</caption>
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-2 pr-2 font-medium">Produto</th>
            <th scope="col" className="py-2 px-2 font-medium">Cru/Cozido</th>
            <th scope="col" className="py-2 px-2 font-medium text-right">Peso estimado</th>
            <th scope="col" className="py-2 px-2 font-medium text-right">Preço kg/un</th>
            <th scope="col" className="py-2 pl-2 font-medium text-right">Subtotal estimado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const sub = lineSubtotal(item);
            return (
              <tr key={i} className="border-b last:border-0">
                <th scope="row" className="py-2 pr-2 font-medium text-left">{item.name}</th>
                <td className="py-2 px-2">{stateLabel(item.state)}</td>
                <td className="py-2 px-2 text-right">
                  {formatQty(item.estimatedQty, item.unit)}
                  {item.finalQty != null && (
                    <span className="block text-xs text-muted-foreground">Real: {formatQty(item.finalQty, item.unit)}</span>
                  )}
                </td>
                <td className="py-2 px-2 text-right">{formatEur(item.unitPrice)}/{item.unit}</td>
                <td className="py-2 pl-2 text-right font-semibold">
                  {formatEur(sub.value)}
                  {sub.isFinal && <span className="block text-xs font-normal text-muted-foreground">final</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default function Quote() {
  const { token = "" } = useParams<{ token: string }>();
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const quoteQuery = useQuery<QuoteData, QuoteError>({
    queryKey: ["quote", token],
    enabled: !!token,
    retry: (count, err) => err.status == null || (err.status >= 500 && count < 2),
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-quote", { body: { token } });
      if (error) throw await toQuoteError(error, "Não foi possível abrir o orçamento. Tente novamente.");
      return data as QuoteData;
    },
  });

  const quote = quoteQuery.data;
  const options = availablePaymentOptions(quote?.paymentOptions);

  useEffect(() => {
    if (options.length === 1) setMethod(options[0]);
  }, [options.length, options[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  const accept = useMutation({
    mutationFn: async (paymentMethod: PaymentMethod) => {
      const { data, error } = await supabase.functions.invoke("accept-quote", { body: { token, paymentMethod } });
      if (error) throw await toQuoteError(error, "Não foi possível aceitar o orçamento. Tente novamente.");
      return data as { ok: boolean; orderRef: string; status: string; paymentMethod: string };
    },
    onMutate: () => setAcceptError(null),
    onSuccess: (data) => {
      setConfirmation(
        `Orçamento #${data.orderRef} aceite. Encomenda confirmada. Pagamento: ${paymentMethodLabel(data.paymentMethod)}.`,
      );
      quoteQuery.refetch();
    },
    onError: (err: unknown) => {
      const e = err instanceof QuoteError ? err : new QuoteError("Não foi possível aceitar o orçamento.", null);
      setAcceptError(e.message);
      if (shouldReloadAfterAcceptError(e.status)) quoteQuery.refetch();
    },
  });

  if (quoteQuery.isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-16" role="status">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">A carregar o orçamento…</span>
        </div>
      </Shell>
    );
  }

  if (quoteQuery.isError || !quote) {
    return (
      <Shell>
        <Notice>{quoteQuery.error?.message ?? "Orçamento não encontrado."}</Notice>
      </Shell>
    );
  }

  if (quote.status === "pendente") {
    return (
      <Shell>
        <Notice action={false}>{pendingQuoteText(quote.orderRef)}</Notice>
      </Shell>
    );
  }

  if (quote.status === "expirado") {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Pedido #{quote.orderRef}</p>
        <Notice>{EXPIRED_QUOTE_TEXT}</Notice>
      </Shell>
    );
  }

  const validity = formatValidUntil(quote.validUntil);
  const deliveryDate = formatDeliveryDate(quote.deliveryDate);

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-heading font-bold">Pedido #{quote.orderRef}</h2>
          {validity && quote.canAccept && <p className="text-sm text-muted-foreground">{validity}</p>}
        </div>
        <Badge variant="secondary" className="text-sm">{orderStatusLabel(quote.status)}</Badge>
      </div>

      {confirmation && (
        <div className="flex items-start gap-3 rounded-lg border border-success bg-success/10 p-4" role="status">
          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-medium">{confirmation}</p>
        </div>
      )}

      {quote.status === "aceite" && !confirmation && (
        <p className="rounded-lg border p-4 font-medium" role="status">
          Orçamento aceite. Pagamento: {paymentMethodLabel(quote.paymentMethod)}.
        </p>
      )}

      {quote.message && (
        <blockquote className="border-l-4 border-primary pl-4 font-quote italic text-foreground">
          {quote.message}
        </blockquote>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produtos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ItemsList items={quote.items ?? []} />
          <Separator />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Taxa de entrega</dt>
              <dd>{formatEur(quote.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between text-base font-heading font-bold">
              <dt>TOTAL ESTIMADO</dt>
              <dd>{formatEur(quote.estimatedTotal)}</dd>
            </div>
            {quote.finalTotal != null && (
              <div className="flex justify-between text-base font-heading font-bold text-primary">
                <dt>Total final</dt>
                <dd>{formatEur(quote.finalTotal)}</dd>
              </div>
            )}
          </dl>
          <p className="flex gap-2 text-sm text-muted-foreground">
            <Scale className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            {weightToleranceText(quote.weightTolerancePct)}
          </p>
        </CardContent>
      </Card>

      {(deliveryDate || quote.deliverySlot) && (
        <Card>
          <CardContent className="p-4 flex gap-3">
            <CalendarClock className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium">Entrega</p>
              <p className="text-sm">
                {deliveryDate && <span className="inline-block first-letter:uppercase">{deliveryDate}</span>}
                {deliveryDate && quote.deliverySlot && " · "}
                {quote.deliverySlot}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {quote.canAccept && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirmar encomenda</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (method) accept.mutate(method);
              }}
            >
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium mb-2">Forma de pagamento</legend>
                <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="space-y-2">
                  {options.map((opt) => (
                    <Label
                      key={opt}
                      htmlFor={`pay-${opt}`}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem id={`pay-${opt}`} value={opt} />
                      {PAYMENT_OPTION_LABELS[opt]}
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              {acceptError && (
                <p className="text-sm font-medium text-destructive" role="alert">{acceptError}</p>
              )}

              <p className="text-sm font-medium">{ACCEPT_WARNING}</p>
              <Button
                type="submit"
                variant="cta"
                className="w-full min-h-12 text-base"
                disabled={!method || accept.isPending}
              >
                {accept.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Aceitar orçamento e confirmar encomenda
              </Button>
              {!method && options.length > 1 && (
                <p className="text-xs text-muted-foreground text-center">Escolha a forma de pagamento.</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </Shell>
  );
}
