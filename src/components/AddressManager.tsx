import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Address {
  id: string;
  street: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

export const AddressManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postal_code: "",
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("delivery_addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar endereços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const addressData = {
        ...formData,
        user_id: user?.id,
      };

      if (editingAddress) {
        const { error } = await supabase
          .from("delivery_addresses")
          .update(addressData)
          .eq("id", editingAddress.id);

        if (error) throw error;
        toast({ title: "Endereço atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from("delivery_addresses")
          .insert(addressData);

        if (error) throw error;
        toast({ title: "Endereço adicionado com sucesso" });
      }

      setDialogOpen(false);
      setEditingAddress(null);
      setFormData({ street: "", city: "", postal_code: "", is_default: false });
      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar endereço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("delivery_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Endereço removido" });
      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Erro ao remover endereço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingAddress(null);
    setFormData({ street: "", city: "", postal_code: "", is_default: false });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-4">A carregar...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Endereços de Entrega
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNewDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="street">Rua e Número</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="0000-000"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingAddress ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum endereço cadastrado
          </p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.postal_code}
                  </p>
                  {address.is_default && (
                    <span className="text-xs text-primary">Padrão</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(address)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
