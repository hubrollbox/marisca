import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAdminProducts, useInvalidateAdmin } from "@/hooks/use-admin-data";
import type { Product } from "@/hooks/use-products";
import { AvailabilityBadge } from "@/components/ui/product-card";
import { ProductFormDialog } from "./ProductFormDialog";

export function AdminProducts() {
  const { data: products = [], isLoading, isError, refetch } = useAdminProducts(true);
  const invalidate = useInvalidateAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean) as string[])].sort(),
    [products],
  );

  const toggleAvailable = async (p: Product, available: boolean) => {
    const { error } = await supabase.from("products").update({ available }).eq("id", p.id);
    if (error) {
      toast({ title: "Erro ao atualizar", description: "Tente novamente.", variant: "destructive" });
      return;
    }
    invalidate.products();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("products").delete().eq("id", deleting.id);
    if (error) {
      // Produtos com encomendas não podem ser apagados (histórico); desativamos
      if (error.code === "23503") {
        await supabase.from("products").update({ available: false }).eq("id", deleting.id);
        toast({
          title: "Produto desativado",
          description: "Tem encomendas associadas, por isso foi escondido da loja em vez de apagado.",
        });
      } else {
        toast({ title: "Erro ao apagar", description: "Tente novamente.", variant: "destructive" });
      }
    } else {
      toast({ title: "Produto apagado" });
    }
    setDeleting(null);
    invalidate.products();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Produtos ({products.length})</CardTitle>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">Não foi possível carregar os produtos.</p>
            <Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        ) : (
          <ul className="divide-y">
            {products.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    €{p.price.toFixed(2)} · Stock: {p.stock ?? "sem limite"} · {p.states.join(" / ")}
                  </p>
                </div>
                <AvailabilityBadge product={p} />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={p.available}
                    onCheckedChange={(v) => toggleAvailable(p, v)}
                    aria-label={`Visível na loja: ${p.name}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar ${p.name}`}
                    onClick={() => {
                      setEditing(p);
                      setFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Apagar ${p.name}`} onClick={() => setDeleting(p)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        onSaved={invalidate.products}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se o produto já tiver encomendas, fica apenas escondido da loja para manter o histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
