import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { Lock, Check, ArrowRight, Sparkles } from "lucide-react";

const UpgradeRequired = () => {
  const navigate = useNavigate();

  const premiumFeatures = [
    "Unlimited document uploads",
    "Unlimited AI analyses",
    "Full clause detection",
    "Advanced risk scoring",
    "PDF Report Export",
    "Priority queue processing",
    "Faster processing times",
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-warning" />
            </div>
            <CardTitle className="text-2xl">Premium Feature</CardTitle>
            <CardDescription className="text-base">
              This feature is only available on the Premium plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Premium Plan Includes:
                </span>
              </div>
              <ul className="space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">$29</div>
              <div className="text-muted-foreground text-sm">per month</div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full gap-2"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UpgradeRequired;
