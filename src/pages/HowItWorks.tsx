import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Anchor, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Encomenda Online",
      description: "Escolhe o marisco fresco no nosso site",
      details: "Navega pela nossa seleção de marisco fresco, escolhe as quantidades e o estado de preparação preferido."
    },
    {
      icon: Anchor,
      title: "Seleção na Lota",
      description: "Garantimos qualidade diretamente na origem",
      details: "Compramos o marisco diretamente na lota, garantindo frescura e autenticidade de Leixões."
    },
    {
      icon: Truck,
      title: "Entrega Fresca",
      description: "À tua mesa em poucas horas",
      details: "Entregamos o marisco fresco em casa, mantendo a cadeia de frio e garantindo a melhor qualidade."
    }
  ];

  return (
    <>
      <SEO 
        title="Como Funciona - Marisca"
        description="Simples como a maré. Descubra como encomendar marisco fresco da lota à sua mesa em poucas horas."
        canonical="https://marisca.pt/como-funciona"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
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
              <h1 className="text-lg font-semibold">Como Funciona</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16 py-20 rounded-lg bg-gradient-ocean text-white">
            <div className="flex justify-center mb-6">
              <Anchor className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Simples como a maré</h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed">
              Na Marisca acreditamos que frescura é simplicidade. Encomendar é rápido, transparente e autêntico.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-elegant transition-shadow">
                <div className="absolute top-0 right-0 text-8xl font-bold text-secondary/20 select-none">
                  {index + 1}
                </div>
                <CardContent className="pt-8 relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-ocean flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center text-primary">
                    {step.title}
                  </h3>
                  <p className="text-lg text-center text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-center text-foreground/70">
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-primary">Pronto para começar?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experimenta a frescura autêntica do marisco de Leixões. Da maré para a tua mesa.
            </p>
            <Link to="/produtos">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
              >
                Faz já a tua encomenda
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-primary">Frescura Garantida</h3>
                <p className="text-muted-foreground">
                  Trabalhamos diretamente com a lota de Matosinhos, garantindo que o marisco chega à tua mesa no mesmo dia da captura. Sem intermediários, sem armazéns.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-primary">Qualidade Certificada</h3>
                <p className="text-muted-foreground">
                  Todo o nosso marisco passa por rigorosos controlos de qualidade. Respeitamos os períodos de defeso e seguimos todas as normas de segurança alimentar.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorks;
