import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Check, CheckCheck, X, RotateCcw } from "lucide-react";

const TaskActions = ({
  task,
  currentUser,
  onAccept,
  onMarkCompleted,
  onApprove,
  onReject,
  onSendBack,
}) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSendBackDialogOpen, setIsSendBackDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [sendBackNote, setSendBackNote] = useState("");

  const handleReject = () => {
    onReject(task.id, rejectNote);
    setRejectNote("");
    setIsRejectDialogOpen(false);
  };

  const handleSendBack = () => {
    onSendBack(task.id, sendBackNote);
    setSendBackNote("");
    setIsSendBackDialogOpen(false);
  };

  // Get the creator of the task
  const taskCreator = task.actions.find(action => action.type === "created")?.user;
  const canReject = task.status === "review" && currentUser.id !== taskCreator?.id;

  return (
    <>
      <div className="space-y-2">
        {/* To-Do Actions */}
        {task.status === "todo" && !task.assignee && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs w-full"
            onClick={() => onAccept(task.id)}
          >
            <Check className="w-3 h-3 mr-1" />
            Accept Task
          </Button>
        )}

        {/* In-Progress Actions */}
        {task.status === "in-progress" && task.assignee?.id === currentUser.id && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => onMarkCompleted(task.id)}
            >
              <Check className="w-3 h-3 mr-1" />
              Mark Complete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsSendBackDialogOpen(true)}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Send Back
            </Button>
          </div>
        )}

        {/* Review Actions */}
        {task.status === "review" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => onApprove(task.id)}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Approve
            </Button>
            {canReject && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => setIsRejectDialogOpen(true)}
              >
                <X className="w-3 h-3 mr-1" />
                Reject
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="reject-note">Rejection Reason (Optional)</Label>
              <Textarea
                id="reject-note"
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                placeholder="Explain why this task needs more work..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Back Dialog */}
      <Dialog open={isSendBackDialogOpen} onOpenChange={setIsSendBackDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Back to To-Do</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="sendback-note">Reason (Optional)</Label>
              <Textarea
                id="sendback-note"
                value={sendBackNote}
                onChange={e => setSendBackNote(e.target.value)}
                placeholder="Explain why you can't continue with this task..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSendBackDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendBack}>Send Back</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskActions;
