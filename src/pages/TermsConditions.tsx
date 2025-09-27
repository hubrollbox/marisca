import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";

export default function TermsConditions() {
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
                <h1 className="text-base sm:text-lg font-bold">Termos e Condições</h1>
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
            <CardTitle className="text-xl sm:text-2xl text-primary">Termos e Condições de Venda</CardTitle>
            <p className="text-muted-foreground text-sm">Última atualização: 27 de setembro de 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            {/* ... keep existing sections ... */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">1. Informações Gerais</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                A Marisca é um serviço de venda online de marisco fresco, operando em Portugal. Ao utilizar os nossos serviços, concorda com os presentes termos e condições.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">2. Produtos e Disponibilidade</h2>
              <p className="text-foreground leading-relaxed mb-3 text-sm sm:text-base">
                Os produtos oferecidos estão sujeitos a disponibilidade e dependem das condições do mar e dos períodos de defeso. Reservamo-nos o direito de:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1 text-sm sm:text-base">
                <li>Ajustar preços conforme a disponibilidade do mercado</li>
                <li>Cancelar encomendas em caso de indisponibilidade</li>
                <li>Substituir produtos por alternativas similares (com consentimento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">3. Encomendas e Pagamentos</h2>
              <p className="text-foreground leading-relaxed mb-3 text-sm sm:text-base">
                As encomendas são processadas mediante:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1 text-sm sm:text-base">
                <li>Confirmação de disponibilidade dos produtos</li>
                <li>Pagamento aprovado através dos métodos aceites</li>
                <li>Confirmação de morada de entrega válida</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">4. Entrega</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Comprometemo-nos a entregar marisco fresco da lota para a sua mesa em poucas horas. Os prazos de entrega podem variar conforme a localização e disponibilidade dos produtos.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">5. Qualidade e Frescura</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Garantimos a máxima frescura e qualidade dos nossos produtos. Em caso de insatisfação com a qualidade, contacte-nos no prazo de 24 horas após a entrega.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">6. Devoluções e Reembolsos</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Devido à natureza perecível dos produtos, as devoluções só são aceites em casos de problemas de qualidade comprovados ou erro na entrega.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">7. Contacto</h2>
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Para questões sobre as suas encomendas, contacte-nos: 
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