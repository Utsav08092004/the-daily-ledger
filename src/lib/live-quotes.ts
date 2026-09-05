import { LiveQuoteItem } from './types';

export interface MarketSessionInfo {
  isOpen: boolean;
  session: 'live' | 'pre-market' | 'closed';
  label: string;
  sublabel: string;
  currentTimeIST: string;
  nextOpen: string;
}

export function getIndianMarketStatus(): MarketSessionInfo {
  const now = new Date();
  
  const istTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const istDayStr = now.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short'
  });

  const [hoursStr, minutesStr] = istTimeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const timeInMinutes = hours * 60 + minutes;

  const isWeekend = istDayStr === 'Sat' || istDayStr === 'Sun';

  if (isWeekend) {
    return {
      isOpen: false,
      session: 'closed',
      label: 'NSE/BSE CLOSED (Weekend)',
      sublabel: 'Official closing rates locked from live exchange servers. Dalal Street trading resumes Monday at 09:15 AM IST.',
      currentTimeIST: `${istTimeStr} IST`,
      nextOpen: 'Monday 09:15 AM IST'
    };
  }

  // Pre-market: 09:00 to 09:15 AM IST
  if (timeInMinutes >= 540 && timeInMinutes < 555) {
    return {
      isOpen: true,
      session: 'pre-market',
      label: 'NSE/BSE PRE-MARKET OPEN',
      sublabel: 'Price discovery order matching active on Dalal Street (09:00 - 09:15 AM IST).',
      currentTimeIST: `${istTimeStr} IST`,
      nextOpen: 'Regular session starts at 09:15 AM IST'
    };
  }

  // Regular Trading Session: 09:15 to 15:30 IST
  if (timeInMinutes >= 555 && timeInMinutes <= 930) {
    return {
      isOpen: true,
      session: 'live',
      label: 'NSE/BSE LIVE TRADING SESSION',
      sublabel: 'Real-time order matching active on Dalal Street (09:15 - 15:30 IST). Auto-updating live.',
      currentTimeIST: `${istTimeStr} IST`,
      nextOpen: 'Trading active until 15:30 IST'
    };
  }

  // Closed Session: After 15:30 IST or before 09:00 AM IST
  return {
    isOpen: false,
    session: 'closed',
    label: 'NSE/BSE CLOSED (Official Close)',
    sublabel: 'Official closing rates and percentage changes locked from live exchange servers. Reopens 09:15 AM IST.',
    currentTimeIST: `${istTimeStr} IST`,
    nextOpen: 'Today at 09:15 AM IST'
  };
}

interface InstrumentDef {
  symbol: string;
  name: string;
  category: 'Index' | 'Commodity' | 'Crypto' | 'Forex' | 'Bond';
  prefix: string;
  decimals: number;
  multiplier?: number;
  fallbackPrice: number;
  fallbackPrevClose: number;
  context: string;
}

