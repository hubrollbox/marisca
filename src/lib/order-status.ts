import { CheckCircle, Clock, Package, Truck, XCircle, type LucideIcon } from "lucide-react";

export const ORDER_STATUSES = ["pendente", "confirmado", "preparado", "em_entrega", "entregue", "cancelado"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  preparado: "Preparado",
  em_entrega: "Em Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  pendente: Clock,
  confirmado: CheckCircle,
  preparado: Package,
  em_entrega: Truck,
  entregue: CheckCircle,
  cancelado: XCircle,
};

/** Classes de cor (só tokens da marca) para cada estado */
export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pendente: "bg-muted text-foreground border-transparent",
  confirmado: "bg-primary text-primary-foreground border-transparent",
  preparado: "bg-secondary text-secondary-foreground border-transparent",
  em_entrega: "bg-cream text-cream-foreground border-primary/30",
  entregue: "bg-success text-success-foreground border-transparent",
  cancelado: "bg-destructive text-destructive-foreground border-transparent",
};

/** Próximo passo normal de uma encomenda (botão "avançar" no admin) */
export const NEXT_ORDER_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pendente: "confirmado",
  confirmado: "preparado",
  preparado: "em_entrega",
  em_entrega: "entregue",
  entregue: null,
  cancelado: null,
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Só encomendas pagas e não canceladas contam como vendas */
export function countsAsRevenue(order: { payment_status?: string | null; status?: string | null }): boolean {
  return order.payment_status === "paid" && order.status !== "cancelado";
}

/** Rótulos PT-PT de todos os valores de orders.status (fluxo de orçamento). */
export const STATUS_LABELS_PT: Record<string, string> = {
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

/** Estado desconhecido mostra-se tal como vem — nunca como "Pendente". */
export function orderStatusLabel(status: string | null | undefined): string {
  if (!status) return "";
  return Object.prototype.hasOwnProperty.call(STATUS_LABELS_PT, status) ? STATUS_LABELS_PT[status] : status;
}
