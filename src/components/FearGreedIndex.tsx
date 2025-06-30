
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";

interface FearGreedIndexProps {
  value: number;
  indicator: string;
  previousValue: number;
  previousChange: number;
}

export default function FearGreedIndex({ 
  value, 
  indicator, 
  previousValue, 
  previousChange 
}: FearGreedIndexProps) {
  // Data for the pie chart
  const data = [
    { name: "Value", value: value },
    { name: "Empty", value: 100 - value }
  ];

  // Color mapping based on the value
  const getColor = (value: number) => {
    if (value >= 75) return "#4ADE80"; // Extreme Greed
    if (value >= 55) return "#A3E635"; // Greed
    if (value >= 45) return "#FACC15"; // Neutral
    if (value >= 25) return "#FB923C"; // Fear
    return "#F87171"; // Extreme Fear
  };
  
  const indicatorColor = getColor(value);
  const isPositiveChange = previousChange >= 0;
  
  return (
    <div className="rounded-lg border border-border bg-card p-5 gradient-border h-[320px] animate-scale-in" style={{ animationDelay: "400ms" }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-primary" />
          <h3 className="font-medium">Fear & Greed Index</h3>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={indicatorColor} />
              <Cell fill="#374151" /> {/* Empty space */}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">{value}</div>
          <div 
            className="text-xl font-medium mt-1" 
            style={{ color: indicatorColor }}
          >
            {indicator}
          </div>
          
          <div className="flex items-center mt-4 text-sm">
            <span className="text-muted-foreground mr-2">Yesterday: {previousValue}</span>
            <div className={cn(
              "flex items-center",
              isPositiveChange ? "text-green-500" : "text-red-500"
            )}>
              {isPositiveChange 
                ? <ArrowUpRight size={14} /> 
                : <ArrowDownRight size={14} />
              }
              <span>{Math.abs(previousChange)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
