import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Handshake } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { partnershipSchema, type PartnershipFormData } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";

const Partnerships = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnershipFormData>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      name: "",
      email: "",
      partnershipType: "gastronomia",
      message: "",
    },
  });

  const onSubmit = async (data: PartnershipFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("partnership_requests")
        .insert({
          name: data.name,
          email: data.email,
          partnership_type: data.partnershipType,
          message: data.message,
        });

      if (error) throw error;

      toast({
        title: "Proposta enviada!",
        description: "Obrigado pelo seu interesse. Entraremos em contacto em breve.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting partnership:", error);
      toast({
        title: "Erro ao enviar proposta",
        description: "Por favor tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Parcerias - Marisca"
        description="Junte-se à Marisca. Procuramos parceiros que partilhem a nossa paixão pela frescura e autenticidade do mar."
        canonical="https://marisca.pt/parcerias"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <MariscaLogo className="h-8" />
              </div>
              <h1 className="text-lg font-semibold">Parcerias</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 py-16 rounded-lg" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            <div className="flex justify-center mb-6">
              <Handshake className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-6 text-primary">Juntos pelo Mar</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Na Marisca acreditamos que o mar se vive em comunidade. Seja através do desporto, da gastronomia ou da cultura costeira, procuramos parceiros que partilhem a nossa paixão pela frescura e autenticidade.
            </p>
            <p className="text-xl font-medium text-primary">
              👉 Tens uma ideia ou proposta? Fala connosco e vamos criar algo juntos.
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Proposta de Parceria</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contacto em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="O seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="o.seu.email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnershipType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Parceria *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gastronomia">Gastronomia</SelectItem>
                            <SelectItem value="desporto">Desporto</SelectItem>
                            <SelectItem value="cultura">Cultura</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos mais sobre a sua proposta de parceria..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                    style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        A enviar...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Quero ser parceiro
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Partnerships;
