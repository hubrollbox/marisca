import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsConditions() {
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
            <h1 className="text-xl font-semibold">Termos e Condições de Venda</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Termos e Condições de Venda - Marisca</CardTitle>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Informações Gerais</h2>
              <div className="space-y-2 text-sm">
                <p>Estes termos e condições regulam a utilização do serviço de venda e entrega de marisco fresco da Marisca.</p>
                <p>Ao efetuar uma encomenda, o cliente aceita integralmente estes termos e condições.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Produtos e Preços</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Variações de Preço e Stock:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Os preços e disponibilidade dos produtos estão sujeitos a variações diárias da lota</li>
                  <li>Os preços apresentados são válidos apenas no momento da encomenda</li>
                  <li>Reservamo-nos o direito de ajustar preços conforme as condições do mercado</li>
                  <li>O stock é limitado e baseado na disponibilidade diária</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Prazos de Entrega</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Objetivo de Entrega:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Entregas em poucas horas após confirmação da encomenda</li>
                  <li>Horários de entrega disponíveis: 10:00-20:00</li>
                  <li>Entregas apenas em dias úteis</li>
                  <li>Prazos podem variar conforme a localização e disponibilidade</li>
                </ul>
                <p className="mt-3">
                  <strong>Área de Entrega:</strong> Limitada à região metropolitana de Lisboa (a confirmar conforme expansão)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Direito de Arrependimento</h2>
              <div className="space-y-2 text-sm">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p><strong>IMPORTANTE:</strong> O direito de arrependimento está excluído para produtos perecíveis, conforme o artigo 18.º, n.º 1, alínea c) do Decreto-Lei n.º 24/2014.</p>
                </div>
                <p>Uma vez confirmada a encomenda de marisco fresco, não é possível cancelar ou devolver o produto.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Reclamações e Garantias</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Prazo para Reclamações:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Reclamações devem ser apresentadas no prazo máximo de 2 horas após a entrega</li>
                  <li>Contacto: info@marisca.pt ou telefone de apoio</li>
                  <li>Incluir fotografia do produto em questão</li>
                  <li>Descrever detalhadamente o problema identificado</li>
                </ul>
                <p className="mt-3">
                  <strong>Garantia de Qualidade:</strong> Comprometemo-nos a entregar marisco fresco e de qualidade. Em caso de não conformidade, procederemos à substituição ou reembolso.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Condições de Pagamento</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Métodos de Pagamento Aceites:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>MB Way</li>
                  <li>Cartão de crédito/débito (Visa, Mastercard)</li>
                  <li>Transferência bancária</li>
                  <li>Pagamento na entrega (dinheiro ou cartão)</li>
                </ul>
                <p className="mt-3">
                  <strong>Segurança:</strong> Todos os pagamentos são processados através de plataforma segura (Stripe), garantindo a proteção dos dados financeiros.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Responsabilidades do Cliente</h2>
              <div className="space-y-2 text-sm">
                <p>O cliente compromete-se a:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Fornecer informações corretas e atualizadas</li>
                  <li>Estar disponível no horário de entrega acordado</li>
                  <li>Verificar a qualidade do produto no momento da entrega</li>
                  <li>Comunicar imediatamente qualquer problema identificado</li>
                  <li>Respeitar as condições de armazenamento do marisco</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Responsabilidades da Marisca</h2>
              <div className="space-y-2 text-sm">
                <p>A Marisca compromete-se a:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Entregar marisco fresco e de qualidade</li>
                  <li>Respeitar os horários de entrega acordados</li>
                  <li>Manter a confidencialidade dos dados pessoais</li>
                  <li>Processar pagamentos de forma segura</li>
                  <li>Fornecer suporte ao cliente quando necessário</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. Limitação de Responsabilidade</h2>
              <div className="space-y-2 text-sm">
                <p>A responsabilidade da Marisca limita-se ao valor da encomenda, exceto em casos de dolo ou negligência grave.</p>
                <p>Não nos responsabilizamos por:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Danos causados por armazenamento inadequado após entrega</li>
                  <li>Alterações de sabor devido a preferências pessoais</li>
                  <li>Atrasos causados por circunstâncias extraordinárias</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">10. Resolução de Conflitos</h2>
              <div className="space-y-2 text-sm">
                <p>Em caso de conflito, as partes comprometem-se a tentar resolver a questão de forma amigável.</p>
                <p>Para resolução de litígios de consumo, pode contactar:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Centro de Arbitragem de Conflitos de Consumo de Lisboa</li>
                  <li>Portal do Consumidor (www.consumidor.pt)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">11. Alterações aos Termos</h2>
              <div className="space-y-2 text-sm">
                <p>Estes termos podem ser alterados a qualquer momento. As alterações serão comunicadas através do website.</p>
                <p>O uso continuado do serviço após alterações constitui aceitação dos novos termos.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">12. Contacto</h2>
              <div className="space-y-2 text-sm">
                <p>Para questões relacionadas com estes termos e condições:</p>
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
