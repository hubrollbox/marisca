import { Ban, CheckCircle, Clock, FileText, Package, Scale, ThumbsUp, Truck, XCircle, type LucideIcon } from "lucide-react";

export const ORDER_STATUSES = [
  "pendente",
  "orcamento_enviado",
  "aceite",
  "pesado",
  "preparado",
  "em_entrega",
  "entregue",
  "cancelado",
  "expirado",
  "confirmado",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Rótulos PT-PT de todos os valores de orders.status. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pedido recebido",
  orcamento_enviado: "Orçamento enviado",
  aceite: "Aceite",
  pesado: "Pesado",
  preparado: "Preparado",
  em_entrega: "Em entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
  expirado: "Expirado",
  confirmado: "Confirmado (legado)",
};
export const STATUS_LABELS_PT: Record<string, string> = ORDER_STATUS_LABELS;

export const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  pendente: Clock,
  orcamento_enviado: FileText,
  aceite: ThumbsUp,
  pesado: Scale,
  preparado: Package,
  em_entrega: Truck,
  entregue: CheckCircle,
  cancelado: XCircle,
  expirado: Ban,
  confirmado: CheckCircle,
};

/** Classes de cor (só tokens da marca) para cada estado */
export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pendente: "bg-muted text-foreground border-transparent",
  orcamento_enviado: "bg-cream text-cream-foreground border-primary/30",
  aceite: "bg-primary text-primary-foreground border-transparent",
  pesado: "bg-secondary text-secondary-foreground border-transparent",
  preparado: "bg-secondary text-secondary-foreground border-transparent",
  em_entrega: "bg-cream text-cream-foreground border-primary/30",
  entregue: "bg-success text-success-foreground border-transparent",
  cancelado: "bg-destructive text-destructive-foreground border-transparent",
  expirado: "bg-muted text-muted-foreground border-border",
  confirmado: "bg-muted text-foreground border-border",
};

/** Fluxo normal; cancelado/expirado são saídas; confirmado é legado. */
export const NEXT_ORDER_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pendente: "orcamento_enviado",
  orcamento_enviado: "aceite",
  aceite: "pesado",
  pesado: "preparado",
  preparado: "em_entrega",
  em_entrega: "entregue",
  entregue: null,
  cancelado: null,
  expirado: null,
  confirmado: "preparado",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Estado desconhecido mostra-se tal como vem — nunca como "Pendente". */
export function orderStatusLabel(status: string | null | undefined): string {
  if (!status) return "";
  return isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;
}

export function orderStatusClass(status: string | null | undefined): string {
  return isOrderStatus(status) ? ORDER_STATUS_CLASSES[status] : "bg-muted text-foreground border-border";
}

/** Só encomendas pagas e não canceladas contam como vendas */
export function countsAsRevenue(order: { payment_status?: string | null; status?: string | null }): boolean {
  return order.payment_status === "paid" && order.status !== "cancelado";
}
