import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

const TaskHistory = ({ task }) => {
  const getActionIcon = type => {
    switch (type) {
      case "created":
        return "✨";
      case "accepted":
        return "👍";
      case "completed":
        return "✅";
      case "approved":
        return "🎉";
      case "rejected":
        return "❌";
      case "sent_back":
        return "↩️";
      default:
        return "📝";
    }
  };

  const getActionText = type => {
    switch (type) {
      case "created":
        return "Created";
      case "accepted":
        return "Accepted";
      case "completed":
        return "Completed";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "sent_back":
        return "Sent back";
      default:
        return "Updated";
    }
  };

  const getActionColor = type => {
    switch (type) {
      case "created":
        return "bg-muted text-muted-foreground";
      case "accepted":
        return "bg-status-progress/10 text-status-progress border-status-progress/20";
      case "completed":
        return "bg-status-done/10 text-status-done border-status-done/20";
      case "approved":
        return "bg-status-done/10 text-status-done border-status-done/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "sent_back":
        return "bg-status-todo/10 text-status-todo border-status-todo/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get the latest 2-3 most relevant actions
  const recentActions = task.actions.slice(-3);

  return (
    <div className="mb-3 space-y-2">
      {recentActions.map((action, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <span className="text-xs">{getActionIcon(action.type)}</span>
          <Avatar className="w-4 h-4">
            <AvatarFallback className="text-[10px] bg-gradient-primary text-primary-foreground">
              {action.user.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{action.user.name}</span>{" "}
            {getActionText(action.type).toLowerCase()}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1 py-0 border ${getActionColor(action.type)}`}
          >
            {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
          </Badge>
        </div>
      ))}

      {task.actions.length > 3 && (
        <div className="text-xs text-muted-foreground">
          +{task.actions.length - 3} more actions
        </div>
      )}

      {/* Current status highlight */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
        <Badge
          variant="outline"
          className={`text-xs ${getActionColor(
            task.status === "todo"
              ? "created"
              : task.status === "in-progress"
              ? "accepted"
              : task.status === "review"
              ? "completed"
              : "approved"
          )}`}
        >
          Current: {task.status.replace("-", " ")}
        </Badge>
      </div>
    </div>
  );
};

export default TaskHistory;
