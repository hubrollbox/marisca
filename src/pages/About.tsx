import { Link } from "react-router-dom";
import { ArrowLeft, Waves, Heart, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";

const About = () => {
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
            <h1 className="text-lg font-semibold">Sobre Nós</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">A Nossa História</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Da generosidade do mar para a sua mesa, garantindo frescura, proximidade e simplicidade
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">A Nossa Missão</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ser a ponte entre a generosidade do mar e a mesa, garantindo frescura, proximidade e simplicidade. 
                Acreditamos que cada garfo é uma maré de sabor, e trabalhamos diariamente para levar o melhor 
                marisco fresco da lota de Leixões diretamente à sua mesa, em poucas horas.
              </p>
            </CardContent>
          </Card>

          {/* Vision Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Waves className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">A Nossa Visão</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ser sinónimo de confiança e memória afetiva, ligado ao marisco de qualidade e autenticidade de Leixões. 
                Queremos criar momentos especiais à mesa, onde cada sabor conta uma história do nosso oceano.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Anchor className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Os Nossos Valores</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Frescura Inigualável</h3>
                    <p className="text-muted-foreground">
                      Da maré para a sua mesa, em horas. Garantimos a máxima frescura através de uma cadeia de frio rigorosa.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Autenticidade</h3>
                    <p className="text-muted-foreground">
                      Marisco genuíno da nossa costa, respeitando as tradições e a qualidade que nos define.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Respeito pelo Mar</h3>
                    <p className="text-muted-foreground">
                      Valorizamos a sustentabilidade e o respeito pelos ciclos naturais do oceano.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Minimalismo</h3>
                    <p className="text-muted-foreground">
                      Simplicidade na comunicação e nos processos, focando no essencial: a qualidade do produto.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Paixão pelo Oceano</h3>
                    <p className="text-muted-foreground">
                      Cada produto reflete a nossa ligação profunda ao mar e à tradição marítima portuguesa.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Proximidade</h3>
                    <p className="text-muted-foreground">
                      Criamos relações de confiança com os nossos clientes, baseadas na transparência e qualidade.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Section */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">A Nossa Jornada</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  A Marisca nasceu da paixão pelo mar e pela tradição marítima portuguesa. Começamos com uma visão simples: 
                  conectar diretamente os tesouros do oceano às mesas das famílias, sem intermediários, sem perda de frescura.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Trabalhamos em estreita colaboração com os pescadores locais da lota de Leixões, garantindo que cada 
                  produto mantém a sua autenticidade e qualidade. A nossa abordagem minimalista reflete-se em cada aspeto 
                  do negócio: da seleção cuidadosa dos produtos à simplicidade da experiência de compra.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoje, continuamos fiéis à nossa essência: ser a ponte entre a generosidade do mar e a sua mesa, 
                  garantindo que cada sabor conta uma história de frescura e autenticidade.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Experimente a Diferença</h2>
            <p className="text-muted-foreground mb-6">
              Descubra o sabor autêntico do mar com a frescura de quem se preocupa com cada detalhe.
            </p>
            <Link to="/produtos">
              <Button size="lg">
                Ver Produtos
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;