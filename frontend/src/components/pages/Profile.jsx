import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navigation from "../Navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MyApplications } from "../MyApplications";
import {
  MapPin,
  Calendar,
  Star,
  Trophy,
  Users,
  FolderOpen,
  Edit,
  Github,
  Linkedin,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [userProfile, setUserProfile] = useState({});
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const jwtToken = Cookies.get("jwtToken");
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`${API_URL}/api/users/my-profile`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtToken,
          "Content-Type": "application/json",
        },
      });

      const { user } = await response.json();
      console.log("User profile data:", user);
      if (response.ok) {
        setUserProfile(user);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
        setUserProfile({});
      }
    } catch (e) {
      console.log(e);
      setApiStatus(apiStatusConstants.failure);
      setUserProfile({});
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const getProjectStatus = projectStatus => {
    if (projectStatus === "closed") {
      return "Completed";
    } else if (projectStatus === "in_progress") {
      return "In Progress";
    } else if (projectStatus === "open") {
      return "Open";
    } else {
      return "Cancelled";
    }
  };

  const renderProjectHistory = () => {
    if (userProfile.projectsHistory.length === 0) {
      return (
        <div className="p-6 bg-gradient-card border-0">
          <h3 className="font-semibold text-foreground mb-6">My Projects</h3>
          <Card className="p-8 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects yet</h3>
            <p className="text-muted-foreground">
              Your projects History will appear here.
            </p>
            <Button variant="outline" className="mt-4">
              Browse Projects
            </Button>
          </Card>
        </div>
      );
    } else {
      return (
        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Project History</h3>

          <div className="space-y-4">
            {userProfile.projectsHistory.map((project, index) => (
              <div
                key={index}
                className="p-4 bg-background rounded-lg border cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Role:{" "}
                      {project.createdBy == userProfile._id ? "Project Lead" : "Member"}
                    </p>
                  </div>
                  <Badge
                    className={
                      project.status === "closed"
                        ? "bg-status-done text-white"
                        : "bg-status-progress text-white"
                    }
                  >
                    {getProjectStatus(project.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {Math.floor(
                        (new Date(project.deadline) - new Date(project.createdAt)) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}{" "}
                      months
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{project.teamSize} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      );
    }
  };

  const renderSuccessView = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-1">
                {userProfile.username}
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">{userProfile.email}</p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">4.8</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">
                    {userProfile.projectsHistory.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">
                    {new Date(userProfile.createdAt).getFullYear() -
                      new Date().getFullYear()}
                  </div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                {userProfile.githubLink && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(userProfile.githubLink, "_blank")}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                )}
                {userProfile.linkedinLink && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(userProfile.linkedinLink, "_blank")}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card className="p-6 bg-gradient-card border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-3">About Me</h3>
              <p className="text-muted-foreground leading-relaxed">{userProfile.bio}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="ml-2 font-medium">
                      {new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="projects">Project History</TabsTrigger>
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">{renderProjectHistory()}</TabsContent>

              <TabsContent value="applications">
                <Card className="p-6 bg-gradient-card border-0 shadow-card">
                  <h3 className="font-semibold text-foreground mb-6">My Applications</h3>
                  <MyApplications applications={userProfile.applications} />
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="p-6 bg-gradient-card border-0 shadow-card">
                  <h3 className="font-semibold text-foreground mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Sarah Chen</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className="w-3 h-3 fill-current text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Alex was an incredible team lead on our AI project. Great
                        communication skills and technical expertise!"
                      </p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Mike Rodriguez</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className="w-3 h-3 fill-current text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Always delivers high-quality code and helps teammates when
                        they're stuck. Highly recommend!"
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };

  const renderFailureView = () => {
    return <div>Failure View</div>;
  };

  const renderLoadingView = () => {
    return <div>Loading</div>;
  };

  const renderView = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {renderView()}
    </div>
  );
};

export default Profile;
