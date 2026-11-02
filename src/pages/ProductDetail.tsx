import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useProduct } from "../hooks/use-products";
import { Header } from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { QuoteBar } from "../components/catalog/QuoteBar";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { AvailabilityBadge } from "../components/catalog/AvailabilityBadge";
import { ProductOrderControls } from "../components/catalog/ProductOrderControls";
import { PRICE_ON_QUOTE } from "../lib/catalog";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, refetch } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="A carregar">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-2">
            {isError ? "Não foi possível carregar o produto" : "Produto não encontrado"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isError ? "Verifique a ligação e tente novamente." : "O produto que procura não existe ou foi removido"}
          </p>
          <div className="flex gap-2 justify-center">
            {isError && (
              <Button variant="outline" className="min-h-11" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            )}
            <Button className="min-h-11" onClick={() => navigate("/produtos")}>Ver todos os produtos</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} | Marisca`}
        description={product.description || `${product.name} fresco, da lota para a sua mesa em poucas horas.`}
        canonical={`https://marisca.pt/produtos/${product.id}`}
      />
      <Header />

      <main className="max-w-2xl mx-auto px-4 pb-32">
        <Breadcrumbs items={[{ label: "Produtos", path: "/produtos" }, { label: product.name }]} />

        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-heading font-bold leading-tight">{product.name}</h1>
            {product.scientific_name && <p className="text-sm text-muted-foreground italic">{product.scientific_name}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AvailabilityBadge product={product} />
            {product.unit && <Badge variant="outline">{product.unit === "kg" ? "Ao kg" : "À unidade"}</Badge>}
            {product.weight && <Badge variant="outline">{product.weight}</Badge>}
          </div>

          <p className="text-sm font-semibold text-foreground">{PRICE_ON_QUOTE}</p>

          {product.in_closed_season && product.closed_season && (
            <p className="text-sm text-muted-foreground">Período de defeso: {product.closed_season}</p>
          )}

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="mb-2 text-sm font-medium">Adicionar ao pedido</p>
            <ProductOrderControls product={product} />
          </div>

          {product.description && <p className="text-muted-foreground">{product.description}</p>}

          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-w-sm aspect-[4/3] rounded-lg object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-10">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="flex w-full overflow-x-auto justify-start">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="sensory">Sensorial</TabsTrigger>
              <TabsTrigger value="conservation">Conservação</TabsTrigger>
              <TabsTrigger value="quality">Qualidade</TabsTrigger>
              <TabsTrigger value="legal">Informação Legal</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.scientific_name && (
                      <div>
                        <h4 className="font-semibold">Nome Científico</h4>
                        <p className="text-muted-foreground italic">{product.scientific_name}</p>
                      </div>
                    )}
                    {product.category && (
                      <div>
                        <h4 className="font-semibold">Categoria</h4>
                        <p className="text-muted-foreground">{product.category}</p>
                      </div>
                    )}
                    {product.presentation && (
                      <div>
                        <h4 className="font-semibold">Apresentação</h4>
                        <p className="text-muted-foreground">{product.presentation}</p>
                      </div>
                    )}
                    {product.average_weight && (
                      <div>
                        <h4 className="font-semibold">Peso Médio Unitário</h4>
                        <p className="text-muted-foreground">{product.average_weight}</p>
                      </div>
                    )}
                    {product.origin && (
                      <div>
                        <h4 className="font-semibold">Origem/Área de Captura</h4>
                        <p className="text-muted-foreground">{product.origin}</p>
                      </div>
                    )}
                    {product.consumption_suggestion && (
                      <div>
                        <h4 className="font-semibold">Sugestão de Consumo</h4>
                        <p className="text-muted-foreground">{product.consumption_suggestion}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sensory" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.sensory_description && (
                      <div>
                        <h4 className="font-semibold">Descrição Sensorial</h4>
                        <p className="text-muted-foreground">{product.sensory_description}</p>
                      </div>
                    )}
                    {product.description && (
                      <div>
                        <h4 className="font-semibold">Características</h4>
                        <p className="text-muted-foreground">{product.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conservation" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.ideal_conservation && (
                      <div>
                        <h4 className="font-semibold">Conservação Ideal</h4>
                        <p className="text-muted-foreground">{product.ideal_conservation}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Prazo de Consumo</h4>
                      <p className="text-muted-foreground">
                        Consumir no prazo de 24-48 horas após a entrega para garantir máxima frescura e qualidade.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Entrega</h4>
                      <p className="text-muted-foreground">
                        Entrega no mesmo dia em embalagem isotérmica para manter a temperatura ideal e frescura.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.quality_checklist && (
                      <div>
                        <h4 className="font-semibold">Checklist de Qualidade</h4>
                        <p className="text-muted-foreground">{product.quality_checklist}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Garantia de Frescura</h4>
                      <p className="text-muted-foreground">
                        Todo o nosso marisco é adquirido diretamente na lota e entregue no mesmo dia da captura, garantindo máxima frescura e qualidade.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.closed_season && (
                      <div>
                        <h4 className="font-semibold">Período de Defeso</h4>
                        <p className="text-muted-foreground">{product.closed_season}</p>
                      </div>
                    )}
                    {product.legal_notes && (
                      <div>
                        <h4 className="font-semibold">Notas Legais</h4>
                        <p className="text-muted-foreground">{product.legal_notes}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Rastreabilidade</h4>
                      <p className="text-muted-foreground">
                        Todos os nossos produtos cumprem os requisitos de rastreabilidade estabelecidos pela legislação europeia e nacional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Como sei se o marisco está fresco?</h4>
                      <p className="text-muted-foreground">
                        Todo o nosso marisco é entregue no mesmo dia da captura, garantindo máxima frescura. Além disso, seguimos rigorosos critérios de qualidade descritos no checklist de cada produto.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Quanto tempo posso conservar o produto?</h4>
                      <p className="text-muted-foreground">
                        Recomendamos o consumo no prazo de 24-48 horas após a entrega. Consulte as condições ideais de conservação na aba "Conservação".
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Posso devolver se não estiver satisfeito?</h4>
                      <p className="text-muted-foreground">
                        Sim, garantimos a qualidade de todos os nossos produtos. Em caso de insatisfação, entre em contacto connosco de imediato.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <CartFooter />
    </div>
  );
};

export default ProductDetail;