import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ShoppingBag } from "lucide-react";
import { MariscaLogo } from "@/components/MariscaLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-sand flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <MariscaLogo size="lg" className="mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Página não encontrada</h2>
            <p className="text-muted-foreground">
              A página que procura não existe ou foi movida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate("/")}
              className="flex-1 bg-gradient-sunset"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            <Button 
              onClick={() => navigate("/produtos")}
              variant="outline"
              className="flex-1"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ver Produtos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
