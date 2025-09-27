import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Política de Privacidade</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Política de Privacidade - Marisca</CardTitle>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Identificação do Responsável</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Denominação:</strong> Marisca</p>
                <p><strong>NIF:</strong> A DEFINIR</p>
                <p><strong>Morada:</strong> A DEFINIR</p>
                <p><strong>Email:</strong> info@marisca.pt</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Dados Pessoais Recolhidos</h2>
              <div className="space-y-2 text-sm">
                <p>Recolhemos os seguintes tipos de dados pessoais:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Dados de Registo:</strong> Nome, email, telefone</li>
                  <li><strong>Dados de Contacto:</strong> Morada de entrega, código postal</li>
                  <li><strong>Dados de Pagamento:</strong> Informações de pagamento (processadas de forma segura)</li>
                  <li><strong>Preferências:</strong> Preferências de produtos e horários de entrega</li>
                  <li><strong>Dados de Utilização:</strong> Histórico de encomendas e interações com o serviço</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Base Legal e Finalidades</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium">Execução de Contrato (3 anos)</h3>
                  <p>Processamento de encomendas, gestão de entregas e suporte ao cliente.</p>
                </div>
                <div>
                  <h3 className="font-medium">Consentimento (até revogação)</h3>
                  <p>Marketing direto, newsletters e comunicações promocionais.</p>
                </div>
                <div>
                  <h3 className="font-medium">Interesse Legítimo (2 anos)</h3>
                  <p>Melhoria do serviço, análise de utilização e prevenção de fraudes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Direitos do Utilizador</h2>
              <div className="space-y-2 text-sm">
                <p>Nos termos do RGPD, tem os seguintes direitos:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Acesso:</strong> Solicitar informações sobre os dados que processamos</li>
                  <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                  <li><strong>Eliminação:</strong> Solicitar a eliminação dos seus dados</li>
                  <li><strong>Limitação:</strong> Restringir o processamento dos seus dados</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento para fins de marketing</li>
                  <li><strong>Portabilidade:</strong> Receber os seus dados num formato estruturado</li>
                </ul>
                <p className="mt-3">
                  Para exercer estes direitos, contacte-nos através de: <strong>info@marisca.pt</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Partilha de Dados</h2>
              <div className="space-y-2 text-sm">
                <p>Os seus dados pessoais podem ser partilhados com:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Prestadores de serviços de pagamento (Stripe)</li>
                  <li>Empresas de entrega e logística</li>
                  <li>Autoridades competentes quando legalmente exigido</li>
                </ul>
                <p>Não vendemos nem alugamos os seus dados pessoais a terceiros.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Segurança dos Dados</h2>
              <div className="space-y-2 text-sm">
                <p>Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados pessoais contra:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Acesso não autorizado</li>
                  <li>Alteração, divulgação ou destruição não autorizada</li>
                  <li>Perda acidental</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Alterações à Política</h2>
              <div className="space-y-2 text-sm">
                <p>Esta política pode ser atualizada periodicamente. As alterações significativas serão comunicadas através do nosso website ou por email.</p>
                <p>Recomendamos que consulte regularmente esta página para se manter informado sobre como protegemos os seus dados.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Contacto</h2>
              <div className="space-y-2 text-sm">
                <p>Para questões relacionadas com esta política de privacidade ou para exercer os seus direitos, contacte-nos:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> info@marisca.pt</p>
                  <p><strong>Morada:</strong> A DEFINIR</p>
                  <p><strong>Telefone:</strong> A DEFINIR</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
