import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Footer } from "@/components/Footer";

const FAQ = () => {
  const faqData = [
    {
      category: "Encomendas e Entregas",
      questions: [
        {
          question: "Qual é o horário de entrega?",
          answer: "Entregamos de segunda a sábado, entre as 9h e as 18h. No domingo não fazemos entregas. As entregas são feitas no mesmo dia para encomendas efetuadas até às 14h."
        },
        {
          question: "Quais são as zonas de entrega?",
          answer: "Atualmente entregamos no Porto e em Lisboa. Estamos a trabalhar para expandir as nossas zonas de entrega para outras cidades."
        },
        {
          question: "Qual é o valor mínimo de encomenda?",
          answer: "O valor mínimo de encomenda é de 25€. Para encomendas superiores a 50€, a entrega é gratuita."
        },
        {
          question: "Como posso acompanhar a minha encomenda?",
          answer: "Após confirmar a encomenda, receberá um email com o número de seguimento. Pode acompanhar o estado da sua encomenda na sua área pessoal."
        }
      ]
    },
    {
      category: "Produtos e Qualidade",
      questions: [
        {
          question: "Como garantem a frescura do marisco?",
          answer: "Todo o nosso marisco é adquirido diretamente na lota de Leixões no mesmo dia da entrega. Utilizamos uma cadeia de frio rigorosa para manter a frescura desde a captura até à sua mesa."
        },
        {
          question: "O marisco vem limpo e preparado?",
          answer: "Pode escolher entre marisco cru (natural) ou cozido. O marisco cru vem limpo e pronto a cozinhar. O marisco cozido está pronto a consumir."
        },
        {
          question: "Como conservar o marisco em casa?",
          answer: "Mantenha o marisco refrigerado entre 0°C e 4°C. Consuma no prazo de 24-48 horas após a entrega para garantir a máxima qualidade e frescura."
        },
        {
          question: "O que fazer se não estou satisfeito com o produto?",
          answer: "A sua satisfação é a nossa prioridade. Se não estiver satisfeito com qualquer produto, contacte-nos dentro de 24 horas e resolveremos a situação."
        }
      ]
    },
    {
      category: "Pagamentos",
      questions: [
        {
          question: "Que métodos de pagamento aceitam?",
          answer: "Aceitamos cartões de crédito e débito (Visa, Mastercard), MB Way e transferência bancária."
        },
        {
          question: "O pagamento é seguro?",
          answer: "Sim, todos os pagamentos são processados através de uma plataforma segura com encriptação SSL. Os seus dados financeiros estão sempre protegidos."
        },
        {
          question: "Posso pagar na entrega?",
          answer: "Atualmente não oferecemos pagamento na entrega. Todos os pagamentos devem ser efetuados online no momento da encomenda."
        }
      ]
    },
    {
      category: "Conta e Registo",
      questions: [
        {
          question: "Preciso de criar uma conta para encomendar?",
          answer: "Não é obrigatório criar uma conta, mas recomendamos para uma melhor experiência. Com uma conta pode acompanhar as suas encomendas e gerir os seus dados."
        },
        {
          question: "Como alterar os meus dados pessoais?",
          answer: "Pode alterar os seus dados pessoais na sua área pessoal, secção 'Minha Conta'. Clique em 'Editar Perfil' para atualizar as suas informações."
        },
        {
          question: "Esqueci-me da minha palavra-passe. O que fazer?",
          answer: "Na página de login, clique em 'Esqueci a palavra-passe' e siga as instruções para criar uma nova palavra-passe."
        }
      ]
    },
    {
      category: "Devoluções e Reembolsos",
      questions: [
        {
          question: "Posso devolver produtos?",
          answer: "Devido à natureza perecível dos nossos produtos, só aceitamos devoluções em casos excecionais de qualidade. Contacte-nos imediatamente se houver algum problema."
        },
        {
          question: "Como solicitar um reembolso?",
          answer: "Para solicitar um reembolso, contacte-nos através do email info@marisca.pt com o número da encomenda e o motivo. Analisaremos cada caso individualmente."
        },
        {
          question: "Quanto tempo demora o reembolso?",
          answer: "Os reembolsos aprovados são processados no prazo de 5-7 dias úteis, dependendo do método de pagamento utilizado."
        }
      ]
    }
  ];

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
            <h1 className="text-lg font-semibold">Perguntas Frequentes</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas às dúvidas mais comuns sobre os nossos produtos e serviços
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
            <p className="text-muted-foreground mb-6">
              Não encontrou a resposta que procurava? Entre em contacto connosco e teremos todo o gosto em ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contactos">
                <Button size="lg">
                  Contactar-nos
                </Button>
              </Link>
              <a href="mailto:info@marisca.pt">
                <Button variant="outline" size="lg">
                  Enviar Email
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;