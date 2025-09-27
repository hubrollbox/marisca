import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-sand flex flex-col">
      {/* Header */}
      <header className="bg-gradient-ocean text-white sticky top-0 z-40 shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <MariscaLogo size="sm" variant="white" />
              <div>
                <h1 className="text-base sm:text-lg font-bold">Política de Cookies</h1>
                <p className="text-white/80 text-xs sm:text-sm">Marisca</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <Card className="shadow-elegant">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-primary">Política de Cookies</CardTitle>
            <p className="text-muted-foreground text-sm">Última atualização: 27 de setembro de 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            {/* ... keep existing sections ... */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">1. O que são Cookies</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo quando visita o nosso website. Permitem-nos reconhecê-lo e melhorar a sua experiência de navegação.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">2. Tipos de Cookies que Utilizamos</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Cookies Essenciais</h3>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base">
                    Necessários para o funcionamento básico da aplicação, incluindo autenticação e carrinho de compras.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Cookies de Funcionalidade</h3>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base">
                    Permitem-nos lembrar as suas preferências e personalizar a sua experiência.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Cookies de Análise</h3>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base">
                    Ajudam-nos a compreender como utiliza a aplicação para melhorar os nossos serviços.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">3. Gestão de Cookies</h2>
              <p className="text-foreground leading-relaxed mb-3 text-sm sm:text-base">
                Pode gerir as suas preferências de cookies através das definições do seu navegador:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1 text-sm sm:text-base">
                <li>Aceitar ou rejeitar cookies</li>
                <li>Eliminar cookies existentes</li>
                <li>Definir notificações quando cookies são enviados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">4. Cookies de Terceiros</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Utilizamos serviços de terceiros (como processamento de pagamentos) que podem definir os seus próprios cookies. Estes são regidos pelas políticas de privacidade dos respetivos fornecedores.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">5. Atualizações</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Esta política pode ser atualizada periodicamente. Recomendamos que a consulte regularmente para se manter informado sobre como utilizamos cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">6. Contacto</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Para questões sobre cookies, contacte-nos: 
                <a href="mailto:info@marisca.pt" className="text-accent hover:underline ml-1">
                  info@marisca.pt
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}