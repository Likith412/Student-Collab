import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useApplications } from "../contexts/ApplicationContext";
import { useToast } from "./hooks/use-toast";
import { Users } from "lucide-react";

export const ApplicationDialog = ({
  projectId,
  projectTitle,
  projectCreator,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { applyToProject } = useApplications();
  const { toast } = useToast();

  const handleSubmit = () => {
    applyToProject(projectId, projectTitle, projectCreator, message);
    setIsOpen(false);
    setMessage("");

    toast({
      title: "Application submitted!",
      description: `Your application to join "${projectTitle}" has been sent to ${projectCreator}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="hero" size="lg" className="h-11 min-h-[44px] w-full">
            <Users className="w-5 h-5 mr-2" />
            Join Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Join Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Project:</h4>
            <p className="font-semibold">{projectTitle}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Project Creator:
            </h4>
            <p>{projectCreator}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the project creator why you'd like to join and what you can contribute..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Application</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
