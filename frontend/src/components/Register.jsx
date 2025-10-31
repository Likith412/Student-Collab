import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { X, User, Mail, Lock, FileText, Sparkles, Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import constants from "../utils/constants";
import { useToast } from "./hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;
const SKILLS_LIST = constants.SKILLS_LIST;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    skills: [],
    githubLink: "",
    linkedinLink: "",
    emailLink: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    skills: "",
    githubLink: "",
    linkedinLink: "",
    emailLink: "",
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

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkillInput("");
      // Clear skills error if it exists
      if (errors.skills) {
        setErrors(prev => ({
          ...prev,
          skills: "",
        }));
      }
    }
  };

  const removeSkill = skillToRemove => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSkills = skills => {
    return skills.every(skill => SKILLS_LIST.includes(skill));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {
      username: "",
      email: "",
      password: "",
      bio: "",
      skills: "",
      githubLink: "",
      emailLink: "",
    };

    // Validate required fields
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    } else if (!validateSkills(formData.skills)) {
      newErrors.skills = "One or more skills are not in the allowed list";
    }
    if (formData.emailLink && !formData.emailLink.startsWith("mailto:")) {
      newErrors.emailLink = "Email link must start with mailto:";
    }

    setErrors(newErrors);

    // If no errors, submit the form
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (!hasErrors) {
      try {
        const response = await fetch(`${API_URL}/api/users/register`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Reset form
          setFormData({
            username: "",
            email: "",
            password: "",
            bio: "",
            skills: [],
            githubLink: "",
            linkedinLink: "",
            emailLink: "",
          });

          // Start redirect animation
          setIsRedirecting(true);

          setTimeout(() => {
            setIsRedirecting(false);
            navigate("/");
          }, 1000);
        } else {
          // Backend error
          const errorMessage =
            data.message || data.error || "Registration failed. Please try again.";
          toast({
            title: "Registration Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        // Network or other error
        console.error("Registration error:", error);
        toast({
          title: "Network Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
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
              <h3 className="text-2xl font-bold text-foreground">
                Registration Successful!
              </h3>
              <p className="text-muted-foreground">Redirecting to login page...</p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-16 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 pt-12">
        <div className="w-full max-w-5xl">
          {/* Logo and Title Section */}
          <div className="text-center space-y-8 mb-12 animate-fade-in">
            <div className="mx-auto w-28 h-28 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-auth-hero-glow transform hover:scale-105 transition-smooth relative">
              <Sparkles className="absolute top-2 right-2 w-5 h-5 text-white/60" />
              <span className="text-white font-bold text-3xl">SC</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Join Student Collab
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create your account and start collaborating with talented students on
                amazing projects
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-auth-form-bg backdrop-blur-[20px] rounded-3xl p-8 lg:p-12 shadow-auth-floating border border-auth-card-border animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="username"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <User className="w-5 h-5 text-primary" />
                      Username *
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`h-14 text-base transition-smooth border-2 rounded-xl ${
                        errors.username
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                      placeholder="Choose a unique username"
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive mt-2">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5 text-primary" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`h-14 text-base transition-smooth border-2 rounded-xl ${
                        errors.email
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                      placeholder="student@university.edu"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-2">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <Lock className="w-5 h-5 text-primary" />
                      Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-14 text-base transition-smooth border-2 rounded-xl ${
                        errors.password
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                      placeholder="Create a secure password (min. 6 characters)"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-2">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="bio"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      About You *
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className={`min-h-[112px] text-base transition-smooth resize-none border-2 rounded-xl ${
                        errors.bio
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                      placeholder="Tell us about yourself, your interests, and what you're studying..."
                    />
                    {errors.bio && (
                      <p className="text-sm text-destructive mt-2">{errors.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Skills & Technologies *
                </Label>
                <div className="flex gap-2">
                  <Select value={skillInput} onValueChange={setSkillInput}>
                    <SelectTrigger
                      className={`flex-1 h-14 text-base transition-smooth border-2 rounded-xl ${
                        errors.skills
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                    >
                      <SelectValue placeholder="Select a skill or technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILLS_LIST.map(skill => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addSkill}
                    className="h-14 px-4 bg-gradient-primary hover:opacity-90 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-6 bg-background/60 rounded-2xl border-2 border-border/30">
                    {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-primary text-white hover:opacity-90 transition-all duration-200 hover:scale-105 transform rounded-lg"
                      >
                        {skill}
                        <X
                          className="h-4 w-4 cursor-pointer hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <p className="text-sm text-destructive mt-2">{errors.skills}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Social Links (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="githubLink"
                      className="text-sm text-muted-foreground font-medium"
                    >
                      GitHub Profile
                    </Label>
                    <Input
                      id="githubLink"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleChange}
                      className="h-12 transition-smooth border-2 border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50 rounded-xl"
                      placeholder="github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedinLink"
                      className="text-sm text-muted-foreground font-medium"
                    >
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedinLink"
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleChange}
                      className="h-12 transition-smooth border-2 border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50 rounded-xl"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="emailLink"
                      className="text-sm text-muted-foreground font-medium"
                    >
                      Contact Email
                    </Label>
                    <Input
                      id="emailLink"
                      name="emailLink"
                      value={formData.emailLink}
                      onChange={handleChange}
                      className={`h-12 transition-smooth border-2 rounded-xl ${
                        errors.emailLink
                          ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none"
                          : "border-border/50 focus:border-primary focus:ring-0 focus:outline-none hover:border-primary/50"
                      }`}
                      placeholder="mailto:your@email.com"
                    />
                    {errors.emailLink && (
                      <p className="text-xs text-destructive mt-1">{errors.emailLink}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isRedirecting}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:bg-auth-button-hover transition-smooth shadow-card hover:shadow-elevated hover:scale-[1.02] transform rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRedirecting
                  ? "Creating Account..."
                  : "Create Your Student Collab Account"}
              </Button>
            </form>

            <div className="text-center space-y-6 mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-auth-form-bg px-6 text-muted-foreground font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-smooth rounded-xl"
                asChild
              >
                <Link to="/login">Sign In Instead</Link>
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

export default Register;
