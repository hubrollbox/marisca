import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-lg font-semibold">Política de Devoluções</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Política de Devoluções e Reembolsos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça as nossas políticas de devolução, troca e reembolso para produtos de marisco fresco
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Devido à natureza perecível dos nossos produtos de marisco fresco, 
            as devoluções estão sujeitas a condições específicas para garantir a segurança alimentar.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Return Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Política de Devoluções
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Condições Gerais</h3>
              <p className="text-muted-foreground">
                A Marisca aceita devoluções apenas em situações excecionais, dado que trabalhamos exclusivamente 
                com produtos de marisco fresco e perecível. A segurança alimentar é a nossa prioridade máxima.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Motivos Válidos para Devolução:</h4>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Produtos que não correspondem à qualidade esperada</li>
                    <li>Produtos danificados durante o transporte</li>
                    <li>Produtos que não correspondem ao que foi encomendado</li>
                    <li>Problemas evidentes de frescura ou conservação</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Condições Obrigatórias:</h4>
                  <ul className="list-disc list-inside text-muted-foregreen mt-2 space-y-1">
                    <li>A reclamação deve ser feita no prazo máximo de 2 horas após a entrega</li>
                    <li>Os produtos devem estar nas embalagens originais</li>
                    <li>Deve ser fornecida documentação fotográfica do problema</li>
                    <li>O cliente deve estar contactável para verificação</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeframes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Prazos e Procedimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Prazo para Reclamação</h4>
                  <p className="text-muted-foreground text-sm">
                    <strong>Máximo 2 horas</strong> após a entrega para garantir a rastreabilidade 
                    da cadeia de frio e segurança alimentar.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Resposta da Marisca</h4>
                  <p className="text-muted-foreground text-sm">
                    <strong>Até 4 horas</strong> para análise da reclamação e resposta ao cliente 
                    durante o horário de funcionamento.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Resolução</h4>
                  <p className="text-muted-foreground text-sm">
                    <strong>No mesmo dia</strong> sempre que possível, com reposição do produto 
                    ou reembolso conforme o caso.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Reembolso</h4>
                  <p className="text-muted-foreground text-sm">
                    <strong>5-7 dias úteis</strong> para processamento do reembolso após aprovação 
                    da reclamação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Return */}
          <Card>
            <CardHeader>
              <CardTitle>Como Solicitar uma Devolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Passo 1: Contacto Imediato</h4>
                  <p className="text-muted-foreground text-sm">
                    Contacte-nos imediatamente após receber o produto através do email 
                    <a href="mailto:info@marisca.pt" className="text-primary hover:underline ml-1">
                      info@marisca.pt
                    </a> ou telefone +351 220 000 000.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Passo 2: Informações Necessárias</h4>
                  <p className="text-muted-foreground text-sm">
                    Forneça o número da encomenda, descrição do problema e fotografias dos produtos.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Passo 3: Análise</h4>
                  <p className="text-muted-foreground text-sm">
                    A nossa equipa analisará a situação e entrará em contacto para definir a melhor solução.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Passo 4: Resolução</h4>
                  <p className="text-muted-foreground text-sm">
                    Procederemos à reposição do produto ou reembolso, conforme acordado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refunds */}
          <Card>
            <CardHeader>
              <CardTitle>Política de Reembolsos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Reembolsos Totais</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Aplicáveis em casos de produtos com problemas graves de qualidade ou não conformidade.
                </p>
                
                <h4 className="font-semibold mb-2">Métodos de Reembolso</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  <li>Reembolso para o mesmo método de pagamento utilizado na compra</li>
                  <li>Crédito para futuras compras (válido por 6 meses)</li>
                  <li>Reposição imediata do produto (quando disponível)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Custos de Entrega</h4>
                <p className="text-muted-foreground text-sm">
                  Em caso de produto com defeito ou não conformidade da nossa responsabilidade, 
                  os custos de entrega também serão reembolsados.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exceptions */}
          <Card>
            <CardHeader>
              <CardTitle>Exceções e Limitações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Não são aceites devoluções por:</strong>
                  </AlertDescription>
                </Alert>
                
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Mudança de opinião após a entrega</li>
                    <li>Produtos consumidos parcial ou totalmente</li>
                    <li>Problemas de conservação da responsabilidade do cliente</li>
                    <li>Reclamações feitas após o prazo limite de 2 horas</li>
                    <li>Produtos que saíram da cadeia de frio por responsabilidade do cliente</li>
                  </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
              <p className="text-muted-foreground mb-6">
                Se tem alguma dúvida sobre a nossa política de devoluções ou precisa de efetuar uma reclamação, 
                contacte-nos imediatamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contactos">
                  <Button size="lg">
                    Contactar Suporte
                  </Button>
                </Link>
                <a href="mailto:info@marisca.pt">
                  <Button variant="outline" size="lg">
                    info@marisca.pt
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;