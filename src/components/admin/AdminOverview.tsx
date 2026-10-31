import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAdminOrders, useAdminProducts } from "@/hooks/use-admin-data";
import { dailySales, topProducts } from "@/lib/admin-reports";
import { saleBlock } from "@/lib/pricing";

export function AdminOverview() {
  const { data: orders = [], isLoading } = useAdminOrders(true);
  const { data: products = [] } = useAdminProducts(true);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const today = dailySales(orders);
  const top = topProducts(orders);
  const toPrepare = orders.filter((o) => o.payment_status === "paid" && ["confirmado", "preparado"].includes(o.status)).length;
  const lowStock = products.filter((p) => p.available && p.stock !== null && p.stock <= 3);
  const blocked = products.filter((p) => p.available && saleBlock(p, 1) === "closed_season");

  const stats = [
    { label: "Encomendas pagas hoje", value: today.count },
    { label: "Vendas hoje", value: `€${today.revenue.toFixed(2)}` },
    { label: "Por preparar/entregar", value: toPrepare },
    { label: "Produtos à venda", value: products.filter((p) => !saleBlock(p, 1)).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produtos mais vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {top.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ainda sem vendas pagas.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {top.map((t, i) => (
                  <li key={t.name} className="flex justify-between">
                    <span>
                      {i + 1}. {t.name}
                    </span>
                    <span className="text-muted-foreground">
                      {t.quantity} un · €{t.revenue.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {lowStock.length === 0 && blocked.length === 0 && (
              <p className="text-muted-foreground">Nada a assinalar.</p>
            )}
            {lowStock.map((p) => (
              <p key={p.id}>
                <strong>{p.name}</strong>: {p.stock === 0 ? "esgotado" : `restam ${p.stock}`}
              </p>
            ))}
            {blocked.map((p) => (
              <p key={p.id}>
                <strong>{p.name}</strong>: em defeso (não pode ser vendido)
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
