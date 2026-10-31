import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useComplaints, useInvalidateAdmin, usePartnerships } from "@/hooks/use-admin-data";

const COMPLAINT_STATUS: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em análise",
  resolved: "Resolvida",
};

export function AdminInbox() {
  const complaints = useComplaints(true);
  const partnerships = usePartnerships(true);
  const invalidate = useInvalidateAdmin();

  const setComplaintStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar reclamação", variant: "destructive" });
      return;
    }
    invalidate.complaints();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reclamações</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
          ) : complaints.isError ? (
            <p className="text-sm text-muted-foreground">Não foi possível carregar as reclamações.</p>
          ) : (complaints.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem reclamações.</p>
          ) : (
            <ul className="space-y-3">
              {complaints.data!.map((c) => (
                <li key={c.id} className="border rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{c.complaint_number}</span>
                    <Badge variant={c.status === "resolved" ? "secondary" : "outline"}>
                      {COMPLAINT_STATUS[c.status ?? "pending"] ?? c.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {c.name} · {c.complaint_type} · {c.created_at && new Date(c.created_at).toLocaleDateString("pt-PT")}
                  </p>
                  <p>{c.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.status !== "in_progress" && c.status !== "resolved" && (
                      <Button size="sm" variant="outline" onClick={() => setComplaintStatus(c.id, "in_progress")}>
                        Em análise
                      </Button>
                    )}
                    {c.status !== "resolved" && (
                      <Button size="sm" onClick={() => setComplaintStatus(c.id, "resolved")}>
                        Marcar resolvida
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${c.email}?subject=${encodeURIComponent(`Reclamação ${c.complaint_number}`)}`}>
                        <Mail className="h-4 w-4" />
                        Responder
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Propostas de parceria</CardTitle>
        </CardHeader>
        <CardContent>
          {partnerships.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
          ) : partnerships.isError ? (
            <p className="text-sm text-muted-foreground">Não foi possível carregar as propostas.</p>
          ) : (partnerships.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem propostas.</p>
          ) : (
            <ul className="space-y-3">
              {partnerships.data!.map((p) => (
                <li key={p.id} className="border rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{p.name}</span>
                    <Badge variant="outline">{p.partnership_type}</Badge>
                  </div>
                  <p className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-PT")}</p>
                  <p>{p.message}</p>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${p.email}?subject=${encodeURIComponent("Parceria Marisca")}`}>
                      <Mail className="h-4 w-4" />
                      Responder
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
