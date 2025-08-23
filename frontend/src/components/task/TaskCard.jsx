import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  MoreHorizontal,
  Calendar,
  Flag,
  MessageSquare,
  Paperclip,
  Edit,
  Trash,
} from "lucide-react";
import TaskActions from "./TaskActions";
import TaskHistory from "./TaskHistory";

const TaskCard = ({
  task,
  currentUser,
  onEdit,
  onDelete,
  onAccept,
  onMarkCompleted,
  onApprove,
  onReject,
  onSendBack,
}) => {
  const priorityColors = {
    low: "border-l-status-progress",
    medium: "border-l-status-todo",
    high: "border-l-destructive",
  };

  const priorityBadgeColors = {
    low: "bg-status-progress/10 text-status-progress border-status-progress/20",
    medium: "bg-status-todo/10 text-status-todo border-status-todo/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusColors = {
    todo: "bg-status-todo/10",
    "in-progress": "bg-status-progress/10",
    review: "bg-secondary/10",
    done: "bg-status-done/10",
  };

  return (
    <Card
      className={`p-4 border-l-4 ${priorityColors[task.priority]} ${
        statusColors[task.status]
      } hover:shadow-elevated transition-all duration-300 cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-sm leading-tight">{task.title}</h5>
        {task.status === "todo" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, 2).map((label, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
          {task.labels.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{task.labels.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Task History */}
      <TaskHistory task={task} />

      {/* Task Footer */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                {task.assignee.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
          <Badge className={`text-xs border ${priorityBadgeColors[task.priority]}`}>
            <Flag className="w-3 h-3 mr-1" />
            {task.priority}
          </Badge>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </div>
        )}
      </div>

      {/* Task Actions */}
      <TaskActions
        task={task}
        currentUser={currentUser}
        onAccept={onAccept}
        onMarkCompleted={onMarkCompleted}
        onApprove={onApprove}
        onReject={onReject}
        onSendBack={onSendBack}
      />

      {/* General Actions */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
        <Button variant="ghost" size="sm" className="h-6 text-xs">
          <MessageSquare className="w-3 h-3 mr-1" />2
        </Button>
        <Button variant="ghost" size="sm" className="h-6 text-xs">
          <Paperclip className="w-3 h-3 mr-1" />1
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
