import Navigation from "../Navigation";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Search,
  Filter,
  SlidersHorizontal,
  BookOpen,
  Code,
  Palette,
  Brain,
  Zap,
  Globe,
} from "lucide-react";

function Discover() {
  const categories = [
    { name: "Web Development", icon: Globe, count: 45, color: "bg-skill-frontend" },
    { name: "Mobile Apps", icon: Code, count: 32, color: "bg-skill-backend" },
    { name: "AI/ML", icon: Brain, count: 28, color: "bg-skill-ml" },
    { name: "UI/UX Design", icon: Palette, count: 22, color: "bg-skill-design" },
    { name: "Data Science", icon: BookOpen, count: 19, color: "bg-status-progress" },
    { name: "IoT", icon: Zap, count: 15, color: "bg-accent" },
  ];

  const mockProjects = [
    {
      title: "Smart Campus Navigation App",
      description:
        "AR-powered navigation system for university campuses with real-time crowd data and accessibility features.",
      techStack: ["Flutter", "ARCore", "Firebase", "TensorFlow"],
      creator: {
        name: "Maya Patel",
        avatar: "",
        college: "UC Berkeley",
        rating: 4.8,
      },
      teamSize: { current: 2, max: 6 },
      deadline: "Feb 15",
      category: "Mobile Dev",
      difficulty: "Advanced",
      status: "recruiting",
    },
    {
      title: "EcoTracker - Sustainability Dashboard",
      description:
        "Track and gamify your environmental impact with real-time data visualization and community challenges.",
      techStack: ["React", "D3.js", "Node.js", "MongoDB"],
      creator: {
        name: "James Wilson",
        avatar: "",
        college: "Stanford",
        rating: 4.6,
      },
      teamSize: { current: 3, max: 5 },
      deadline: "Jan 30",
      category: "Web Dev",
      difficulty: "Intermediate",
      status: "recruiting",
    },
    {
      title: "VoiceAssist for Accessibility",
      description:
        "AI-powered voice assistant specifically designed for students with visual impairments to navigate digital content.",
      techStack: ["Python", "PyTorch", "React Native", "Azure Speech"],
      creator: {
        name: "Aisha Kumar",
        avatar: "",
        college: "MIT",
        rating: 4.9,
      },
      teamSize: { current: 1, max: 4 },
      deadline: "Mar 1",
      category: "AI/ML",
      difficulty: "Advanced",
      status: "recruiting",
    },
    {
      title: "StudyBuddy - Peer Learning Platform",
      description:
        "Connect students for study sessions with matching algorithms based on subjects, schedules, and learning styles.",
      techStack: ["Vue.js", "Express", "PostgreSQL", "Socket.io"],
      creator: {
        name: "Carlos Rodriguez",
        avatar: "",
        college: "Harvard",
        rating: 4.7,
      },
      teamSize: { current: 4, max: 6 },
      deadline: "Dec 20",
      category: "Web Dev",
      difficulty: "Intermediate",
      status: "recruiting",
    },
  ];

  const skills = [
    "React",
    "Python",
    "Node.js",
    "UI/UX",
    "Flutter",
    "AI/ML",
    "Data Science",
    "MongoDB",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Projects</h1>
          <p className="text-muted-foreground">
            Find amazing projects to collaborate on and grow your skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects, technologies, or keywords..."
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              All Projects
            </Badge>
            {skills.map(skill => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card border-0 shadow-card sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border hover:shadow-sm transition-smooth cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-foreground mb-3">Difficulty Level</h4>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-foreground mb-3">Team Size</h4>
                <div className="space-y-2">
                  {["1-3 members", "4-6 members", "7+ members"].map(size => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {mockProjects.length} of 127 projects
              </p>
              <select className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Deadline Soon</option>
                <option>Best Match</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover;
