import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Phone, ChevronDown, ChevronUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAdminOrders, useInvalidateAdmin, type AdminOrder } from "@/hooks/use-admin-data";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, orderStatusClass, orderStatusLabel } from "@/lib/order-status";
import { downloadCsv, ordersToCsv } from "@/lib/admin-reports";
import { orderRef } from "@/lib/admin-quote";
import { OrderWorkflow } from "./OrderWorkflow";

const PAYMENT_METHOD_LABELS: Record<string, string> = { online: "Online", entrega: "Na entrega" };
const PAYMENT_STATUS_LABELS: Record<string, string> = { paid: "Pago", pending: "Por pagar", failed: "Falhou" };

const eur = (n: number) => `€${n.toFixed(2).replace(".", ",")}`;

export function AdminOrders() {
  const { data: orders = [], isLoading, isError, refetch } = useAdminOrders(true);
  const invalidate = useInvalidateAdmin();
  const [filter, setFilter] = useState<string>("all");
  const [onlyPaid, setOnlyPaid] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const visible = orders.filter(
    (o) => (filter === "all" || o.status === filter) && (!onlyPaid || o.payment_status === "paid"),
  );

  const updateStatus = async (order: AdminOrder, status: string) => {
    const { error } = await supabase.from("orders").update({ status } as never).eq("id", order.id);
    if (error) {
      toast({ title: "Erro ao atualizar estado", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Pedido #${orderRef(order.id)}: ${orderStatusLabel(status)}` });
    invalidate.orders();
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Pedidos</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCsv(`pedidos-${new Date().toISOString().slice(0, 10)}.csv`, ordersToCsv(visible))}
            disabled={visible.length === 0}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48" aria-label="Filtrar por estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant={onlyPaid ? "default" : "outline"} size="sm" onClick={() => setOnlyPaid(!onlyPaid)} aria-pressed={onlyPaid}>
            Só pagas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">Não foi possível carregar os pedidos.</p>
            <Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Sem pedidos para mostrar.</p>
        ) : (
          <div className="space-y-4">
            {visible.map((order) => {
              const addr = order.delivery_address;
              const name = order.customer_name ?? addr?.name ?? "—";
              const phone = order.customer_phone ?? addr?.phone ?? "";
              const email = order.guest_email;
              const total = order.final_total ?? (order.quote_sent_at ? order.total_amount : null);
              const isOpen = open === order.id;
              return (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">#{orderRef(order.id)}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString("pt-PT")}</p>
                      <p className="text-sm">
                        {name}
                        {phone && ` · ${phone}`}
                        {email && ` · ${email}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {PAYMENT_METHOD_LABELS[order.payment_method ?? ""] ?? "Pagamento por definir"}
                        {order.payment_status && ` · ${PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status}`}
                      </Badge>
                      <Badge className={orderStatusClass(order.status)}>{orderStatusLabel(order.status)}</Badge>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    {order.order_items.map((item) => (
                      <p key={item.id}>
                        {item.quantity}× {item.product_name ?? "Produto"}{" "}
                        <span className="text-muted-foreground">({item.state === "COZIDO" ? "Cozido" : "Cru"})</span>
                      </p>
                    ))}
                    {total != null && <p className="font-semibold">Total {eur(Number(total))}</p>}
                  </div>

                  {addr && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {addr.street}, {addr.postalCode} {addr.city}
                        {order.delivery_time_slot && ` · ${order.delivery_time_slot}`}
                      </p>
                      {order.notes && <p className="italic">“{order.notes}”</p>}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" className="min-h-11" onClick={() => setOpen(isOpen ? null : order.id)} aria-expanded={isOpen}>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isOpen ? "Fechar" : "Abrir pedido"}
                    </Button>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order, v)}>
                      <SelectTrigger className="w-48 h-11" aria-label="Mudar estado">
                        <SelectValue>{orderStatusLabel(order.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {phone && (
                      <Button size="sm" variant="outline" className="min-h-11" asChild>
                        <a href={`tel:${phone.replace(/\s/g, "")}`}>
                          <Phone className="h-4 w-4" />
                          Ligar
                        </a>
                      </Button>
                    )}
                    {email && (
                      <Button size="sm" variant="outline" className="min-h-11" asChild>
                        <a href={`mailto:${email}?subject=${encodeURIComponent(`Marisca · Pedido #${orderRef(order.id)}`)}`}>
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      </Button>
                    )}
                  </div>

                  {isOpen && <OrderWorkflow order={order} onChanged={invalidate.orders} />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
