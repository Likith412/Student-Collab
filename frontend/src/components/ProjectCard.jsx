import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Calendar, Star, MapPin, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({
  title,
  description,
  techStack,
  creator,
  teamSize,
  deadline,
  category,
  difficulty,
  status = "recruiting",
}) => {
  const navigate = useNavigate();
  const difficultyColors = {
    Beginner: "bg-accent text-accent-foreground",
    Intermediate: "bg-status-progress text-white",
    Advanced: "bg-destructive text-destructive-foreground",
  };

  const statusColors = {
    recruiting: "bg-status-todo text-white",
    "in-progress": "bg-status-progress text-white",
    completed: "bg-status-done text-white",
  };

  return (
    <div className="bg-card rounded-xl shadow-card hover:shadow-elevated transition-smooth p-6 border border-border">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {title}
            </h3>
            <Badge className={statusColors[status]} variant="secondary">
              {status.replace("-", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{description}</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techStack.slice(0, 4).map((tech, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
        {techStack.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{techStack.length - 4}
          </Badge>
        )}
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{creator.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span className="text-xs text-muted-foreground">{creator.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {creator.college}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Team:</span>
          <span className="font-medium">
            {teamSize.current}/{teamSize.max}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Due:</span>
          <span className="font-medium">{deadline}</span>
        </div>
      </div>

      {/* Category and Difficulty */}
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
        <Badge className={`text-xs ${difficultyColors[difficulty]}`}>{difficulty}</Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {status === "recruiting" ? (
          <>
            <Button variant="hero" size="sm" className="flex-1">
              Join Project
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/project/1")}>
              Learn More
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate("/project/1")}
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
