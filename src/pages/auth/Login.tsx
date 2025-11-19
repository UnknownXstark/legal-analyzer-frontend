import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { authApi } from "@/services/api";
import AuthLayout from "@/layouts/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Convert email → username (because Django requires username)
      const payload = {
        username: formData.email,
        password: formData.password,
      };

      const response = await authApi.login(payload);

      const user = response.data.user;
      const access = response.data.access || response.data.token || null;
      const refresh = response.data.refresh || null;

      localStorage.setItem("user", JSON.stringify(user));

      if (access) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("token", access);
      }

      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login failed. Check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
