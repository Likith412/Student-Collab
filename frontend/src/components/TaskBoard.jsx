import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Plus } from "lucide-react";
import TaskColumn from "./task/TaskColumn";
import TaskDialog from "./task/TaskDialog";
import { useToast } from "./hooks/use-toast";

function TaskBoard() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { toast } = useToast();

  // Mock current user - in real app this would come from auth context
  const currentUser = {
    name: "Alex Kumar",
    avatar: "",
    id: "alex-kumar",
  };

  // Mock tasks data with enhanced action history
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Set up ML development environment",
      description:
        "Configure TensorFlow, Python environment, and data preprocessing pipeline",
      status: "done",
      priority: "high",
      assignee: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
      completedBy: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
      dueDate: "Oct 15",
      labels: ["setup", "backend"],
      reviewCount: 1,
      actions: [
        {
          type: "created",
          user: { name: "John Doe", avatar: "", id: "john-doe" },
          timestamp: "2024-01-01T10:00:00Z",
        },
        {
          type: "accepted",
          user: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
          timestamp: "2024-01-02T09:00:00Z",
        },
        {
          type: "completed",
          user: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
          timestamp: "2024-01-10T16:00:00Z",
        },
        {
          type: "approved",
          user: { name: "John Doe", avatar: "", id: "john-doe" },
          timestamp: "2024-01-11T10:00:00Z",
        },
      ],
    },
    {
      id: "2",
      title: "Design user interface mockups",
      description: "Create wireframes and mockups for the main learning interface",
      status: "done",
      priority: "medium",
      assignee: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
      completedBy: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
      dueDate: "Oct 20",
      labels: ["design", "frontend"],
      reviewCount: 1,
      actions: [
        {
          type: "created",
          user: { name: "Mike Johnson", avatar: "", id: "mike-johnson" },
          timestamp: "2024-01-05T14:00:00Z",
        },
        {
          type: "accepted",
          user: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
          timestamp: "2024-01-06T09:00:00Z",
        },
        {
          type: "completed",
          user: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
          timestamp: "2024-01-15T17:00:00Z",
        },
        {
          type: "approved",
          user: { name: "Mike Johnson", avatar: "", id: "mike-johnson" },
          timestamp: "2024-01-16T11:00:00Z",
        },
      ],
    },
    {
      id: "3",
      title: "Implement user authentication",
      description: "Set up user registration, login, and session management",
      status: "in-progress",
      priority: "high",
      assignee: { name: "Alex Kumar", avatar: "", id: "alex-kumar" },
      dueDate: "Nov 5",
      labels: ["backend", "auth"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: { name: "John Doe", avatar: "", id: "john-doe" },
          timestamp: "2024-01-20T10:00:00Z",
        },
        {
          type: "accepted",
          user: { name: "Alex Kumar", avatar: "", id: "alex-kumar" },
          timestamp: "2024-01-21T09:00:00Z",
        },
      ],
    },
    {
      id: "4",
      title: "Train initial ML model",
      description: "Develop and train the first version of the recommendation model",
      status: "in-progress",
      priority: "high",
      assignee: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
      dueDate: "Nov 15",
      labels: ["ml", "backend"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: { name: "Dr. Smith", avatar: "", id: "dr-smith" },
          timestamp: "2024-01-18T13:00:00Z",
        },
        {
          type: "accepted",
          user: { name: "Sarah Chen", avatar: "", id: "sarah-chen" },
          timestamp: "2024-01-19T08:00:00Z",
        },
      ],
    },
    {
      id: "5",
      title: "Create learning dashboard",
      description: "Build the main dashboard where students can track their progress",
      status: "review",
      priority: "medium",
      assignee: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
      dueDate: "Nov 10",
      labels: ["frontend", "dashboard"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: { name: "Alex Kumar", avatar: "", id: "alex-kumar" },
          timestamp: "2024-01-22T11:00:00Z",
        },
        {
          type: "accepted",
          user: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
          timestamp: "2024-01-23T09:00:00Z",
        },
        {
          type: "completed",
          user: { name: "Emma Rodriguez", avatar: "", id: "emma-rodriguez" },
          timestamp: "2024-01-28T16:30:00Z",
        },
      ],
    },
    {
      id: "6",
      title: "Integrate recommendation API",
      description: "Connect the frontend to the ML recommendation service",
      status: "todo",
      priority: "medium",
      dueDate: "Nov 25",
      labels: ["integration", "api"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: { name: "Dr. Smith", avatar: "", id: "dr-smith" },
          timestamp: "2024-01-25T15:00:00Z",
        },
      ],
    },
    {
      id: "7",
      title: "Write unit tests",
      description: "Add comprehensive test coverage for core functionality",
      status: "todo",
      priority: "low",
      dueDate: "Dec 1",
      labels: ["testing", "quality"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: { name: "John Doe", avatar: "", id: "john-doe" },
          timestamp: "2024-01-30T12:00:00Z",
        },
      ],
    },
  ]);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-status-todo" },
    { id: "in-progress", title: "In Progress", color: "bg-status-progress" },
    { id: "review", title: "Review", color: "bg-secondary" },
    { id: "done", title: "Done", color: "bg-status-done" },
  ];

  const addTaskAction = (taskId, action) => {
    const newAction = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, actions: [...task.actions, newAction] } : task
      )
    );
  };

  const handleAddTask = taskData => {
    const task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      status: "todo",
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      labels: ["new"],
      reviewCount: 0,
      actions: [
        {
          type: "created",
          user: currentUser,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setTasks([...tasks, task]);
    toast({
      title: "Task created",
      description: `"${task.title}" has been added to the board.`,
    });
  };

  const handleEditTask = task => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const handleUpdateTask = taskData => {
    if (editingTask) {
      setTasks(
        tasks.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
              }
            : task
        )
      );
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: `"${taskData.title}" has been updated.`,
      });
    }
  };

  const handleDeleteTask = taskId => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAcceptTask = taskId => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: "in-progress",
              assignee: currentUser,
            }
          : task
      )
    );
    addTaskAction(taskId, { type: "accepted", user: currentUser });
    toast({
      title: "Task accepted",
      description: "You have accepted this task and it's now in progress.",
    });
  };

  const handleMarkCompleted = taskId => {
    setTasks(
      tasks.map(task => (task.id === taskId ? { ...task, status: "review" } : task))
    );
    addTaskAction(taskId, { type: "completed", user: currentUser });
    toast({
      title: "Task completed",
      description: "Task marked as completed and sent for review.",
    });
  };

  const handleApproveTask = taskId => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: "done",
              completedBy: task.assignee,
              reviewCount: task.reviewCount + 1,
            }
          : task
      )
    );
    addTaskAction(taskId, { type: "approved", user: currentUser });
    toast({
      title: "Task approved",
      description: "Task has been approved and marked as done.",
    });
  };

  const handleRejectTask = (taskId, note) => {
    setTasks(
      tasks.map(task => (task.id === taskId ? { ...task, status: "in-progress" } : task))
    );
    addTaskAction(taskId, {
      type: "rejected",
      user: currentUser,
      note,
    });
    toast({
      title: "Task rejected",
      description: "Task has been sent back for revisions.",
      variant: "destructive",
    });
  };

  const handleSendBackTask = (taskId, note) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, status: "todo", assignee: undefined } : task
      )
    );
    addTaskAction(taskId, {
      type: "sent_back",
      user: currentUser,
      note,
    });
    toast({
      title: "Task sent back",
      description: "Task has been sent back to the to-do list.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Task Management</h3>
          <p className="text-muted-foreground">Organize and track project tasks</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
        </Dialog>

        <TaskDialog
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onSubmit={handleAddTask}
          title="Create New Task"
        />

        <TaskDialog
          isOpen={isEditTaskOpen}
          onClose={() => setIsEditTaskOpen(false)}
          onSubmit={handleUpdateTask}
          task={editingTask}
          title="Edit Task"
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTask}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(task => task.status === column.id)}
            currentUser={currentUser}
            onAddTask={() => setIsAddTaskOpen(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAcceptTask={handleAcceptTask}
            onMarkCompleted={handleMarkCompleted}
            onApproveTask={handleApproveTask}
            onRejectTask={handleRejectTask}
            onSendBackTask={handleSendBackTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskBoard;
