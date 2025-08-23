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
        <div className="bg-gradient-card rounded-xl p-8 mb-8 border shadow-card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                <Badge className="bg-status-progress text-white">
                  {project.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg mb-4">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
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
          <div className="flex gap-3">
            <ApplicationDialog
              projectId={project.id}
              projectTitle={project.title}
              projectCreator={project.creator.name}
            />
            <Button variant="outline" size="lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Lead
            </Button>
            <Button variant="outline" size="lg">
              <GitBranch className="w-5 h-5 mr-2" />
              View Repository
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

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
