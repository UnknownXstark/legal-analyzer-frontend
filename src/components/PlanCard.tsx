import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
  isCurrent?: boolean;
  buttonText: string;
  onSelect: () => void;
  disabled?: boolean;
}

const PlanCard = ({
  name,
  price,
  period = "/month",
  description,
  features,
  isPopular,
  isCurrent,
  buttonText,
  onSelect,
  disabled,
}: PlanCardProps) => {
  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all duration-300 hover-lift",
        isPopular && "border-primary shadow-lg scale-105",
        isCurrent && "border-success"
      )}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}
      {isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-success-foreground">
          Current Plan
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-foreground">
          {name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {price !== "Free" && (
            <span className="text-muted-foreground">{period}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included
                    ? "text-foreground"
                    : "text-muted-foreground line-through"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onSelect}
          disabled={disabled || isCurrent}
          className={cn(
            "w-full",
            isPopular
              ? "bg-primary hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {isCurrent ? "Current Plan" : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
