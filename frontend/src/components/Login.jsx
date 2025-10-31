import React, { useState, useContext } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Mail, Lock, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";
import Cookies from "js-cookie";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { toast } = useToast();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    // Validate required fields
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in cookies
          Cookies.set("jwtToken", data.token);
          setUser(data.user);

          // Start redirect animation
          setIsRedirecting(true);

          // Redirect to home page after animation delay
          setTimeout(() => {
            setIsRedirecting(false);
            navigate("/");
          }, 1000);
        } else {
          // Login failed
          const errorMessage =
            data.message || data.error || "Login failed. Please try again.";
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Network Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-auth-bg relative overflow-hidden">
      {/* Animated Redirect Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6 animate-scale-in">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Login Successful!</h3>
              <p className="text-muted-foreground">
                Welcome back! Redirecting to Home...
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 pt-12">
        <div className="w-full max-w-lg">
          {/* Logo and Title Section */}
          <div className="text-center space-y-8 mb-12 animate-fade-in">
            <div className="mx-auto w-28 h-28 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-auth-hero-glow transform hover:scale-105 transition-smooth relative">
              <Sparkles className="absolute top-2 right-2 w-5 h-5 text-white/60" />
              <span className="text-white font-bold text-3xl">SC</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                Sign in to continue your collaboration journey with fellow students
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-auth-form-bg backdrop-blur-[20px] rounded-3xl p-8 shadow-auth-floating border border-auth-card-border animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-14 text-base transition-smooth border-2 rounded-xl ${
                      errors.email
                        ? "border-destructive focus:shadow-auth-input-focus"
                        : "border-border/50 focus:border-primary focus:shadow-auth-input-focus hover:border-primary/50"
                    }`}
                    placeholder="student@university.edu"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <Lock className="w-5 h-5 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`h-14 text-base transition-smooth border-2 rounded-xl ${
                      errors.password
                        ? "border-destructive focus:shadow-auth-input-focus"
                        : "border-border/50 focus:border-primary focus:shadow-auth-input-focus hover:border-primary/50"
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:bg-auth-button-hover transition-smooth shadow-card hover:shadow-elevated hover:scale-[1.02] transform rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading
                  ? "Signing In..."
                  : isRedirecting
                  ? "Redirecting..."
                  : "Sign In to Student Collab"}
              </Button>
            </form>

            <div className="text-center space-y-6 mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-auth-form-bg px-6 text-muted-foreground font-medium">
                    New to Student Collab?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-smooth rounded-xl"
                asChild
              >
                <Link to="/register">Create Your Account</Link>
              </Button>
            </div>

            <div className="text-center pt-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
