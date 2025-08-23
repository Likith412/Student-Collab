import { Card } from "./ui/card";
import { FolderOpen, Users, Trophy, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Active Projects",
      value: "3",
      change: "+2 this month",
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Team Members",
      value: "12",
      change: "+4 this week",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Completed Tasks",
      value: "24",
      change: "+8 this week",
      icon: CheckCircle2,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.2 this month",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-smooth"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-accent" />
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
