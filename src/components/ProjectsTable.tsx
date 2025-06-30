
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpDown, ArrowUpRight, ListStart } from "lucide-react";

interface Project {
  id: number;
  name: string;
  symbol: string;
  brokerScore: number;
  price: number;
  priceChange: number;
  rank: number;
}

interface ProjectsTableProps {
  projects: Project[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aValue = a[sortBy as keyof Project];
    const bValue = b[sortBy as keyof Project];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 gradient-border animate-scale-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <ListStart size={16} className="text-primary" />
        <h3 className="font-medium">Recently Added Projects</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort("name")} 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Project
                  <ArrowUpDown size={14} className="text-muted-foreground/50" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort("rank")} 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Rank
                  <ArrowUpDown size={14} className="text-muted-foreground/50" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort("brokerScore")} 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Broker Score
                  <ArrowUpDown size={14} className="text-muted-foreground/50" />
                </button>
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort("price")} 
                  className="flex items-center gap-1 justify-end ml-auto hover:text-foreground transition-colors"
                >
                  Price
                  <ArrowUpDown size={14} className="text-muted-foreground/50" />
                </button>
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort("priceChange")} 
                  className="flex items-center gap-1 justify-end ml-auto hover:text-foreground transition-colors"
                >
                  24h Change
                  <ArrowUpDown size={14} className="text-muted-foreground/50" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      {project.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">#{project.rank}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "h-2 flex-1 max-w-28 rounded-full overflow-hidden bg-secondary",
                    )}>
                      <div 
                        className={cn(
                          "h-full",
                          project.brokerScore >= 8 ? "bg-green-500" : 
                          project.brokerScore >= 6 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${project.brokerScore * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{project.brokerScore.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-medium">${project.price.toFixed(2)}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={cn(
                    "inline-flex items-center",
                    project.priceChange >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {project.priceChange >= 0 
                      ? <ArrowUpRight size={14} /> 
                      : <ArrowDownRight size={14} />
                    }
                    <span className="ml-0.5 font-medium">{Math.abs(project.priceChange)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
