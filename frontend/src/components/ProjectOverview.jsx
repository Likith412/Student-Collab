import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Calendar,
  GitBranch,
  MapPin,
  Star,
  Clock,
  Target,
  Lightbulb,
} from "lucide-react";

const ProjectOverview = ({ project }) => {
  const milestones = [
    {
      title: "Project Setup & Planning",
      description: "Initial setup, requirements gathering, and project planning",
      status: "completed",
      dueDate: "Oct 15, 2024",
    },
    {
      title: "ML Model Development",
      description: "Develop and train the core machine learning models",
      status: "in-progress",
      dueDate: "Nov 20, 2024",
    },
    {
      title: "Frontend Integration",
      description: "Build the user interface and integrate with backend APIs",
      status: "pending",
      dueDate: "Dec 5, 2024",
    },
    {
      title: "Testing & Deployment",
      description: "Comprehensive testing and production deployment",
      status: "pending",
      dueDate: "Dec 15, 2024",
    },
  ];

  const statusColors = {
    completed: "bg-status-done text-white",
    "in-progress": "bg-status-progress text-white",
    pending: "bg-status-todo text-white",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">About This Project</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium">Goal:</span>
              <span className="text-muted-foreground">
                Create an AI-powered learning assistant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="font-medium">Innovation:</span>
              <span className="text-muted-foreground">
                Personalized learning paths using ML
              </span>
            </div>
          </div>
        </Card>

        {/* Milestones */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Project Milestones</h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      milestone.status === "completed"
                        ? "bg-status-done"
                        : milestone.status === "in-progress"
                        ? "bg-status-progress"
                        : "bg-status-todo"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge className={`text-xs ${statusColors[milestone.status]}`}>
                      {milestone.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Due: {milestone.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Project Creator */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Creator</h3>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-primary text-white">
                {project.creator.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{project.creator.name}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {project.creator.college}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="font-medium">{project.creator.rating}</span>
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="secondary">{project.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Difficulty</span>
              <Badge className="bg-destructive text-destructive-foreground">
                {project.difficulty}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="text-sm">{project.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <a
                href={`https://${project.repositoryUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Repository
              </a>
            </div>
          </div>
        </Card>

        {/* Skills Needed */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills Needed</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Machine Learning</span>
              <Badge variant="outline">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Python</span>
              <Badge variant="outline">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">React</span>
              <Badge variant="secondary">Preferred</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">UI/UX Design</span>
              <Badge variant="secondary">Preferred</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverview;
