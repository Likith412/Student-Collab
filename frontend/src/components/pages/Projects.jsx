import Navigation from "../Navigation";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Plus, FolderOpen, Clock, CheckCircle2, Users, Calendar } from "lucide-react";

const Projects = () => {
  const myProjects = [
    {
      title: "AI-Powered Study Buddy",
      description:
        "Building an intelligent tutoring system using machine learning to help students learn more effectively.",
      techStack: ["Python", "TensorFlow", "React", "Node.js"],
      creator: {
        name: "You",
        avatar: "",
        college: "Your College",
        rating: 4.8,
      },
      teamSize: { current: 3, max: 5 },
      deadline: "Dec 15",
      category: "AI/ML",
      difficulty: "Advanced",
      status: "in-progress",
    },
    {
      title: "Campus Event Manager",
      description:
        "A comprehensive platform for organizing and managing university events with real-time updates.",
      techStack: ["React", "Firebase", "TypeScript", "Tailwind"],
      creator: {
        name: "You",
        avatar: "",
        college: "Your College",
        rating: 4.8,
      },
      teamSize: { current: 4, max: 4 },
      deadline: "Jan 10",
      category: "Web Dev",
      difficulty: "Intermediate",
      status: "in-progress",
    },
    {
      title: "Student Portfolio Builder",
      description:
        "Template-based portfolio builder specifically designed for students to showcase their academic and project work.",
      techStack: ["Next.js", "Tailwind", "Framer Motion"],
      creator: {
        name: "You",
        avatar: "",
        college: "Your College",
        rating: 4.8,
      },
      teamSize: { current: 2, max: 3 },
      deadline: "Completed",
      category: "Web Dev",
      difficulty: "Beginner",
      status: "completed",
    },
  ];

  const projectStats = [
    {
      title: "Active Projects",
      value: "2",
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed",
      value: "1",
      icon: CheckCircle2,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Team Members",
      value: "7",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: Calendar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Projects</h1>
            <p className="text-muted-foreground">
              Manage your current projects and track your progress
            </p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {projectStats.map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Project Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
          <Button variant="default" size="sm" className="bg-background text-foreground">
            All Projects
          </Button>
          <Button variant="ghost" size="sm">
            Active
          </Button>
          <Button variant="ghost" size="sm">
            Completed
          </Button>
          <Button variant="ghost" size="sm">
            Archived
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {myProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Empty State or Load More */}
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready to start your next project?
            </h3>
            <p className="text-muted-foreground mb-4">
              Create a new project and start collaborating with talented students from
              around the world.
            </p>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
