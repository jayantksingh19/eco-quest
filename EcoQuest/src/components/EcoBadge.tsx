import { LucideIcon } from "lucide-react";
import { Award, Star, Zap, Crown, Leaf } from "lucide-react";

interface EcoBadgeProps {
  type: "bronze" | "silver" | "gold" | "platinum" | "eco-warrior";
  title: string;
  description?: string;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
}

const EcoBadge = ({
  type,
  title,
  description,
  earned = true,
  size = "md",
}: EcoBadgeProps) => {
  const getBadgeConfig = (): {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
  } => {
    switch (type) {
      case "bronze":
        return {
          icon: Award,
          color: "text-orange-600",
          bg: "bg-orange-100",
          border: "border-orange-300",
        };
      case "silver":
        return {
          icon: Star,
          color: "text-gray-600",
          bg: "bg-gray-100",
          border: "border-gray-300",
        };
      case "gold":
        return {
          icon: Crown,
          color: "text-warning-foreground",
          bg: "bg-warning",
          border: "border-warning",
        };
      case "platinum":
        return {
          icon: Zap,
          color: "text-purple-600",
          bg: "bg-purple-100",
          border: "border-purple-300",
        };
      case "eco-warrior":
        return {
          icon: Leaf,
          color: "text-success-foreground",
          bg: "bg-success",
          border: "border-success",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          container: "w-16 h-16",
          icon: "h-6 w-6",
          text: "text-xs",
        };
      case "lg":
        return {
          container: "w-24 h-24",
          icon: "h-10 w-10",
          text: "text-lg",
        };
      default:
        return {
          container: "w-20 h-20",
          icon: "h-8 w-8",
          text: "text-sm",
        };
    }
  };

  const config = getBadgeConfig();
  const sizeStyles = getSizeStyles();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`
          ${sizeStyles.container} 
          ${earned ? config.bg : "bg-muted"} 
          ${earned ? config.border : "border-border"}
          border-2 rounded-full flex items-center justify-center
          ${earned ? "shadow-soft" : "opacity-50"}
          transition-all duration-300 hover:scale-105
          ${earned && type === "eco-warrior" ? "animate-glow-pulse" : ""}
        `}
      >
        <Icon
          className={`
            ${sizeStyles.icon} 
            ${earned ? config.color : "text-muted-foreground"}
          `}
        />
      </div>

      <div className="text-center">
        <h4
          className={`font-semibold ${sizeStyles.text} ${
            earned ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {title}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 max-w-20">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EcoBadge;
