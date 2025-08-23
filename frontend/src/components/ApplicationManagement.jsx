import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useApplications } from "../contexts/ApplicationContext";
import { useToast } from "./hooks/use-toast";
import { CheckCircle, XCircle, Clock, User, MessageSquare } from "lucide-react";

export const ApplicationManagement = ({ projectId }) => {
  const { getProjectApplications, updateApplicationStatus } = useApplications();
  const { toast } = useToast();
  const applications = getProjectApplications(projectId);

  const handleAccept = (applicationId, applicantName) => {
    updateApplicationStatus(applicationId, "accepted");
    toast({
      title: "Application accepted",
      description: `${applicantName}'s application has been accepted.`,
    });
  };

  const handleReject = (applicationId, applicantName) => {
    updateApplicationStatus(applicationId, "rejected");
    toast({
      title: "Application rejected",
      description: `${applicantName}'s application has been rejected.`,
    });
  };

  const getStatusIcon = status => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = status => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 text-white">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-green-500 text-white">Rejected</Badge>;
      default:
        return null;
    }
  };

  if (applications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
        <p className="text-muted-foreground">
          Applications to join your project will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(application => (
        <Card key={application.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-primary text-white">
                  {application.applicantName
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{application.applicantName}</h4>
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(application.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(application.status)}
              {getStatusBadge(application.status)}
            </div>
          </div>

          {application.message && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Message:</span>
              </div>
              <p className="text-sm text-muted-foreground">{application.message}</p>
            </div>
          )}

          {application.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAccept(application.id, application.applicantName)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(application.id, application.applicantName)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
