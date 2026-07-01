"use client";

import { useState } from "react";
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

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (formData.email) {
      newErrors.email = "Email is invalid";
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setIsOpen(false);
      setFormData({ name: "", email: "", password: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          {/* Name Field - Only show for Sign Up */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`h-11 border-0 bg-gray-50 focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`h-11 border-0 bg-gray-50 focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`h-11 pr-11 border-0 bg-gray-50 focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "ring-2 ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium mt-2 border-0 shadow-none"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center text-sm pt-2">
            {isLogin ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({ name: "", email: "", password: "" });
                  }}
                  className="text-indigo-500 hover:text-indigo-600 font-medium hover:underline transition-colors"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({ name: "", email: "", password: "" });
                  }}
                  className="text-indigo-500 hover:text-indigo-600 font-medium hover:underline transition-colors"
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