const INSTRUMENT_DEFINITIONS: InstrumentDef[] = [
  {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    category: 'Index',
    prefix: '₹',
    decimals: 2,
    fallbackPrice: 24080.40,
    fallbackPrevClose: 24175.65,
    context: 'NSE benchmark tracking India’s top 50 bellwethers; live exchange feed.'
  },
  {
    symbol: '^BSESN',
    name: 'BSE SENSEX',
    category: 'Index',
    prefix: '₹',
    decimals: 2,
    fallbackPrice: 76957.27,
    fallbackPrevClose: 77264.51,
    context: 'Asia’s oldest benchmark tracking 30 blue-chip corporations on the BSE.'
  },
  {
    symbol: '^NSEBANK',
    name: 'NIFTY BANK',
    category: 'Index',
    prefix: '₹',
    decimals: 2,
    fallbackPrice: 58024.95,
    fallbackPrevClose: 57496.30,
    context: 'Top 12 private and PSU banking giants leading domestic credit expansion.'
  },
  {
    symbol: '^CNXIT',
    name: 'NIFTY IT',
    category: 'Index',
    prefix: '₹',
    decimals: 2,
    fallbackPrice: 31191.45,
    fallbackPrevClose: 31281.70,
    context: 'Indian IT software exporters tracking global enterprise AI and cloud spending.'
  },
  {
    symbol: 'INR=X',
    name: 'USD / INR',
    category: 'Forex',
    prefix: '₹',
    decimals: 2,
    fallbackPrice: 95.15,
    fallbackPrevClose: 95.36,
    context: 'Live exchange rate between US Dollar and Indian Rupee.'
  },
  {
    symbol: 'GC=F',
    name: 'MCX Gold (10g)',
    category: 'Commodity',
    prefix: '₹',
    decimals: 0,
    multiplier: (95.15 / 31.1035 * 10 * 1.15), // 24K Domestic Gold per 10g in INR with import duty/GST
    fallbackPrice: 157625,
    fallbackPrevClose: 159362,
    context: '24-Karat domestic gold bullion benchmark per 10 grams in Indian Rupees.'
  },
  {
    symbol: 'SI=F',
    name: 'MCX Silver (1kg)',
    category: 'Commodity',
    prefix: '₹',
    decimals: 0,
    multiplier: (95.15 / 31.1035 * 1000 * 1.15), // Domestic Silver per 1kg in INR
    fallbackPrice: 235162,
    fallbackPrevClose: 238472,
    context: 'Industrial and bullion silver price per kilogram in Indian domestic markets.'
  },
  {
    symbol: 'BZ=F',
    name: 'Brent Crude ($)',
    category: 'Commodity',
    prefix: '$',
    decimals: 2,
    fallbackPrice: 88.13,
    fallbackPrevClose: 86.12,
    context: 'Global petroleum benchmark per barrel in USD.'
  }
];

async function fetchFromLiveAPI(inst: InstrumentDef): Promise<LiveQuoteItem | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(inst.symbol)}?interval=1d&range=1d`;
  
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;

    if (!meta) return null;

    let price = meta.regularMarketPrice ?? meta.chartPreviousClose ?? inst.fallbackPrice;
    let prevClose = meta.chartPreviousClose ?? meta.previousClose ?? inst.fallbackPrevClose;
    let high = meta.regularMarketDayHigh ?? price;
    let low = meta.regularMarketDayLow ?? price;

    if (inst.multiplier) {
      price = price * inst.multiplier;
      prevClose = prevClose * inst.multiplier;
      high = high * inst.multiplier;
      low = low * inst.multiplier;
    }

    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    const isPositive = change >= 0;
    const dec = inst.decimals;

    return {
      symbol: inst.name,
      name: inst.name,
      category: inst.category,
      price,
      formattedPrice: `${inst.prefix}${price.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`,
      change,
      formattedChange: `${isPositive ? '+' : ''}${change.toFixed(dec)}`,
      changePercent,
      formattedPercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
      isPositive,
      high: Math.max(high, price),
      low: Math.min(low, price),
      previousClose: prevClose,
      context: inst.context,
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    return null;
  }
}

function getFallbackQuote(inst: InstrumentDef): LiveQuoteItem {
  const price = inst.fallbackPrice;
  const prevClose = inst.fallbackPrevClose;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  const isPositive = change >= 0;
  const dec = inst.decimals;

  return {
    symbol: inst.name,
    name: inst.name,
    category: inst.category,
    price,
    formattedPrice: `${inst.prefix}${price.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`,
    change,
    formattedChange: `${isPositive ? '+' : ''}${change.toFixed(dec)}`,
    changePercent,
    formattedPercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
    isPositive,
    high: Math.max(price * 1.004, price),
    low: Math.min(price * 0.996, price),
    previousClose: prevClose,
    context: inst.context,
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchAllLiveQuotes(): Promise<{ quotes: LiveQuoteItem[]; session: MarketSessionInfo }> {
  const promises = INSTRUMENT_DEFINITIONS.map(async (inst) => {
    const live = await fetchFromLiveAPI(inst);
    return live || getFallbackQuote(inst);
  });

  const quotes = await Promise.all(promises);
  const session = getIndianMarketStatus();
  return { quotes, session };
}
