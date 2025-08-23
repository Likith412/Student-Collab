import Navigation from "../Navigation";
import HeroSection from "../HeroSection";
import DashboardStats from "../DashboardStats";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Calendar,
  MessageSquare,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Index = () => {
  // Mock data for demonstration
  const recentProjects = [
    {
      title: "AI-Powered Study Buddy",
      description:
        "Building an intelligent tutoring system using machine learning to help students learn more effectively.",
      techStack: ["Python", "TensorFlow", "React", "Node.js"],
      creator: {
        name: "Sarah Chen",
        avatar: "",
        college: "MIT",
        rating: 4.9,
      },
      teamSize: { current: 3, max: 5 },
      deadline: "Dec 15",
      category: "AI/ML",
      difficulty: "Advanced",
      status: "recruiting",
    },
    {
      title: "Campus Event Manager",
      description:
        "A comprehensive platform for organizing and managing university events with real-time updates.",
      techStack: ["React", "Firebase", "TypeScript", "Tailwind"],
      creator: {
        name: "Alex Rodriguez",
        avatar: "",
        college: "Stanford",
        rating: 4.7,
      },
      teamSize: { current: 2, max: 4 },
      deadline: "Jan 10",
      category: "Web Dev",
      difficulty: "Intermediate",
      status: "recruiting",
    },
  ];

  const upcomingTasks = [
    {
      title: "Complete API integration",
      project: "Study Buddy",
      dueDate: "Tomorrow",
      priority: "high",
    },
    {
      title: "Design user dashboard",
      project: "Event Manager",
      dueDate: "Dec 8",
      priority: "medium",
    },
    {
      title: "Write project documentation",
      project: "Portfolio Site",
      dueDate: "Dec 10",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Student! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-12">
          <DashboardStats />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects and Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Projects */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Trending Projects
                </h3>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentProjects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="hero" className="h-16 text-lg">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Start New Project
                </Button>
                <Button variant="outline" className="h-16 text-lg">
                  <Calendar className="mr-2 w-5 h-5" />
                  Browse Projects
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">Upcoming Tasks</h4>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-background rounded-lg border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        task.priority === "high"
                          ? "bg-destructive"
                          : task.priority === "medium"
                          ? "bg-status-progress"
                          : "bg-status-done"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.project}</p>
                      <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Tasks
              </Button>
            </Card>

            {/* Notifications */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">Notifications</h4>
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1" />
                  <div className="flex-1">
                    <p className="text-sm">Your join request was accepted!</p>
                    <p className="text-xs text-muted-foreground">
                      AI Study Buddy • 2h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                  <AlertCircle className="w-4 h-4 text-status-progress mt-1" />
                  <div className="flex-1">
                    <p className="text-sm">New member joined your project</p>
                    <p className="text-xs text-muted-foreground">
                      Event Manager • 4h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                  <MessageSquare className="w-4 h-4 text-secondary mt-1" />
                  <div className="flex-1">
                    <p className="text-sm">You have 3 new messages</p>
                    <p className="text-xs text-muted-foreground">Team Chat • 6h ago</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Skill Recommendations */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card">
              <h4 className="font-semibold text-foreground mb-4">Recommended Skills</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-skill-frontend text-white">React</Badge>
                <Badge className="bg-skill-backend text-white">Node.js</Badge>
                <Badge className="bg-skill-design text-white">Figma</Badge>
                <Badge className="bg-skill-ml text-white">Python</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Explore Skills
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
