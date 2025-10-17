interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "eco" | "success";
  size?: "sm" | "md" | "lg";
}

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  variant = "default",
  size = "md"
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariantStyles = () => {
    switch (variant) {
      case "eco":
        return "bg-gradient-eco";
      case "success":
        return "bg-success";
      default:
        return "bg-primary";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-2";
      case "lg":
        return "h-4";
      default:
        return "h-3";
    }
  };

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-muted rounded-full overflow-hidden ${getSizeStyles()}`}>
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${getVariantStyles()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
