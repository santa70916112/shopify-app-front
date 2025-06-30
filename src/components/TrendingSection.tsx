
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cryptoCategories } from "@/lib/mockData";

interface TrendingToken {
  id: number;
  name: string;
  symbol: string;
  category: string;
  change: number;
}

interface TrendingSectionProps {
  tokens: TrendingToken[];
}

export default function TrendingSection({ tokens }: TrendingSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredTokens = selectedCategory === "all" 
    ? tokens 
    : tokens.filter(token => 
        token.category.toLowerCase() === selectedCategory.toLowerCase()
      );
  
  return (
    <div className="rounded-lg border border-border bg-card p-5 gradient-border animate-scale-in" style={{ animationDelay: "200ms" }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          <h3 className="font-medium">Trending</h3>
        </div>
        
        <div className="flex gap-2">
          {cryptoCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "text-xs px-3 py-1 rounded-full transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 py-2 min-w-max">
          {filteredTokens.map(token => (
            <div 
              key={token.id}
              className="flex flex-col justify-between p-4 min-w-[150px] md:min-w-[180px] rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{token.name}</h4>
                  <div className="text-xs text-muted-foreground mt-0.5">{token.symbol}</div>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border">
                  {token.category}
                </div>
              </div>
              
              <div className={cn(
                "flex items-center text-sm",
                token.change >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {token.change >= 0 
                  ? <ArrowUpRight size={14} /> 
                  : <ArrowDownRight size={14} />
                }
                <span className="ml-0.5 font-medium">{Math.abs(token.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
