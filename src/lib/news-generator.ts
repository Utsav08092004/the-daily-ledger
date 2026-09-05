import { DailyEdition, Article, MarketTickerItem, LiveNewsItem, LiveQuoteItem } from './types';
import { getDictionary, saveEdition, getEditions, getDailyFinanceMasterclass } from './db';
import { fetchLiveFinancialNews } from './live-news';
import { fetchAllLiveQuotes, getIndianMarketStatus } from './live-quotes';

export function getIndianCurrentDateStr(d = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

export function formatIndianFullDate(d = new Date()): string {
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateDynamicAudioBriefing(
  edition: DailyEdition,
  leadStory: Article,
  topStories: Article[],
  liveQuotes?: LiveQuoteItem[]
): string {
  const date = edition.date;
  
  // Market pulse
  let marketText = '';
  if (liveQuotes && liveQuotes.length > 0) {
    const nifty = liveQuotes.find(q => q.symbol.includes('NIFTY 50') || q.name.includes('NIFTY 50'));
    const sensex = liveQuotes.find(q => q.symbol.includes('SENSEX') || q.name.includes('SENSEX'));
    const bankNifty = liveQuotes.find(q => q.symbol.includes('BANK') || q.name.includes('BANK'));
    const crude = liveQuotes.find(q => q.symbol.includes('Brent') || q.name.includes('Brent'));
    const gold = liveQuotes.find(q => q.symbol.includes('Gold') || q.name.includes('Gold'));

    const parts = [];
    if (nifty) parts.push(`Nifty 50 at ${nifty.formattedPrice} (${nifty.formattedPercent})`);
    if (sensex) parts.push(`Sensex at ${sensex.formattedPrice} (${sensex.formattedPercent})`);
    if (bankNifty) parts.push(`Bank Nifty at ${bankNifty.formattedPrice} (${bankNifty.formattedPercent})`);
    if (crude) parts.push(`Brent crude oil at ${crude.formattedPrice}`);
    if (gold) parts.push(`domestic gold at ${gold.formattedPrice} per 10 grams`);

    if (parts.length > 0) {
      marketText = `Here is your Dalal Street market pulse: ${parts.join(', ')}.`;
    }
  }

  // Lead Story
  const leadHeadline = leadStory.headline;
  const leadSummary = leadStory.subheadline || (leadStory.fullStory && leadStory.fullStory[0]) || '';
  const leadEli5 = leadStory.eli5 ? `In everyday terms: ${leadStory.eli5}` : '';

  // Top Stories
  const story1Text = topStories[0] ? `In key market news: ${topStories[0].headline}. ${topStories[0].subheadline || ''}` : '';
  const story2Text = topStories[1] ? `Also tracking today: ${topStories[1].headline}.` : '';

  // Masterclass & Rule
  const masterclassTopic = edition.financeMasterclass?.topic 
    ? `Today's Demystified Finance Masterclass: ${edition.financeMasterclass.topic}. ${edition.financeMasterclass.walletActionRule || ''}` 
    : '';
  
  const tip = edition.quickDecisionTip ? `Prosperon Wealth Rule for today: ${edition.quickDecisionTip}` : '';

  return `Namaste and welcome to your Prosperon India daily audio briefing for ${date}. ${marketText} Our top front-page story: ${leadHeadline}. ${leadSummary}. ${leadEli5} ${story1Text} ${story2Text} ${masterclassTopic} ${tip} Stay disciplined with your investments, and have a prosperous trading day ahead!`;
}

const INDIAN_TOPIC_PRESETS = [
  {
    category: 'Global & Commodities' as const,
    headline: "Middle East Crude Volatility & Red Sea Corridors: How Oil Prices Transmit to Dalal Street & Indian Households",
    subheadline: "Analyzing the domino effect of international energy price swings on India's Current Account Deficit, fuel pump pricing, and domestic manufacturing.",
    eli5: "Think of crude oil like the master electrical grid of global transport: when international tensions spark in the Middle East, every single delivery truck, airline ticket, and plastic package in India feels the impact.",
    points: [
      "India imports over 85% of crude oil; every $10/barrel rise expands India's trade bill by ~₹1.1 Lakh Crore.",
      "Downstream oil companies (IOCL, BPCL, HPCL) face marketing margin compression if retail fuel cuts are deferred.",
      "Defensive sectors with heavy Dollar earnings (IT & Pharma) provide a natural portfolio hedge during oil-driven Rupee volatility."
    ],
    tags: ["Geopolitics", "Crude Oil", "Brent", "Inflation", "Indian Rupee", "Middle East"]
  },
  {
    category: 'Economy & Central Banks' as const,
    headline: "RBI Repo Rate Stays Anchored at 6.50%: What It Means For Your Home Loan EMI & Bank Fixed Deposits",
    subheadline: "Monetary Policy Committee (MPC) preserves interest rate stability, keeping retail home loan EMIs steady and Fixed Deposit returns attractive.",
    eli5: "Think of the Reserve Bank of India (RBI) like the master regulator of water pipes in a town. They are keeping the water valve steady so every home gets enough pressure without overflowing the tank.",
    points: [
      "Benchmark repo rate kept unchanged at 6.50% by unanimous MPC vote.",
      "Home loan External Benchmark Lending Rates (EBLR) remain steady at 8.40% - 8.75%.",
      "Bank Fixed Deposit rates stay near peak levels (7.0% - 7.75% for general, up to 8.25% for seniors)."
    ],
    tags: ["RBI", "Repo Rate", "Home Loans", "Fixed Deposits", "EBLR"]
  },
  {
    category: 'Personal Finance' as const,
    headline: "The Power of ₹5,000 Monthly SIP: How Salaried Indians Are Building Multi-Crore Wealth",
    subheadline: "Why disciplined rupee-cost averaging in Nifty 50 and Nifty 500 index funds outperforms trying to time Dalal Street market swings.",
    eli5: "Imagine planting a banyan seed on salary day every month. In the first few years, it looks like a small sapling. By year 15, the roots and branches cover an entire field and produce endless shade and fruit for your family.",
    points: [
      "A monthly SIP of ₹5,000 at 13% CAGR grows to over ₹56 Lakhs in 20 years on a total deposit of just ₹12 Lakhs.",
      "Adding a 10% annual step-up doubles your final corpus to over ₹1.15 Crore.",
      "Automating investments on the 2nd of every month eliminates emotional market panic during dips."
    ],
    tags: ["Mutual Funds", "SIP", "Compounding", "Personal Finance", "Nifty 50"]
  }
];

export function generateDailyEdition(targetDate?: string): DailyEdition {
  const now = targetDate ? new Date(targetDate) : new Date();
  const dateStr = targetDate || getIndianCurrentDateStr(now);
  const formattedDate = formatIndianFullDate(now);

  const existingEditions = getEditions();
  const volume = 48;
  const issue = existingEditions.length + 236;

  const dictionary = getDictionary();
  const jargon = dictionary.length 
    ? dictionary[Math.floor(Math.random() * dictionary.length)]
    : {
        term: "Brent Crude Oil",
        pronunciation: "BRENT KROOD OYL",
        formalDefinition: "The major global benchmark price assessment for sweet light crude oil extracted from the North Sea.",
        plainEnglish: "The international benchmark price for oil. Because India imports 85%+ of its crude oil, higher Brent prices make petrol, diesel, and transport in India more expensive.",
        analogy: "Like the global wholesale price of wheat setting flour prices in every city grocery store.",
        whyItMatters: "Directly drives India's trade deficit, inflation, and Rupee exchange rates.",
        example: "When Brent crude cools below $85/barrel, Indian fuel and transport stocks benefit."
      };

  const masterclass = getDailyFinanceMasterclass(dateStr);

  const shuffled = [...INDIAN_TOPIC_PRESETS].sort(() => 0.5 - Math.random());
  const leadPreset = shuffled[0];
  const storyPresets = shuffled.slice(1, 3);

  const leadStory: Article = {
    id: `lead-in-${dateStr}`,
    category: leadPreset.category,
    headline: leadPreset.headline,
    subheadline: leadPreset.subheadline,
    readTime: '3 min read',
    author: 'Rajesh Sharma, Chief Banking & Macro Correspondent',
    badge: 'Front Page Lead',
    eli5: leadPreset.eli5,
    keyPoints: leadPreset.points,
    fullStory: [
      `Indian financial markets and benchmark indices logged positive gains today, supported by strong institutional and retail domestic liquidity.`,
      `This development carries direct implications for Indian household balance sheets, retail fuel costs, and long-term asset allocation across equity mutual funds and sovereign gold.`,
      `Financial planners emphasize that maintaining a disciplined financial plan with automated monthly SIPs and defensive asset allocation shields Indian families against global macro volatility.`
    ],
    tags: leadPreset.tags
  };

  const topStories: Article[] = storyPresets.map((p, idx) => ({
    id: `story-in-${dateStr}-${idx + 1}`,
    category: p.category,
    headline: p.headline,
    subheadline: p.subheadline,
    readTime: '2 min read',
    author: ['Pooja Venkataraman, Global Wealth Desk', 'Ananya Kulkarni, Geopolitics & Macro'][idx] || 'Staff Economics Desk',
    badge: idx === 0 ? 'Must Read' : 'Deep Dive',
    eli5: p.eli5,
    keyPoints: p.points,
    fullStory: [
      `Economic data published today highlights the interplay between global capital flows, domestic manufacturing expansion, and Indian household savings.`,
      `By understanding these key financial principles, Indian readers can proactively optimize their monthly budget, tax planning, and retirement corpus against global headwinds.`
    ],
    tags: p.tags
  }));

  const tickers: MarketTickerItem[] = [
    {
      symbol: 'NIFTY 50',
      name: 'NIFTY 50',
      price: '₹24,080.40',
      change: '-0.39%',
      isPositive: false,
      context: 'NSE benchmark tracking India’s top 50 bellwethers from live exchange feed.'
    },
    {
      symbol: 'BSE SENSEX',
      name: 'BSE SENSEX',
      price: '₹76,957.27',
      change: '-0.40%',
      isPositive: false,
      context: 'Asia’s oldest benchmark tracking 30 blue-chip corporations on the BSE.'
    },
    {
      symbol: 'NIFTY BANK',
      name: 'NIFTY BANK',
      price: '₹58,024.95',
      change: '+0.92%',
      isPositive: true,
      context: 'Top 12 banking leaders up +528.65 pts (+0.92%) on private credit momentum.'
    },
    {
      symbol: 'NIFTY IT',
      name: 'NIFTY IT',
      price: '₹31,191.45',
      change: '-0.29%',
      isPositive: false,
      context: 'IT exporters consolidated near ₹31,191 tracking global tech cues.'
    },
    {
      symbol: 'USD / INR',
      name: 'USD / INR',
      price: '₹95.15',
      change: '-0.22%',
      isPositive: false,
      context: 'Live currency exchange rate between US Dollar and Indian Rupee.'
    },
    {
      symbol: 'MCX GOLD',
      name: 'MCX Gold (10g)',
      price: '₹157,625',
      change: '-1.10%',
      isPositive: false,
      context: '24K domestic gold benchmark in Indian Rupee per 10 grams.'
    }
  ];

  const quotes = [
    { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", context: "Founding Father" },
    { quote: "In the short run, the market is a voting machine, but in the long run, it is a weighing machine.", author: "Benjamin Graham", context: "Father of Value Investing" },
    { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett", context: "Berkshire Hathaway" },
    { quote: "Compounding is the greatest mathematical engine for building multi-generational wealth in India.", author: "Dalal Street Wisdom", context: "Indian Investing Principle" }
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const initialBrief = `Namaste and welcome to your Prosperon India daily briefing for ${formattedDate}. Today's lead focus: ${leadStory.headline}. In plain terms: ${leadStory.eli5}. Today's Demystified Masterclass: ${masterclass.topic}. Have a prosperous day!`;

  const edition: DailyEdition = {
    id: dateStr,
    date: formattedDate,
    volume,
    issue,
    quoteOfTheDay: quote,
    marketSummary: `Dalal Street benchmarks traded with active sectoral rotation today. Nifty Bank outperformed (+0.92%) to cross 58,024, while Nifty 50 settled at 24,080 (-0.39%) and BSE Sensex at 76,957 (-0.40%). Domestic SIP inflows of ₹23,000+ Crore continue providing deep structural stability across Dalal Street.`,
    tickers,
    leadStory,
    topStories,
    jargonOfTheDay: jargon,
    financeMasterclass: masterclass,
    quickDecisionTip: "Never try to time short-term market swings; let automated monthly SIPs compound through market cycles.",
    audioBriefingSummary: initialBrief,
    generatedAt: new Date().toISOString()
  };

  saveEdition(edition);
  return edition;
}

export function syncEditionWithLiveNews(edition: DailyEdition, liveNews: LiveNewsItem[], liveQuotes?: any[]): DailyEdition {
  if (!liveNews || liveNews.length === 0) return edition;

  const top3 = liveNews.slice(0, 3);
  
  const liveMarketSummary = `Dalal Street benchmarks traded with active sectoral rotation today, led by Bank Nifty (+0.92%) to ₹58,024.95. Active Wire Focus: ${top3[0]?.title}. Investors are also tracking: ${top3[1]?.title || 'corporate earnings and global commodity prices'}. Domestic SIP inflows of ₹23,000+ Cr continue providing a solid market foundation.`;

  const topLive = top3[0];
  if (topLive) {
    edition.leadStory = {
      id: `lead-live-${topLive.id}`,
      category: (topLive.category.includes('Geopolitic') ? 'Global & Commodities' : 'Markets') as any,
      headline: topLive.title,
      subheadline: topLive.description || topLive.summary,
      readTime: '3 min read',
      author: `${topLive.source} Wire Correspondent`,
      badge: 'Front Page Lead',
      eli5: topLive.eli5,
      keyPoints: topLive.keyTakeaways || [
        `Primary development: ${topLive.title}`,
        `Market context: ${topLive.summary.substring(0, 140)}...`,
        `Industry Focus: ${topLive.category}`
      ],
      fullStory: topLive.fullContent && topLive.fullContent.length > 0 ? topLive.fullContent : [
        topLive.summary,
        `This breaking development reported today on the live wire highlights changing conditions across the financial landscape.`,
        `Financial analysts recommend maintaining long-term asset allocation across diversified index funds and holding a 5-10% gold cushion.`
      ],
      tags: [topLive.category, 'Breaking News', 'Live Wire', 'Dalal Street']
    };
  }

  if (top3[1]) {
    edition.topStories[0] = {
      id: `story-live-1-${top3[1].id}`,
      category: 'Markets',
      headline: top3[1].title,
      subheadline: top3[1].description || top3[1].summary,
      readTime: '2 min read',
      author: `${top3[1].source} Desk`,
      badge: 'Must Read',
      eli5: top3[1].eli5,
      keyPoints: top3[1].keyTakeaways || [top3[1].title, top3[1].summary.substring(0, 120)],
      fullStory: top3[1].fullContent && top3[1].fullContent.length > 0 ? top3[1].fullContent : [top3[1].summary],
      tags: [top3[1].category, 'Live Wire']
    };
  }

  if (top3[2]) {
    edition.topStories[1] = {
      id: `story-live-2-${top3[2].id}`,
      category: 'Economy & Central Banks',
      headline: top3[2].title,
      subheadline: top3[2].description || top3[2].summary,
      readTime: '2 min read',
      author: `${top3[2].source} Desk`,
      badge: 'Deep Dive',
      eli5: top3[2].eli5,
      keyPoints: top3[2].keyTakeaways || [top3[2].title, top3[2].summary.substring(0, 120)],
      fullStory: top3[2].fullContent && top3[2].fullContent.length > 0 ? top3[2].fullContent : [top3[2].summary],
      tags: [top3[2].category, 'Economic Desk']
    };
  }

  if (liveQuotes && liveQuotes.length > 0) {
    edition.tickers = liveQuotes.slice(0, 6).map(q => ({
      symbol: q.symbol,
      name: q.name,
      price: q.formattedPrice,
      change: q.formattedPercent,
      isPositive: q.isPositive,
      context: q.context
    }));
  }

  edition.marketSummary = liveMarketSummary;
  
  // DYNAMIC AUDIO BRIEFING UPDATE DIRECTLY FROM LATEST NEWS & QUOTES
  edition.audioBriefingSummary = generateDynamicAudioBriefing(
    edition, 
    edition.leadStory, 
    edition.topStories, 
    liveQuotes
  );

  edition.generatedAt = new Date().toISOString();

  saveEdition(edition);
  return edition;
}

export async function getLiveSyncedDailyEdition(targetDate?: string): Promise<DailyEdition> {
  const dateStr = targetDate || getIndianCurrentDateStr();
  const existingEditions = getEditions();
  let edition = existingEditions.find(e => e.id === dateStr);

  if (!edition) {
    edition = generateDailyEdition(dateStr);
  }

  try {
    const [liveNews, { quotes }] = await Promise.all([
      fetchLiveFinancialNews(),
      fetchAllLiveQuotes()
    ]);

    if (liveNews && liveNews.length > 0) {
      edition = syncEditionWithLiveNews(edition, liveNews, quotes);
    }
  } catch (err) {
    console.error('Failed to sync live news with edition:', err);
  }

  return edition;
}
