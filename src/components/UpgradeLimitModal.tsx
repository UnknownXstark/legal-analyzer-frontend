import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

interface UpgradeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeLimitModal = ({ open, onOpenChange }: UpgradeLimitModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7 text-warning" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Free Plan Limit Exceeded
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You've reached your monthly analysis limit on the Free plan. Upgrade
            to Premium for unlimited analyses.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              Premium Benefits:
            </span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Unlimited document analyses</li>
            <li>• Advanced AI risk scoring</li>
            <li>• PDF report export</li>
            <li>• Priority processing</li>
          </ul>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:flex-1">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            className="sm:flex-1 gap-2"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeLimitModal;
