import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";

export default function PrivacyPolicy() {
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
                <h1 className="text-lg font-bold">Política de Privacidade</h1>
                <p className="text-white/80 text-sm">Marisca</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Política de Privacidade</CardTitle>
            <p className="text-muted-foreground">Última atualização: 27 de setembro de 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Introdução</h2>
              <p className="text-foreground leading-relaxed">
                A Marisca compromete-se a proteger a sua privacidade e a garantir que os seus dados pessoais são tratados de forma segura e transparente, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Dados que Recolhemos</h2>
              <p className="text-foreground leading-relaxed mb-3">
                Recolhemos os seguintes tipos de dados pessoais:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Nome completo e dados de contacto (email, telefone, morada)</li>
                <li>Informações de pagamento (processadas de forma segura)</li>
                <li>Histórico de encomendas e preferências</li>
                <li>Dados de navegação e utilização da aplicação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Como Utilizamos os Seus Dados</h2>
              <p className="text-foreground leading-relaxed mb-3">
                Os seus dados são utilizados para:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Processar e entregar as suas encomendas</li>
                <li>Comunicar sobre o estado das entregas</li>
                <li>Melhorar os nossos serviços e experiência do utilizador</li>
                <li>Cumprir obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Partilha de Dados</h2>
              <p className="text-foreground leading-relaxed">
                Não vendemos nem partilhamos os seus dados pessoais com terceiros, exceto quando necessário para processar encomendas (parceiros de entrega) ou por exigência legal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Os Seus Direitos</h2>
              <p className="text-foreground leading-relaxed mb-3">
                Tem direito a:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Aceder aos seus dados pessoais</li>
                <li>Retificar dados incorretos</li>
                <li>Apagar os seus dados</li>
                <li>Restringir o processamento</li>
                <li>Portabilidade dos dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Contacto</h2>
              <p className="text-foreground leading-relaxed">
                Para questões sobre privacidade, contacte-nos através do email: 
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