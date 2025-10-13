import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COOKIE_CONSENT_KEY = "marisca_cookie_consent";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <Card className="max-w-4xl mx-auto bg-gradient-ocean text-white border-none shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <p className="text-sm leading-relaxed">
                Utilizamos cookies para melhorar a sua experiência no nosso site, analisar o tráfego e personalizar conteúdo. 
                Ao continuar a navegar, aceita a nossa{" "}
                <Link 
                  to="/politica-cookies" 
                  className="underline hover:text-white/80 transition-colors"
                  onClick={() => setIsVisible(false)}
                >
                  Política de Cookies
                </Link>.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAccept}
                  size="sm"
                  style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
                  className="hover:opacity-90 transition-opacity"
                >
                  Aceitar
                </Button>
                <Button 
                  onClick={handleReject}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Recusar
                </Button>
                <Link to="/politica-cookies" onClick={() => setIsVisible(false)}>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Saber Mais
                  </Button>
                </Link>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 shrink-0"
              aria-label="Fechar banner de cookies"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
