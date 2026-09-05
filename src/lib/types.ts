export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  context: string;
}

export interface LiveQuoteItem {
  symbol: string;
  name: string;
  category: 'Index' | 'Commodity' | 'Crypto' | 'Forex' | 'Bond';
  price: number;
  formattedPrice: string;
  change: number;
  formattedChange: string;
  changePercent: number;
  formattedPercent: string;
  isPositive: boolean;
  high?: number;
  low?: number;
  previousClose?: number;
  context: string;
  lastUpdated: string;
}

export interface CompanyEarningsReport {
  id: string;
  symbol: string;
  companyName: string;
  sector: 'Technology & AI' | 'Banking & Finance' | 'Consumer & Retail' | 'Auto & EV' | 'Energy & Conglomerate';
  quarter: string;
  reportDate: string;
  revenue: {
    reported: string;
    expected: string;
    growthYoY: string;
    status: 'Beat' | 'Missed' | 'In-Line';
  };
  netProfitOrEps: {
    reported: string;
    expected: string;
    status: 'Beat' | 'Missed' | 'In-Line';
  };
  stockReaction: {
    changePercent: string;
    isPositive: boolean;
    currentPrice: string;
  };
  plainEnglishVerdict: string;
  eli5Analogy: string;
  walletAndPortfolioImpact: {
    forShareholders: string;
    forMutualFundHolders: string;
    forConsumers: string;
    actionTip: string;
  };
  keyHighlights: string[];
}

export interface LiveNewsItem {
  id: string;
  title: string;
  source: string;
  link: string;
  pubDate: string;
  category: string;
  description: string;
  summary: string;
  eli5: string;
  fullContent: string[];
  keyTakeaways: string[];
  hasWalletImpact: boolean;
  walletImpact?: string;
  actionTip?: string;
  industryImpact?: string;
  isLive: boolean;
}

export interface WalletImpact {
  summary: string;
  borrowers: string;
  investors: string;
  savers: string;
  consumers: string;
  actionTip: string;
}

export interface Article {
  id: string;
  category: 'Markets' | 'Economy & Central Banks' | 'Personal Finance' | 'Real Estate & Mortgages' | 'Tech & Startups' | 'Global & Commodities';
  headline: string;
  subheadline: string;
  readTime: string;
  author: string;
  eli5: string;
  keyPoints: string[];
  fullStory: string[];
  hasWalletImpact?: boolean;
  walletImpact?: WalletImpact;
  imageUrl?: string;
  tags: string[];
  badge?: 'Front Page Lead' | 'Wallet Alert' | 'Deep Dive' | 'Must Read';
}

export interface JargonTerm {
  term: string;
  pronunciation?: string;
  formalDefinition: string;
  plainEnglish: string;
  analogy: string;
  whyItMatters: string;
  example: string;
}

export interface DailyFinanceMasterclass {
  id: string;
  topic: string;
  level: 'Advanced' | 'Intermediate' | 'Core Macro';
  category: string;
  theIntimidatingJargon: string;
  plainEnglishBreakdown: string;
  breakthroughAnalogy: string;
  howItWorksStepByStep: string[];
  transmissionToIndianMarkets: string;
  walletActionRule: string;
  commonMistakeToAvoid: string;
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface DailyEdition {
  id: string;
  date: string;
  volume: number;
  issue: number;
  quoteOfTheDay: {
    quote: string;
    author: string;
    context: string;
  };
  marketSummary: string;
  tickers: MarketTickerItem[];
  leadStory: Article;
  topStories: Article[];
  jargonOfTheDay: JargonTerm;
  financeMasterclass?: DailyFinanceMasterclass;
  quickDecisionTip: string;
  audioBriefingSummary: string;
  generatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  topics: string[];
  subscribedAt: string;
  active: boolean;
  lastDispatchedAt?: string;
}
