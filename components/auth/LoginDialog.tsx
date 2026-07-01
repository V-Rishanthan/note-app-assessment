"use client";

import { useState, ChangeEvent, FormEvent } from "react";
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
import { LogIn, Eye, EyeOff } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          alert(data?.message || "Invalid email or password");
          return;
        }

        alert("Login successful!");
        setIsOpen(false);
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Signup failed");
          return;
        }

        alert("Account created successfully!");
        setIsLogin(true);
        setIsOpen(false);
      }

      setFormData({ name: "", email: "", password: "" });
      setErrors({ name: "", email: "", password: "" });
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-gray-100 flex items-center gap-2 border-0 shadow-none">
          <LogIn size={18} />
          Login
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
          {!isLogin && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-11 bg-gray-50 border-0"
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
              value={formData.email}
              onChange={handleChange}
              className="h-11 bg-gray-50 border-0"
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
                className="h-11 bg-gray-50 border-0 pr-10"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2"
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
            className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-500"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-500"
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
