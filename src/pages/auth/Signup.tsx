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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { authApi } from "@/services/api";
import AuthLayout from "@/layouts/AuthLayout";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "individual" | "lawyer";
  }>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "individual",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await authApi.signup(signupData);

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

      toast.success("Account created successfully!");

      navigate("/dashboard");
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message ||
        "Signup failed";

      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    role: value as "individual" | "lawyer",
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Signup;
