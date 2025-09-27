import mariscaLogo from "@/assets/marisca-logo.png";
import mariscaLogoWhite from "@/assets/marisca-logo-white.png";
import mariscaLogoWithBg from "@/assets/marisca-logo-with-bg.png";

interface MariscaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "white" | "with-bg";
  className?: string;
}

export function MariscaLogo({ size = "md", variant = "default", className = "" }: MariscaLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto", 
    lg: "h-16 w-auto",
    xl: "h-24 w-auto"
  };

  const logoSrc = {
    default: mariscaLogo,
    white: mariscaLogoWhite,
    "with-bg": mariscaLogoWithBg
  };

  return (
    <img
      src={logoSrc[variant]}
      alt="Marisca - Da maré para a sua mesa"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}