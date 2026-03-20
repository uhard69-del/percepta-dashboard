import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground neon-text tracking-tight uppercase italic tracking-widest">{value}</h3>
      </div>
    </div>
  );
}
