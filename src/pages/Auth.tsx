import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { signUpSchema, signInSchema } from "@/lib/validations";
import { Fish, Loader2 } from "lucide-react";

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Validate input
      const validatedData = signInSchema.parse({ email, password });

      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        // Handle specific auth errors with user-friendly messages
        const userFriendlyMessage = error.message === 'Invalid login credentials' 
          ? 'Email ou password incorretos'
          : error.message === 'Email not confirmed'
          ? 'Por favor confirme o seu email antes de fazer login'
          : 'Erro ao fazer login';
        toast({
          title: "Erro no Login",
          description: userFriendlyMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao MariscoFresh.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro de validação",
        description: error.errors?.[0]?.message || 'Dados inválidos',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Validate input
      const validatedData = signUpSchema.parse({ firstName, lastName, email, password });

      const { error } = await signUp(validatedData.email, validatedData.password, validatedData.firstName, validatedData.lastName);

      if (error) {
        // Handle specific auth errors with user-friendly messages
        const userFriendlyMessage = error.message === 'User already registered'
          ? 'Este email já está registado'
          : error.message === 'Password should be at least 6 characters'
          ? 'Password deve ter pelo menos 6 caracteres'
          : 'Erro ao criar conta';
        toast({
          title: "Erro no Registo",
          description: userFriendlyMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique o seu email para confirmar a conta.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro de validação",
        description: error.errors?.[0]?.message || 'Dados inválidos',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-4">
            <Fish className="h-8 w-8" />
            <span className="text-2xl font-bold">MariscoFresh</span>
          </div>
          <p className="text-white/80">Marisco fresco entregue à sua porta</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Entre na sua conta ou crie uma nova para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Registar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-sunset hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        A entrar...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="João"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apelido</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Silva"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-sunset hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        A criar conta...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}