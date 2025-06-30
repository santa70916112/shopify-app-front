
export const marketStats = {
  marketCap: 2475387615293,
  bitcoinPrice: 61284.23,
  totalValueLocked: 46892651287,
  tradingVolume: 87291865421,
  dailyChange: 2.3,
  weeklyChange: -4.8
};

export const tvlGaugeData = {
  current: 46892651287,
  dailyChange: 10.2,
  weeklyChange: 68.7
};

export const fearGreedIndex = {
  value: 72,
  indicator: "Greed",
  previousValue: 65,
  previousChange: 7
};

export const trendingTokens = [
  { id: 1, name: "Solana", symbol: "SOL", category: "Project", change: 12.4 },
  { id: 2, name: "Render", symbol: "RNDR", category: "Project", change: 8.7 },
  { id: 3, name: "Arbitrum", symbol: "ARB", category: "Platform", change: -3.2 },
  { id: 4, name: "Jupiter", symbol: "JUP", category: "Platform", change: 15.3 },
  { id: 5, name: "Aptos", symbol: "APT", category: "Project", change: 9.1 },
  { id: 6, name: "Mantle", symbol: "MNT", category: "Platform", change: 4.3 },
  { id: 7, name: "Base", symbol: "BASE", category: "Platform", change: 21.8 },
  { id: 8, name: "Celestia", symbol: "TIA", category: "Project", change: 11.9 },
];

export const recentlyAddedProjects = [
  { id: 1, name: "Ethena", symbol: "ENA", brokerScore: 7.8, price: 0.42, priceChange: 8.7, rank: 78 },
  { id: 2, name: "Dyson", symbol: "DYS", brokerScore: 6.9, price: 1.24, priceChange: -4.2, rank: 126 },
  { id: 3, name: "Wormhole", symbol: "W", brokerScore: 8.2, price: 0.89, priceChange: 12.3, rank: 65 },
  { id: 4, name: "Jupiter", symbol: "JUP", brokerScore: 8.7, price: 0.74, priceChange: 15.3, rank: 52 },
  { id: 5, name: "Eigenlayer", symbol: "EIGEN", brokerScore: 7.4, price: 2.18, priceChange: 3.5, rank: 89 },
  { id: 6, name: "Blast", symbol: "BLAST", brokerScore: 6.8, price: 0.32, priceChange: -2.8, rank: 142 },
  { id: 7, name: "Pyth", symbol: "PYTH", brokerScore: 8.5, price: 0.56, priceChange: 7.6, rank: 74 },
];

export const cryptoCategories = [
  { id: "all", name: "All" },
  { id: "project", name: "Projects" },
  { id: "platform", name: "Platforms" },
  { id: "fund", name: "Funds" },
];
