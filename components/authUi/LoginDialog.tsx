"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  name: string;
  email: string;
  password: string;
}

export default function LoginDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setError("");
  }

  function validateForm(): boolean {
    let isValid = true;
    const newErrors: Errors = {
      name: "",
      email: "",
      password: "",
    };

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }

        setIsOpen(false);
        setFormData({ name: "", email: "", password: "" });
        setErrors({ name: "", email: "", password: "" });
        router.push("/");
        router.refresh();
        setTimeout(() => window.location.reload(), 500);
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Signup failed");
          setLoading(false);
          return;
        }

        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError("Account created but login failed. Please try logging in.");
          setLoading(false);
          return;
        }

        setIsOpen(false);
        setFormData({ name: "", email: "", password: "" });
        setErrors({ name: "", email: "", password: "" });
        router.refresh();
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function switchMode(mode: boolean) {
    setIsLogin(mode);
    setError("");
    setErrors({ name: "", email: "", password: "" });
    setFormData({ name: "", email: "", password: "" });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-gray-100 flex items-center gap-2 border-0 shadow-none">
          <LogIn size={18} /> Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 border-0 shadow-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {isLogin
              ? "Login to manage your notes"
              : "Sign up to start taking notes"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className={`h-11 bg-gray-50 border-0 ${
                  errors.name ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={`h-11 bg-gray-50 border-0 ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`h-11 bg-gray-50 border-0 pr-10 ${
                  errors.password ? "ring-2 ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  disabled={loading}
                  className="text-indigo-500 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  disabled={loading}
                  className="text-indigo-500 hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
