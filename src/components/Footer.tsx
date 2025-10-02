import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <MariscaLogo size="sm" variant="white" />
        </div>

        {/* Links Legais */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-primary-foreground/90">Informação Legal</h4>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-primary-foreground/70">
          <p>© 2024 Marisca. Todos os direitos reservados.</p>
          <p>
            <a 
              href="mailto:info@marisca.pt" 
              className="hover:text-primary-foreground transition-colors underline sm:no-underline sm:hover:underline"
            >
              info@marisca.pt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}