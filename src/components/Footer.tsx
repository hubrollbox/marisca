import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Logo e Tagline */}
        <div className="flex items-center gap-3 mb-6">
          <MariscaLogo size="sm" variant="white" />
          <div>
            <h3 className="font-bold">Marisca</h3>
            <p className="text-sm text-primary-foreground/80">Da maré para a sua mesa</p>
          </div>
        </div>

        {/* Links Legais */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-primary-foreground/90">Informação Legal</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Link 
              to="/politica-privacidade" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link 
              to="/termos-condicoes" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Termos e Condições
            </Link>
            <Link 
              to="/politica-cookies" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Política de Cookies
            </Link>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20 mb-4" />

        {/* Contactos */}
        <div className="text-center text-sm text-primary-foreground/70">
          <p className="mb-1">© 2024 Marisca. Todos os direitos reservados.</p>
          <p>
            <a href="mailto:info@marisca.pt" className="hover:text-primary-foreground transition-colors">
              info@marisca.pt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}