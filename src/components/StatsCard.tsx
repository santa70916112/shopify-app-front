
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon?: ReactNode;
  colorClass?: string;
  animationDelay?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  colorClass = "from-blue-500/20 to-blue-600/5",
  animationDelay = "0ms"
}: StatsCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg border border-border bg-card p-5 gradient-border animate-scale-in"
      style={{ animationDelay }}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-[0.08] pointer-events-none z-0" />
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-semibold">{value}</div>
          <div className={cn(
            "flex items-center text-sm font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{Math.abs(change)}%</span>
            <span className="text-muted-foreground ml-1">vs yesterday</span>
          </div>
        </div>
        
        {icon && (
          <div className="h-10 w-10 rounded-md bg-card flex items-center justify-center border border-border">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
