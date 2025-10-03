import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana Silva",
    location: "Porto",
    rating: 5,
    text: "Marisco sempre fresco, entregue em poucas horas. A qualidade é incomparável!",
  },
  {
    name: "João Costa",
    location: "Lisboa",
    rating: 5,
    text: "Finalmente posso ter marisco fresco de Leixões sem sair de casa. Recomendo!",
  },
  {
    name: "Maria Santos",
    location: "Matosinhos",
    rating: 5,
    text: "A frescura do marisco é notável. Parece que acabou de sair da lota!",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Que Dizem os Nossos Clientes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A confiança dos nossos clientes é o nosso maior orgulho
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-elegant transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}