import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, Clock, FolderOpen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyApplications = props => {
  const { applications } = props;

  const navigate = useNavigate();
  const getStatusIcon = status => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
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
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (applications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
        <p className="text-muted-foreground">
          Your project applications will appear here.
        </p>
        <Button variant="outline" className="mt-4">
          Browse Projects
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(application => (
        <Card key={application._id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-lg">{application.projectId.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Applied on{" "}
                {new Date(application.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(application.status)}
              {getStatusBadge(application.status)}
            </div>
          </div>

          {application.message && (
            <div className="mb-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Your message:</span> {application.message}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/projects/${application.projectId._id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Project
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
