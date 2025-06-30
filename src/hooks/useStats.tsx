
import { useState, useEffect } from "react";
import { 
  marketStats, 
  tvlGaugeData, 
  fearGreedIndex, 
  trendingTokens, 
  recentlyAddedProjects 
} from "@/lib/mockData";

// In a real application, we'd fetch from APIs:
// - Market Data: CoinGecko /api/v3/global
// - Bitcoin Price: CoinGecko /api/v3/simple/price?ids=bitcoin
// - Trending Coins: CoinGecko /api/v3/search/trending
// - Recently Added: CoinGecko /api/v3/coins/markets?order=market_cap_desc
// - Fear & Greed Index: Alternative.me https://api.alternative.me/fng/

export function useStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(marketStats);
  const [tvlData, setTvlData] = useState(tvlGaugeData);
  const [fearGreed, setFearGreed] = useState(fearGreedIndex);
  const [trending, setTrending] = useState(trendingTokens);
  const [recentProjects, setRecentProjects] = useState(recentlyAddedProjects);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      // In a real app, we would fetch data from APIs here
      setStats(marketStats);
      setTvlData(tvlGaugeData);
      setFearGreed(fearGreedIndex);
      setTrending(trendingTokens);
      setRecentProjects(recentlyAddedProjects);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to refresh data (placeholder for real implementation)
  const refreshData = () => {
    setLoading(true);
    // In a real app, we would refetch data from APIs here
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    loading,
    error,
    stats,
    tvlData,
    fearGreed,
    trending,
    recentProjects,
    refreshData
  };
}
