import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        pending: "border-pending/20 bg-pending/10 text-pending",
        approved: "border-success/20 bg-success/10 text-success",
        rejected: "border-destructive/20 bg-destructive/10 text-destructive",
        default: "border-border bg-card text-card-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: 'pending' | 'approved' | 'rejected';
}

function StatusBadge({ className, variant, status, children, ...props }: StatusBadgeProps) {
  const badgeVariant = status || variant || 'default';
  
  return (
    <div className={cn(statusBadgeVariants({ variant: badgeVariant }), className)} {...props}>
      {children || (status && status.charAt(0).toUpperCase() + status.slice(1))}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };