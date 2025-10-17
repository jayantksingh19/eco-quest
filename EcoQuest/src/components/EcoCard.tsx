import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EcoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "featured" | "compact";
}

const EcoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  children, 
  className = "",
  variant = "default" 
}: EcoCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "featured":
        return "bg-gradient-nature border-2 border-primary/20 shadow-eco hover:shadow-glow";
      case "compact":
        return "bg-card border border-border shadow-soft hover:shadow-eco";
      default:
        return "bg-card border border-border shadow-soft hover:shadow-eco hover:-translate-y-1";
    }
  };

  return (
    <div className={`
      ${getVariantStyles()}
      rounded-xl p-6 transition-all duration-300 group cursor-pointer
      ${className}
    `}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-gradient-eco rounded-full group-hover:animate-bounce-in">
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        {children && (
          <div className="w-full pt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoCard;