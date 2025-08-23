import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  column,
  tasks,
  currentUser,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAcceptTask,
  onMarkCompleted,
  onApproveTask,
  onRejectTask,
  onSendBackTask,
}) => {
  return (
    <div className="space-y-4">
      {/* Column Header */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${column.color}`} />
        <h4 className="font-semibold">{column.title}</h4>
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            currentUser={currentUser}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onAccept={onAcceptTask}
            onMarkCompleted={onMarkCompleted}
            onApprove={onApproveTask}
            onReject={onRejectTask}
            onSendBack={onSendBackTask}
          />
        ))}

        {/* Add Task Button for Column */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground border-2 border-dashed border-border hover:border-border"
          onClick={onAddTask}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add task
        </Button>
      </div>
    </div>
  );
};

export default TaskColumn;
