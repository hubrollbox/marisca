import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useProduct, type ProductState } from "../hooks/use-products";
import { useCart } from "../hooks/use-cart";
import { useToast } from "../hooks/use-toast";
import { Header } from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CartFooter } from "../components/ui/cart-footer";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { AvailabilityBadge, STATE_LABELS } from "../components/ui/product-card";
import { saleBlock, SALE_BLOCK_LABELS } from "../lib/pricing";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { items, addItem } = useCart();
  const { toast } = useToast();

  const [selectedState, setSelectedState] = useState<ProductState>("CRU");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && !product.states.includes(selectedState)) setSelectedState(product.states[0]);
  }, [product, selectedState]);

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
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            )}
            <Button onClick={() => navigate("/produtos")}>Ver todos os produtos</Button>
          </div>
        </Card>
      </div>
    );
  }

  const inCart = items.filter((i) => i.product.id === product.id).reduce((s, i) => s + i.quantity, 0);
  const block = saleBlock(product, inCart + quantity);
  const canIncrease = product.stock === null || inCart + quantity < product.stock;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedState);
    toast({
      title: "Produto adicionado",
      description: `${quantity}x ${product.name} (${STATE_LABELS[selectedState]})`,
    });
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} | Marisca`}
        description={product.description || `${product.name} fresco, da lota para a sua mesa em poucas horas.`}
        canonical={`https://marisca.pt/produtos/${product.id}`}
      />
      <Header />

      <main className="container mx-auto px-4 pb-32">
        <Breadcrumbs items={[{ label: "Produtos", path: "/produtos" }, { label: product.name }]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground text-lg font-medium">Foto em breve</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">{product.name}</h1>
              {product.scientific_name && <p className="text-muted-foreground italic mb-2">{product.scientific_name}</p>}
              {product.description && <p className="text-muted-foreground text-lg">{product.description}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-3xl font-bold text-primary">€{product.price.toFixed(2)}</div>
              {product.weight && <Badge variant="outline">{product.weight}</Badge>}
              <AvailabilityBadge product={product} />
            </div>

            {product.in_closed_season && product.closed_season && (
              <p className="text-sm text-muted-foreground">Período de defeso: {product.closed_season}</p>
            )}

            <div className="space-y-4">
              {product.states.length > 1 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Preparação:</span>
                  <div className="flex gap-2">
                    {product.states.map((state) => (
                      <Button
                        key={state}
                        variant={selectedState === state ? "default" : "outline"}
                        onClick={() => setSelectedState(state)}
                        className="flex-1"
                        aria-pressed={selectedState === state}
                      >
                        {STATE_LABELS[state]}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center font-medium">{quantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!canIncrease}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-muted-foreground">Restam {product.stock} unidades</p>
                )}
              </div>

              <Button onClick={handleAddToCart} size="lg" variant="cta" className="w-full" disabled={!!block}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {block ? SALE_BLOCK_LABELS[block] : "Adicionar ao Carrinho"}
              </Button>
            </div>
          </div>
        </div>


        {/* Additional Info Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
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

      {items.length > 0 && (
        <CartFooter
          items={items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={onCheckout}
        />
      )}
    </div>
  );
};

export default ProductDetail;