import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CookiePolicy() {
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
            <h1 className="text-xl font-semibold">Política de Cookies</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Política de Cookies - Marisca</CardTitle>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. O que são Cookies?</h2>
              <div className="space-y-2 text-sm">
                <p>Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo quando visita o nosso website. Estes ficheiros permitem que o website reconheça o seu dispositivo e armazene algumas informações sobre as suas preferências ou ações passadas.</p>
                <p>Esta política explica como utilizamos cookies no website da Marisca, em conformidade com a Lei n.º 41/2004, de 18 de agosto.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Tipos de Cookies Utilizados</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium text-base">2.1 Cookies Essenciais</h3>
                  <p>Estes cookies são necessários para o funcionamento básico do website e não podem ser desativados.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li><strong>Cookies de Sessão:</strong> Mantêm a sua sessão ativa durante a navegação</li>
                    <li><strong>Cookies de Segurança:</strong> Protegem contra ataques e fraudes</li>
                    <li><strong>Cookies de Funcionalidade:</strong> Permitem funcionalidades básicas como carrinho de compras</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <strong>Base Legal:</strong> Interesse legítimo para funcionamento do serviço
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-base">2.2 Cookies Analíticos</h3>
                  <p>Estes cookies ajudam-nos a entender como os visitantes interagem com o nosso website.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li><strong>Google Analytics:</strong> Análise de tráfego e comportamento dos utilizadores</li>
                    <li><strong>Cookies de Performance:</strong> Medição de velocidade e desempenho do website</li>
                    <li><strong>Cookies de Estatísticas:</strong> Recolha de dados anónimos sobre a utilização</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <strong>Base Legal:</strong> Consentimento do utilizador
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-base">2.3 Cookies de Marketing</h3>
                  <p>Estes cookies são utilizados para personalizar anúncios e medir a eficácia das campanhas.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li><strong>Cookies de Publicidade:</strong> Personalização de anúncios baseada nos seus interesses</li>
                    <li><strong>Cookies de Remarketing:</strong> Exibição de anúncios relevantes em outros websites</li>
                    <li><strong>Cookies de Redes Sociais:</strong> Integração com plataformas sociais</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <strong>Base Legal:</strong> Consentimento do utilizador
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Gestão de Cookies</h2>
              <div className="space-y-2 text-sm">
                <p>Conforme a Lei n.º 41/2004, tem o direito de gerir as suas preferências de cookies a qualquer momento.</p>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Como Gerir os Seus Cookies:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Utilize o banner de cookies que aparece na primeira visita</li>
                    <li>Aceda às configurações de cookies no rodapé do website</li>
                    <li>Configure as preferências no seu navegador</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Configurações do Navegador:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Chrome:</strong> Configurações > Privacidade e segurança > Cookies</li>
                    <li><strong>Firefox:</strong> Opções > Privacidade e Segurança > Cookies</li>
                    <li><strong>Safari:</strong> Preferências > Privacidade > Cookies</li>
                    <li><strong>Edge:</strong> Configurações > Cookies e permissões do site</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Cookies de Terceiros</h2>
              <div className="space-y-2 text-sm">
                <p>O nosso website pode conter cookies de terceiros para funcionalidades específicas:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Stripe:</strong> Processamento seguro de pagamentos</li>
                  <li><strong>Google Analytics:</strong> Análise de tráfego e comportamento</li>
                  <li><strong>Redes Sociais:</strong> Botões de partilha e integração</li>
                </ul>
                <p className="mt-3">
                  Estes serviços têm as suas próprias políticas de cookies, que recomendamos que consulte.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Duração dos Cookies</h2>
              <div className="space-y-2 text-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-300 p-2 text-left">Tipo de Cookie</th>
                        <th className="border border-gray-300 p-2 text-left">Duração</th>
                        <th className="border border-gray-300 p-2 text-left">Finalidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">Sessão</td>
                        <td className="border border-gray-300 p-2">Até fechar o navegador</td>
                        <td className="border border-gray-300 p-2">Funcionamento básico</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Preferências</td>
                        <td className="border border-gray-300 p-2">1 ano</td>
                        <td className="border border-gray-300 p-2">Lembrar configurações</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Analíticos</td>
                        <td className="border border-gray-300 p-2">2 anos</td>
                        <td className="border border-gray-300 p-2">Análise de utilização</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Marketing</td>
                        <td className="border border-gray-300 p-2">1 ano</td>
                        <td className="border border-gray-300 p-2">Publicidade personalizada</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Consentimento</h2>
              <div className="space-y-2 text-sm">
                <p>Ao continuar a utilizar o nosso website após ver o banner de cookies, está a dar o seu consentimento para a utilização de cookies conforme descrito nesta política.</p>
                <p>Pode retirar o seu consentimento a qualquer momento através das configurações de cookies ou do seu navegador.</p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-3">
                  <p><strong>Nota:</strong> A desativação de cookies essenciais pode afetar o funcionamento do website.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Atualizações desta Política</h2>
              <div className="space-y-2 text-sm">
                <p>Esta política de cookies pode ser atualizada periodicamente para refletir mudanças na nossa utilização de cookies ou por razões legais.</p>
                <p>Recomendamos que consulte regularmente esta página para se manter informado sobre a nossa utilização de cookies.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Contacto</h2>
              <div className="space-y-2 text-sm">
                <p>Para questões relacionadas com esta política de cookies:</p>
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
