import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Phone, ChevronRight, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAdminOrders, useInvalidateAdmin, type AdminOrder } from "@/hooks/use-admin-data";
import {
  NEXT_ORDER_STATUS,
  ORDER_STATUSES,
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_LABELS,
  isOrderStatus,
  type OrderStatus,
} from "@/lib/order-status";
import { downloadCsv, ordersToCsv } from "@/lib/admin-reports";

const PAYMENT_LABELS: Record<string, string> = { paid: "Pago", pending: "Por pagar", failed: "Falhou" };

export function AdminOrders() {
  const { data: orders = [], isLoading, isError, refetch } = useAdminOrders(true);
  const invalidate = useInvalidateAdmin();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [onlyPaid, setOnlyPaid] = useState(true);

  const visible = orders.filter(
    (o) => (filter === "all" || o.status === filter) && (!onlyPaid || o.payment_status === "paid"),
  );

  const updateStatus = async (order: AdminOrder, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) {
      toast({ title: "Erro ao atualizar estado", description: "Tente novamente.", variant: "destructive" });
      return;
    }
    toast({ title: `Encomenda #${order.id.slice(0, 8).toUpperCase()}: ${ORDER_STATUS_LABELS[status]}` });
    invalidate.orders();
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Encomendas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCsv(`encomendas-${new Date().toISOString().slice(0, 10)}.csv`, ordersToCsv(visible))}
            disabled={visible.length === 0}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as OrderStatus | "all")}>
            <SelectTrigger className="w-44" aria-label="Filtrar por estado">
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
            <p className="text-muted-foreground">Não foi possível carregar as encomendas.</p>
            <Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Sem encomendas para mostrar.</p>
        ) : (
          <div className="space-y-4">
            {visible.map((order) => {
              const status = isOrderStatus(order.status) ? order.status : "pendente";
              const next = NEXT_ORDER_STATUS[status];
              const addr = order.delivery_address;
              const email = order.guest_email;
              return (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("pt-PT")}
                        {order.delivery_time_slot && ` · Entrega ${order.delivery_time_slot}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{PAYMENT_LABELS[order.payment_status ?? ""] ?? "—"}</Badge>
                      <Badge className={ORDER_STATUS_CLASSES[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    {order.order_items.map((item, i) => (
                      <p key={i}>
                        {item.quantity}x {item.products?.name ?? "Produto"}{" "}
                        <span className="text-muted-foreground">({item.state === "CRU" ? "Cru" : "Cozido"})</span>
                      </p>
                    ))}
                    <p className="font-semibold">Total €{Number(order.total_amount).toFixed(2)}</p>
                  </div>

                  {addr && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {addr.name} · {addr.street}, {addr.postalCode} {addr.city}
                      </p>
                      {order.notes && <p className="italic">“{order.notes}”</p>}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {next && order.payment_status === "paid" && (
                      <Button size="sm" onClick={() => updateStatus(order, next)}>
                        {ORDER_STATUS_LABELS[next]}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    <Select value={status} onValueChange={(v) => updateStatus(order, v as OrderStatus)}>
                      <SelectTrigger className="w-40 h-9" aria-label="Mudar estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {addr?.phone && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${addr.phone.replace(/\s/g, "")}`}>
                          <Phone className="h-4 w-4" />
                          Ligar
                        </a>
                      </Button>
                    )}
                    {email && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`mailto:${email}?subject=${encodeURIComponent(
                            `Marisca · Encomenda #${order.id.slice(0, 8).toUpperCase()}`,
                          )}`}
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
