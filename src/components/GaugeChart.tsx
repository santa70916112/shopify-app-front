
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, LockIcon } from "lucide-react";

interface GaugeChartProps {
  value: number;
  dailyChange: number;
  weeklyChange: number;
}

export default function GaugeChart({ value, dailyChange, weeklyChange }: GaugeChartProps) {
  // Format value as billions with 2 decimal places
  const formattedValue = (value / 1000000000).toFixed(2);
  
  // Gauge chart data setup
  const data = [
    { name: "Value", value: 70 }, // Filled
    { name: "Empty", value: 30 }, // Empty
  ];
  
  // For visual appeal, add color gradient
  const COLORS = ["#4A9DFF", "#2DD4BF"]; // Gradient blue to teal
  const EMPTY_COLOR = "#374151"; // Dark gray for empty space
  
  return (
    <div className="relative rounded-lg border border-border bg-card p-5 gradient-border h-[320px] animate-scale-in" style={{ animationDelay: "100ms" }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <LockIcon size={14} />
            Total Value Locked
          </h3>
          <div className="text-2xl font-semibold mt-1.5">${formattedValue}B</div>
        </div>
      </div>

      <div className="flex h-[230px] items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="filled" fill="url(#gaugeGradient)" />
              <Cell key="empty" fill={EMPTY_COLOR} />
            </Pie>
            <defs>
              <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                {COLORS.map((color, index) => (
                  <stop
                    key={index}
                    offset={index / (COLORS.length - 1)}
                    stopColor={color}
                  />
                ))}
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
          <div className="text-xl font-medium mb-5 text-center">TVL Change</div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-[240px]">
            <div className="flex flex-col items-center bg-secondary p-3 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Daily</div>
              <div className="flex items-center gap-1">
                <ArrowUpRight size={16} className="text-green-500" />
                <span className="text-lg font-medium text-green-500">{dailyChange}%</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-secondary p-3 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Weekly</div>
              <div className="flex items-center gap-1">
                <ArrowUpRight size={16} className="text-green-500" />
                <span className="text-lg font-medium text-green-500">{weeklyChange}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
