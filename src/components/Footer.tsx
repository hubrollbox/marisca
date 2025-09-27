import { Link } from "react-router-dom";
import { MariscaLogo } from "@/components/MariscaLogo";

export function Footer() {
  return (
    <footer className="bg-gradient-ocean text-white py-8 mt-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <MariscaLogo size="sm" className="filter brightness-0 invert" />
          </div>
          
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">Marisca</h3>
            <p className="text-white/80 text-sm">A essência que vem do mar</p>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-white/70 space-y-1">
            <p>Email: info@marisca.pt</p>
            <p>Telefone: A DEFINIR</p>
            <p>Morada: A DEFINIR</p>
          </div>

          {/* Legal Links */}
          <div className="pt-4 border-t border-white/20">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/privacy-policy" 
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Política de Privacidade
              </Link>
              <Link 
                to="/terms-conditions" 
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Termos e Condições
              </Link>
              <Link 
                to="/cookie-policy" 
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Política de Cookies
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-white/20 text-xs text-white/60">
            <p>&copy; {new Date().getFullYear()} Marisca. Todos os direitos reservados.</p>
            <p>Marisco fresco entregue com qualidade em Portugal.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
