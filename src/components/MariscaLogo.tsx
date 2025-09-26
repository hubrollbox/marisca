import mariscaLogo from "@/assets/marisca-logo.png";

interface MariscaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function MariscaLogo({ size = "md", className = "" }: MariscaLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <img
      src={mariscaLogo}
      alt="Marisca - A Essência que Vem do Mar"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}