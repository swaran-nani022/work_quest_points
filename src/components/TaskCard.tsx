import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

interface TaskType {
  _id: string;
  name: string;
  points: number;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  proofUrl: string;
  status: "pending" | "approved" | "rejected";
  reviewReason?: string;
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  taskType?: TaskType;
  showActions?: boolean;
  onReview?: (id: string, status: "approved" | "rejected", reason?: string) => void;
}

export function TaskCard({ task, taskType, showActions = false, onReview }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
        {taskType && (
          <div className="mt-2">
            <Badge variant="outline">
              {taskType.name} ({taskType.points} points)
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {task.proofUrl && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Proof:</span>
              <a 
                href={task.proofUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
              >
                View proof <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
          
          {task.createdAt && (
            <div className="text-sm text-muted-foreground">
              Submitted: {formatDate(task.createdAt)}
            </div>
          )}
          
          {task.reviewReason && task.status === "rejected" && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-800 rounded-md">
              <p className="text-sm text-red-300 font-medium">Review Reason:</p>
              <p className="text-sm text-red-200">{task.reviewReason}</p>
            </div>
          )}
          
          {task.status === "approved" && taskType && (
            <div className="mt-2 p-3 bg-green-900/20 border border-green-800 rounded-md">
              <p className="text-sm text-green-300">
                ✅ Earned {taskType.points} points
              </p>
            </div>
          )}

          {showActions && onReview && task.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                onClick={() => onReview(task.id, "approved")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => {
                  const reason = prompt("Reason for rejection:");
                  if (reason) onReview(task.id, "rejected", reason);
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}