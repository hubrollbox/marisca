import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X } from "lucide-react";
import { MariscaLogo } from "@/components/MariscaLogo";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  showSearch?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  variant?: "default" | "minimal";
}

export const Header = ({ 
  showSearch = false, 
  searchTerm = "", 
  onSearchChange,
  variant = "default" 
}: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { label: "Início", path: "/" },
    { label: "Produtos", path: "/produtos" },
    { label: "Sobre", path: "/sobre" },
    { label: "Contactos", path: "/contactos" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-ocean text-white shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-3">
            <MariscaLogo size="sm" variant="white" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">Marisca</h1>
              <p className="text-white/80 text-xs">Da maré para a sua mesa</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navigationLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(link.path)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => user ? navigate("/dashboard") : navigate("/auth")}
              className="hover:bg-white/10"
            >
              <User className="h-5 w-5" />
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gradient-ocean border-l-white/20">
              <nav className="flex flex-col gap-4 mt-8">
                {navigationLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="ghost"
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/10 justify-start text-lg"
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    user ? navigate("/dashboard") : navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  className="border-white/20 text-white hover:bg-white/10 justify-start text-lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user ? "Minha Conta" : "Login"}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
        {showSearch && onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Procurar marisco..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        )}
      </div>
    </header>
  );
};
