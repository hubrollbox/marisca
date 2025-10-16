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
            <a
              href="https://www.livroreclamacoes.pt/Utilizador/AutenticacaoConsumidor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
              aria-label="Livro de Reclamações"
            >
              <img src="/livro-reclamacoes.svg" alt="Livro de Reclamações" className="h-5 w-auto" />
            </a>
          </div>
        </div>

        {/* Redes Sociais + CTA Parcerias */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Ícones sociais */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 8.98h4v12H3zM9.5 8.98h3.8v1.65h.05c.53-.96 1.82-1.98 3.75-1.98 4.01 0 4.75 2.64 4.75 6.07v6.26h-4v-5.56c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.65h-4v-12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.5 3h5.3L12 7.2 15.7 3H21l-7.2 8.2L22 21h-5.3l-5-6.5L6 21H3l7.4-8.6L4.5 3z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 32 32 0 000 12a32 32 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A32 32 0 0024 12a32 32 0 00-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
              </svg>
            </a>
          </div>

          {/* CTA Parcerias */}
          <Link
            to="/parcerias"
            className="text-xs px-2 py-1 rounded-md border border-primary-foreground/30 text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
          >
            Parcerias
          </Link>
        </div>

        <Separator className="bg-primary-foreground/20 mb-4" />

        {/* Contactos */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Marisca. Todos os direitos reservados.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a 
              href="tel:+351220145169" 
              className="hover:text-primary-foreground transition-colors"
            >
              +351 220 145 169
            </a>
            <a 
              href="mailto:info@marisca.pt" 
              className="hover:text-primary-foreground transition-colors underline sm:no-underline sm:hover:underline"
            >
              info@marisca.pt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}