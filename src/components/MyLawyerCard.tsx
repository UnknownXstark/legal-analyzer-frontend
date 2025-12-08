import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Mail, UserX, Loader2 } from "lucide-react";
import { lawyerClientAPI, Lawyer } from "@/api/lawyerClient";

const MyLawyerCard = () => {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLawyer();
  }, []);

  const fetchLawyer = async () => {
    const { data, error } = await lawyerClientAPI.getClientLawyer();
    if (!error) {
      setLawyer(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Lawyer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lawyer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Lawyer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <UserX className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No lawyer assigned yet</p>
            <p className="text-xs mt-1">
              A lawyer can send you an assignment request
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Lawyer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground">{lawyer.username}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="w-4 h-4" />
              {lawyer.email}
            </div>
            {lawyer.specialization && (
              <Badge variant="secondary" className="mt-2">
                {lawyer.specialization}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyLawyerCard;
