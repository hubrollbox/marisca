import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-sand">
      {/* Header */}
      <header className="bg-gradient-ocean text-white sticky top-0 z-40 shadow-elegant">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <MariscaLogo size="sm" variant="white" />
              <div>
                <h1 className="text-lg font-bold">Política de Cookies</h1>
                <p className="text-white/80 text-sm">Marisca</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Política de Cookies</CardTitle>
            <p className="text-muted-foreground">Última atualização: 27 de setembro de 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">1. O que são Cookies</h2>
              <p className="text-foreground leading-relaxed">
                Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo quando visita o nosso website. Permitem-nos reconhecê-lo e melhorar a sua experiência de navegação.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Tipos de Cookies que Utilizamos</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Cookies Essenciais</h3>
                  <p className="text-foreground leading-relaxed">
                    Necessários para o funcionamento básico da aplicação, incluindo autenticação e carrinho de compras.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2">Cookies de Funcionalidade</h3>
                  <p className="text-foreground leading-relaxed">
                    Permitem-nos lembrar as suas preferências e personalizar a sua experiência.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2">Cookies de Análise</h3>
                  <p className="text-foreground leading-relaxed">
                    Ajudam-nos a compreender como utiliza a aplicação para melhorar os nossos serviços.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Gestão de Cookies</h2>
              <p className="text-foreground leading-relaxed mb-3">
                Pode gerir as suas preferências de cookies através das definições do seu navegador:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Aceitar ou rejeitar cookies</li>
                <li>Eliminar cookies existentes</li>
                <li>Definir notificações quando cookies são enviados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Cookies de Terceiros</h2>
              <p className="text-foreground leading-relaxed">
                Utilizamos serviços de terceiros (como processamento de pagamentos) que podem definir os seus próprios cookies. Estes são regidos pelas políticas de privacidade dos respetivos fornecedores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Atualizações</h2>
              <p className="text-foreground leading-relaxed">
                Esta política pode ser atualizada periodicamente. Recomendamos que a consulte regularmente para se manter informado sobre como utilizamos cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Contacto</h2>
              <p className="text-foreground leading-relaxed">
                Para questões sobre cookies, contacte-nos: 
                <a href="mailto:info@marisca.pt" className="text-accent hover:underline ml-1">
                  info@marisca.pt
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}