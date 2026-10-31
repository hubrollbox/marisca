import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { productSchema } from "@/lib/validations";
import { PRODUCT_STATES, type ProductState } from "@/lib/pricing";
import type { Product } from "@/hooks/use-products";

const MMDD = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const EMPTY = {
  name: "",
  category: "",
  description: "",
  price: "",
  weight: "",
  stock: "",
  prep_time: "",
  image_url: "",
  available: true,
  states: ["CRU"] as ProductState[],
  scientific_name: "",
  origin: "",
  ideal_conservation: "",
  closed_season: "",
  closed_season_start: "",
  closed_season_end: "",
};

type FormState = typeof EMPTY;

function toForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category ?? "",
    description: p.description ?? "",
    price: String(p.price),
    weight: p.weight ?? "",
    stock: p.stock === null ? "" : String(p.stock),
    prep_time: p.prep_time ?? "",
    image_url: p.image_url ?? "",
    available: p.available,
    states: p.states,
    scientific_name: p.scientific_name ?? "",
    origin: p.origin ?? "",
    ideal_conservation: p.ideal_conservation ?? "",
    closed_season: p.closed_season ?? "",
    closed_season_start: p.closed_season_start ?? "",
    closed_season_end: p.closed_season_end ?? "",
  };
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: string[];
  onSaved: () => void;
}

export function ProductFormDialog({ open, onOpenChange, product, categories, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(product ? toForm(product) : EMPTY);
  }, [open, product]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleState = (s: ProductState) =>
    set("states", form.states.includes(s) ? form.states.filter((x) => x !== s) : [...form.states, s]);

  const handleSave = async () => {
    const parsed = productSchema.safeParse({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price.replace(",", ".")),
      weight: form.weight || undefined,
      prep_time: form.prep_time || undefined,
      stock: form.stock === "" ? undefined : Number(form.stock),
      image_url: form.image_url,
    });
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    if (form.states.length === 0) {
      toast({ title: "Escolha pelo menos uma preparação (Cru ou Cozido)", variant: "destructive" });
      return;
    }
    const start = form.closed_season_start.trim();
    const end = form.closed_season_end.trim();
    if ((start || end) && (!MMDD.test(start) || !MMDD.test(end))) {
      toast({
        title: "Datas de defeso inválidas",
        description: "Use o formato MM-DD (ex.: 05-01 a 06-30) e preencha início e fim.",
        variant: "destructive",
      });
      return;
    }

    const base = {
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      category: form.category.trim() || null,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      weight: parsed.data.weight ?? null,
      prep_time: parsed.data.prep_time ?? null,
      stock: form.stock === "" ? null : parsed.data.stock ?? 0,
      states: form.states,
      image_url: form.image_url.trim() || null,
      available: form.available,
    };
    const extended = {
      ...base,
      scientific_name: form.scientific_name.trim() || null,
      origin: form.origin.trim() || null,
      ideal_conservation: form.ideal_conservation.trim() || null,
      closed_season: form.closed_season.trim() || null,
      closed_season_start: start || null,
      closed_season_end: end || null,
    };

    setSaving(true);
    try {
      const save = (payload: Record<string, unknown>) =>
        product
          ? supabase.from("products").update(payload as never).eq("id", product.id)
          : supabase.from("products").insert(payload as never);

      let { error } = await save(extended);
      let partial = false;
      // Se a base de dados ainda não tem as colunas técnicas/defeso, guarda só o essencial
      if (error && (error.code === "PGRST204" || /column/i.test(error.message))) {
        partial = true;
        ({ error } = await save(base));
      }
      if (error) throw error;

      toast({
        title: product ? "Produto atualizado" : "Produto criado",
        description: partial
          ? "Ficha técnica e defeso ainda não podem ser guardados (falta atualizar a base de dados)."
          : undefined,
      });
      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error("Product save error:", err);
      toast({ title: "Erro ao guardar produto", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="p-name">Nome</Label>
            <Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="p-price">Preço (EUR)</Label>
              <Input id="p-price" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-stock">Stock do dia</Label>
              <Input
                id="p-stock"
                inputMode="numeric"
                placeholder="Sem limite"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-weight">Peso / unidade</Label>
              <Input id="p-weight" placeholder="ex.: 1 kg" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-prep">Tempo de preparação</Label>
              <Input id="p-prep" value={form.prep_time} onChange={(e) => set("prep_time", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="p-category">Categoria</Label>
            <Input id="p-category" list="p-categories" value={form.category} onChange={(e) => set("category", e.target.value)} />
            <datalist id="p-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">Preparações disponíveis</span>
            <div className="flex gap-2">
              {PRODUCT_STATES.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={form.states.includes(s) ? "default" : "outline"}
                  onClick={() => toggleState(s)}
                  aria-pressed={form.states.includes(s)}
                  className="flex-1"
                >
                  {s === "CRU" ? "Cru" : "Cozido"}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="p-available">Visível na loja</Label>
            <Switch id="p-available" checked={form.available} onCheckedChange={(v) => set("available", v)} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="p-desc">Descrição</Label>
            <Textarea id="p-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="p-image">Foto (link)</Label>
            <Input id="p-image" placeholder="https://..." value={form.image_url} onChange={(e) => set("image_url", e.target.value)} />
          </div>

          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Defeso</legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="p-cs-start">Início (MM-DD)</Label>
                <Input
                  id="p-cs-start"
                  placeholder="05-01"
                  value={form.closed_season_start}
                  onChange={(e) => set("closed_season_start", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="p-cs-end">Fim (MM-DD)</Label>
                <Input
                  id="p-cs-end"
                  placeholder="06-30"
                  value={form.closed_season_end}
                  onChange={(e) => set("closed_season_end", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-cs-text">Nota para o cliente</Label>
              <Input
                id="p-cs-text"
                placeholder="ex.: Defeso de 1 de maio a 30 de junho"
                value={form.closed_season}
                onChange={(e) => set("closed_season", e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Durante o defeso o produto não pode ser comprado.</p>
          </fieldset>

          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Ficha técnica</legend>
            <div className="space-y-1">
              <Label htmlFor="p-sci">Nome científico</Label>
              <Input id="p-sci" value={form.scientific_name} onChange={(e) => set("scientific_name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-origin">Origem</Label>
              <Input id="p-origin" value={form.origin} onChange={(e) => set("origin", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-cons">Conservação</Label>
              <Input
                id="p-cons"
                value={form.ideal_conservation}
                onChange={(e) => set("ideal_conservation", e.target.value)}
              />
            </div>
          </fieldset>

          <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? "Guardar alterações" : "Criar produto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
