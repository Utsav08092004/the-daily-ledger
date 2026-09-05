import fs from 'fs';
import path from 'path';
import { DailyEdition, Subscriber, JargonTerm, DailyFinanceMasterclass } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const EDITIONS_FILE = path.join(DATA_DIR, 'editions.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const DICTIONARY_FILE = path.join(DATA_DIR, 'dictionary.json');
const MASTERCLASSES_FILE = path.join(DATA_DIR, 'finance-masterclasses.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getEditions(): DailyEdition[] {
  ensureDataDir();
  if (!fs.existsSync(EDITIONS_FILE)) return [];
  try {
    const raw = fs.readFileSync(EDITIONS_FILE, 'utf-8');
    return JSON.parse(raw) as DailyEdition[];
  } catch (error) {
    console.error('Error reading editions.json:', error);
    return [];
  }
}

export function getEditionById(id: string): DailyEdition | null {
  const editions = getEditions();
  return editions.find(e => e.id === id) || null;
}

export function getLatestEdition(): DailyEdition | null {
  const editions = getEditions();
  if (!editions.length) return null;
  const sorted = [...editions].sort((a, b) => b.id.localeCompare(a.id));
  return sorted[0];
}

export function saveEdition(edition: DailyEdition): void {
  ensureDataDir();
  const editions = getEditions();
  const existingIndex = editions.findIndex(e => e.id === edition.id);
  if (existingIndex >= 0) {
    editions[existingIndex] = edition;
  } else {
    editions.unshift(edition);
  }
  fs.writeFileSync(EDITIONS_FILE, JSON.stringify(editions, null, 2), 'utf-8');
}

export function getSubscribers(): Subscriber[] {
  ensureDataDir();
  if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(raw) as Subscriber[];
  } catch (error) {
    console.error('Error reading subscribers.json:', error);
    return [];
  }
}

export function addSubscriber(email: string, name?: string, topics: string[] = ['Daily Morning Brief']): { success: boolean; isNew: boolean; subscriber: Subscriber } {
  ensureDataDir();
  const subscribers = getSubscribers();
  const normalizedEmail = email.trim().toLowerCase();
  
  const existing = subscribers.find(s => s.email.toLowerCase() === normalizedEmail);
  if (existing) {
    existing.active = true;
    if (topics.length) existing.topics = Array.from(new Set([...existing.topics, ...topics]));
    if (name) existing.name = name;
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
    return { success: true, isNew: false, subscriber: existing };
  }

  const newSub: Subscriber = {
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    email: normalizedEmail,
    name: name || '',
    topics: topics.length ? topics : ['Daily Morning Brief', 'Personal Finance', 'Markets & Investing'],
    subscribedAt: new Date().toISOString(),
    active: true
  };

  subscribers.unshift(newSub);
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
  return { success: true, isNew: true, subscriber: newSub };
}

export function updateSubscriberDispatch(emails: string[]): void {
  ensureDataDir();
  const subscribers = getSubscribers();
  const emailSet = new Set(emails.map(e => e.toLowerCase()));
  const now = new Date().toISOString();

  subscribers.forEach(sub => {
    if (emailSet.has(sub.email.toLowerCase())) {
      sub.lastDispatchedAt = now;
    }
  });

  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

export function getDictionary(): JargonTerm[] {
  ensureDataDir();
  if (!fs.existsSync(DICTIONARY_FILE)) return [];
  try {
    const raw = fs.readFileSync(DICTIONARY_FILE, 'utf-8');
    return JSON.parse(raw) as JargonTerm[];
  } catch (error) {
    console.error('Error reading dictionary.json:', error);
    return [];
  }
}

export function getMasterclasses(): DailyFinanceMasterclass[] {
  ensureDataDir();
  if (!fs.existsSync(MASTERCLASSES_FILE)) return [];
  try {
    const raw = fs.readFileSync(MASTERCLASSES_FILE, 'utf-8');
    return JSON.parse(raw) as DailyFinanceMasterclass[];
  } catch (error) {
    console.error('Error reading finance-masterclasses.json:', error);
    return [];
  }
}

export function getDailyFinanceMasterclass(dateStr?: string): DailyFinanceMasterclass {
  const masterclasses = getMasterclasses();
  if (!masterclasses.length) {
    return {
      id: "masterclass-fallback",
      topic: "Yield Curve Inversion (The Bond Market's Crystal Ball)",
      level: "Advanced",
      category: "Debt Markets & Yields",
      theIntimidatingJargon: "A state in fixed-income debt markets where short-term government treasury yields exceed long-term sovereign bond yields.",
      plainEnglishBreakdown: "Normally, lending money for 10 years pays higher interest than lending for 3 months. When the opposite happens (short-term interest exceeds 10-year rates), it's called an Inverted Yield Curve, historically the most accurate warning of economic slowdown.",
      breakthroughAnalogy: "Like locking in a 1-year car rental contract at a cheaper daily rate than a 1-day rental because everyone expects the rental market to plunge next season.",
      howItWorksStepByStep: [
        "Central banks hike short-term rates to fight inflation.",
        "Investors anticipate economic cooling and buy safe 10-year sovereign bonds.",
        "Long-term bond yields drop below short-term rates.",
        "The inverted slope signals future rate cuts and economic adjustment."
      ],
      transmissionToIndianMarkets: "Shifts global capital allocations and alters foreign institutional investor (FII) equity flows into Dalal Street.",
      walletActionRule: "Do not stop disciplined SIPs; lock in multi-year fixed deposits and maintain diversified large-cap mutual fund holdings.",
      commonMistakeToAvoid: "Assuming stock markets crash immediately on day one of inversion.",
      quickQuiz: {
        question: "What does an inverted yield curve signify?",
        options: [
          "Short-term rates are higher than long-term rates, signaling economic deceleration",
          "Banks have run out of paper currency",
          "Inflation is at absolute zero worldwide",
          "Stock trading is suspended by the government"
        ],
        correctIndex: 0,
        explanation: "Correct! Short-term rates exceeding long-term rates indicates investor expectations of future central bank rate cuts and cooling economic activity."
      }
    };
  }

  // Calculate day-of-year or date hash to deterministically rotate topic every single calendar day
  const effectiveDate = dateStr ? new Date(dateStr) : new Date();
  const dayOfYear = Math.floor((effectiveDate.getTime() - new Date(effectiveDate.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = Math.abs(dayOfYear) % masterclasses.length;
  return masterclasses[index];
}
