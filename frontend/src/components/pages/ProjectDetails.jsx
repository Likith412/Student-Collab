import Navigation from "../Navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import TaskBoard from "../TaskBoard";
import ProjectOverview from "../ProjectOverview";
import { ApplicationDialog } from "../ApplicationDialog";
import { ApplicationManagement } from "../ApplicationManagement";
import {
  ArrowLeft,
  Users,
  Calendar,
  Star,
  MapPin,
  Clock,
  GitBranch,
  MessageSquare,
  Settings,
  Share,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const navigate = useNavigate();

  // Mock project data - in real app this would come from API/URL params
  const project = {
    id: "1",
    title: "AI-Powered Study Buddy",
    description:
      "Building an intelligent tutoring system using machine learning to help students learn more effectively with personalized learning paths and real-time feedback.",
    techStack: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL", "Docker"],
    creator: {
      name: "Sarah Chen",
      avatar: "",
      college: "MIT",
      rating: 4.8,
    },
    teamSize: { current: 3, max: 5 },
    deadline: "December 15, 2024",
    category: "AI/ML",
    difficulty: "Advanced",
    status: "in-progress",
    progress: 65,
    createdAt: "October 1, 2024",
    repositoryUrl: "github.com/sarahchen/ai-study-buddy",
    teamMembers: [
      { name: "Sarah Chen", role: "Project Lead", avatar: "", college: "MIT" },
      { name: "Alex Kumar", role: "ML Engineer", avatar: "", college: "Stanford" },
      { name: "Emma Rodriguez", role: "Frontend Dev", avatar: "", college: "Berkeley" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <div className="bg-gradient-card rounded-xl p-4 sm:p-8 mb-8 border shadow-card">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
            <div className="flex-1">
              {/* Title and Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {project.title}
                </h1>
                <Badge className="bg-status-progress text-white w-fit">
                  {project.status.replace("-", " ")}
                </Badge>
              </div>

              <p className="text-muted-foreground text-base sm:text-lg mb-4">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons - Same position on large, below on medium/small */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:flex-nowrap lg:ml-6">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Bookmark className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Share className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Settings</span>
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Team</span>
              </div>
              <span className="text-xl font-semibold">
                {project.teamSize.current}/{project.teamSize.max}
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Deadline</span>
              </div>
              <span className="text-sm font-medium">Dec 15, 2024</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Progress</span>
              </div>
              <span className="text-xl font-semibold">{project.progress}%</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">Rating</span>
              </div>
              <span className="text-xl font-semibold">{project.creator.rating}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Project Progress</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 sm:flex-none">
              <ApplicationDialog
                projectId={project.id}
                projectTitle={project.title}
                projectCreator={project.creator.name}
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none h-11 min-h-[44px]"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Contact Lead</span>
              <span className="sm:hidden">Contact</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none h-11 min-h-[44px]"
            >
              <GitBranch className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">View Repository</span>
              <span className="sm:hidden">Repository</span>
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto md:overflow-x-visible">
            <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5">
              <TabsTrigger value="overview" className="whitespace-nowrap">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks" className="whitespace-nowrap">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="team" className="whitespace-nowrap">
                Team
              </TabsTrigger>
              <TabsTrigger value="applications" className="whitespace-nowrap">
                Applications
              </TabsTrigger>
              <TabsTrigger value="discussions" className="whitespace-nowrap">
                Discussions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <ProjectOverview project={project} />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="team">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Team Members</h3>
              <div className="space-y-4">
                {project.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {member.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {member.college}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>

              {project.teamSize.current < project.teamSize.max && (
                <div className="mt-6 p-4 border-2 border-dashed border-border rounded-lg text-center">
                  <p className="text-muted-foreground mb-3">
                    Looking for {project.teamSize.max - project.teamSize.current} more
                    team member
                    {project.teamSize.max - project.teamSize.current > 1 ? "s" : ""}
                  </p>
                  <ApplicationDialog
                    projectId={project.id}
                    projectTitle={project.title}
                    projectCreator={project.creator.name}
                  >
                    <Button variant="hero">Apply to Join</Button>
                  </ApplicationDialog>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Applications</h3>
              <ApplicationManagement projectId={project.id} />
            </Card>
          </TabsContent>

          <TabsContent value="discussions">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Project Discussions</h3>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No discussions yet</h4>
                <p className="text-muted-foreground mb-4">
                  Start a conversation with your team members
                </p>
                <Button variant="hero">Start Discussion</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetails;
