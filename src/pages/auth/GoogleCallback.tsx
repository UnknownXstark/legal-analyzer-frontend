import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { authAPI } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout";
import { Loader2 } from "lucide-react";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      const credential = searchParams.get("credential");
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google authentication failed");
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const token = credential || code;
      if (!token) {
        toast.error("No authentication credential received");
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const { data, error: apiError } = await authAPI.googleLogin(token);

        if (apiError) {
          toast.error(apiError);
          setStatus("error");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Store tokens and user data
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Successfully logged in with Google!");

        // Redirect based on role
        const role = data.user.role || "individual";
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "lawyer") {
          navigate("/lawyer-dashboard");
        } else {
          navigate("/individual-dashboard");
        }
      } catch (err: any) {
        toast.error(err.message || "Authentication failed");
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Completing Sign In
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your Google account...
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-destructive text-2xl">!</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Authentication Failed
              </h2>
              <p className="text-muted-foreground">
                Redirecting you back to login...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default GoogleCallback;
