import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, TaskType } from "@/contexts/AppContext";
import { CalendarDays, ExternalLink, Coins } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  taskType?: TaskType;
  showActions?: boolean;
  onReview?: (taskId: string, status: "approved" | "rejected", reason?: string) => void;
}

export function TaskCard({ task, taskType, showActions = false, onReview }: TaskCardProps) {
  const handleApprove = () => {
    onReview?.(task.id, "approved");
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    onReview?.(task.id, "rejected", reason || undefined);
  };

  // ✅ Safe date formatting
  let submittedDate = "Date not available";
  if (task.submittedAt) {
    try {
      submittedDate = format(new Date(task.submittedAt), "MMM d, yyyy");
    } catch {
      submittedDate = "Invalid date";
    }
  }

  return (
    <Card className="gradient-card shadow-card hover:shadow-glow transition-all duration-300 border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{task.title || "Untitled Task"}</CardTitle>
            <CardDescription className="mt-1">{task.description || "No description provided"}</CardDescription>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {submittedDate}
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-points-glow" />
            <span className="points-glow font-semibold">{task.points ?? 0} pts</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ✅ Safe tags rendering */}
        <div className="flex flex-wrap gap-2">
          {taskType && (
            <Badge variant="secondary" className="bg-secondary/50">
              {taskType.name}
            </Badge>
          )}
          {(task.tags || []).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-primary hover:text-primary-foreground"
          >
            <a href={task.proofUrl || "#"} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View Proof
            </a>
          </Button>

          {showActions && task.status === "pending" && (
            <div className="flex gap-2">
              <Button variant="success" size="sm" onClick={handleApprove}>
                Approve
              </Button>
              <Button variant="destructive" size="sm" onClick={handleReject}>
                Reject
              </Button>
            </div>
          )}
        </div>

        {task.reviewReason && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>Review Note:</strong> {task.reviewReason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
