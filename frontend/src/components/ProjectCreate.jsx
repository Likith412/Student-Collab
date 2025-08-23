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
import { X, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "AI/Machine Learning",
  "Data Science",
  "UI/UX Design",
  "IoT",
  "Game Development",
  "Research",
  "Other",
];

const TECH_STACK_OPTIONS = [
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "C++",
  "C#",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "TensorFlow",
  "PyTorch",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
  "Figma",
  "Adobe XD",
  "Unity",
  "Unreal Engine",
];

function ProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    techStack: [],
    duration: "",
    maxMembers: "",
    requirements: "",
    goals: "",
  });

  const [techInput, setTechInput] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    techStack: "",
    duration: "",
    maxMembers: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = value => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: "" }));
    }
  };

  const addTechStack = () => {
    const tech = techInput.trim();
    if (tech && !formData.techStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech],
      }));
      setTechInput("");
      if (errors.techStack) {
        setErrors(prev => ({ ...prev, techStack: "" }));
      }
    }
  };

  const removeTechStack = techToRemove => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tech => tech !== techToRemove),
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newErrors = {
      title: "",
      description: "",
      category: "",
      techStack: "",
      duration: "",
      maxMembers: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    if (!formData.category) {
      newErrors.category = "Project category is required";
    }
    if (formData.techStack.length === 0) {
      newErrors.techStack = "At least one technology is required";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Project duration is required";
    }
    if (!formData.maxMembers.trim()) {
      newErrors.maxMembers = "Maximum members is required";
    } else if (isNaN(Number(formData.maxMembers)) || Number(formData.maxMembers) < 1) {
      newErrors.maxMembers = "Maximum members must be a positive number";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (!hasErrors) {
      console.log("Project creation data:", formData);
      navigate("/projects");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/projects")}
              className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>

            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow mb-6">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Create New Project
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start a new collaboration project and find amazing teammates to bring your
                ideas to life
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`h-12 bg-background/50 border-border transition-all duration-200 ${
                      errors.title
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                    }`}
                    placeholder="Enter your project title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-foreground"
                  >
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger
                      className={`h-12 bg-background/50 border-border transition-all duration-200 ${
                        errors.category
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                      }`}
                    >
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`min-h-32 bg-background/50 border-border transition-all duration-200 resize-none ${
                    errors.description
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  }`}
                  placeholder="Describe your project idea, objectives, and what you hope to achieve..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Tech Stack *
                </Label>
                <div className="flex gap-2">
                  <Select value={techInput} onValueChange={setTechInput}>
                    <SelectTrigger
                      className={`flex-1 h-12 bg-background/50 border-border transition-all duration-200 ${
                        errors.techStack
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                      }`}
                    >
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {TECH_STACK_OPTIONS.map(tech => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addTechStack}
                    className="h-12 px-4 bg-gradient-primary hover:opacity-90 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                    {formData.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-primary text-white hover:opacity-90 transition-all duration-200 rounded-lg"
                      >
                        {tech}
                        <X
                          className="h-3 w-3 cursor-pointer hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          onClick={() => removeTechStack(tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.techStack && (
                  <p className="text-sm text-destructive mt-1">{errors.techStack}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-sm font-medium text-foreground"
                  >
                    Project Duration *
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`h-12 bg-background/50 border-border transition-all duration-200 ${
                      errors.duration
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                    }`}
                    placeholder="e.g., 3 months, 1 semester"
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive mt-1">{errors.duration}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="maxMembers"
                    className="text-sm font-medium text-foreground"
                  >
                    Maximum Team Members *
                  </Label>
                  <Input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    min="1"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    className={`h-12 bg-background/50 border-border transition-all duration-200 ${
                      errors.maxMembers
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                    }`}
                    placeholder="5"
                  />
                  {errors.maxMembers && (
                    <p className="text-sm text-destructive mt-1">{errors.maxMembers}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="requirements"
                  className="text-sm font-medium text-foreground"
                >
                  Requirements (Optional)
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="min-h-24 bg-background/50 border-border transition-all duration-200 resize-none focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  placeholder="Any specific skills, experience level, or commitments required..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals" className="text-sm font-medium text-foreground">
                  Project Goals (Optional)
                </Label>
                <Textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  className="min-h-24 bg-background/50 border-border transition-all duration-200 resize-none focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  placeholder="What do you hope to achieve with this project?"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 text-lg font-medium hover:bg-muted/50 transition-all duration-200"
                  onClick={() => navigate("/projects")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-lg"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreate;
