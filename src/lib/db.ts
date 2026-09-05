import fs from 'fs';
import path from 'path';
import { DailyEdition, Subscriber, JargonTerm, DailyFinanceMasterclass } from './types';

// Direct compile-time bundle imports ensure zero ENOENT/EROFS file path issues on Vercel Serverless
import initialEditions from '../../data/editions.json';
import initialSubscribers from '../../data/subscribers.json';
import initialDictionary from '../../data/dictionary.json';
import initialMasterclasses from '../../data/finance-masterclasses.json';

const DATA_DIR = path.join(process.cwd(), 'data');
const EDITIONS_FILE = path.join(DATA_DIR, 'editions.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// In-memory runtime state that persists across serverless function invocations in the execution context
let inMemoryEditions: DailyEdition[] = [...(initialEditions as unknown as DailyEdition[])];
let inMemorySubscribers: Subscriber[] = [...(initialSubscribers as unknown as Subscriber[])];
const inMemoryDictionary: JargonTerm[] = [...(initialDictionary as unknown as JargonTerm[])];
const inMemoryMasterclasses: DailyFinanceMasterclass[] = [...(initialMasterclasses as unknown as DailyFinanceMasterclass[])];

function safeDiskWrite(filePath: string, data: string): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, data, 'utf-8');
  } catch (err) {
    // Read-only filesystem in cloud serverless environment (e.g. Vercel).
    // Safely ignored as in-memory state is preserved.
  }
}

export function getEditions(): DailyEdition[] {
  if (inMemoryEditions && inMemoryEditions.length > 0) {
    return inMemoryEditions;
  }
  return (initialEditions as unknown as DailyEdition[]) || [];
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
  const editions = [...getEditions()];
  const existingIndex = editions.findIndex(e => e.id === edition.id);
  if (existingIndex >= 0) {
    editions[existingIndex] = edition;
  } else {
    editions.unshift(edition);
  }
  inMemoryEditions = editions;
  safeDiskWrite(EDITIONS_FILE, JSON.stringify(editions, null, 2));
}

export function getSubscribers(): Subscriber[] {
  if (inMemorySubscribers && inMemorySubscribers.length > 0) {
    return inMemorySubscribers;
  }
  return (initialSubscribers as unknown as Subscriber[]) || [];
}

export function addSubscriber(email: string, name?: string, topics: string[] = ['Daily Morning Brief']): { success: boolean; isNew: boolean; subscriber: Subscriber } {
  const subscribers = [...getSubscribers()];
  const normalizedEmail = email.trim().toLowerCase();
  
  const existing = subscribers.find(s => s.email.toLowerCase() === normalizedEmail);
  if (existing) {
    existing.active = true;
    if (topics.length) existing.topics = Array.from(new Set([...existing.topics, ...topics]));
    if (name) existing.name = name;
    inMemorySubscribers = subscribers;
    safeDiskWrite(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
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
  inMemorySubscribers = subscribers;
  safeDiskWrite(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  return { success: true, isNew: true, subscriber: newSub };
}

export function updateSubscriberDispatch(emails: string[]): void {
  const subscribers = [...getSubscribers()];
  const emailSet = new Set(emails.map(e => e.toLowerCase()));
  const now = new Date().toISOString();

  subscribers.forEach(sub => {
    if (emailSet.has(sub.email.toLowerCase())) {
      sub.lastDispatchedAt = now;
    }
  });

  inMemorySubscribers = subscribers;
  safeDiskWrite(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export function getDictionary(): JargonTerm[] {
  return inMemoryDictionary;
}

export function getMasterclasses(): DailyFinanceMasterclass[] {
  return inMemoryMasterclasses;
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

  const effectiveDate = dateStr ? new Date(dateStr) : new Date();
  const dayOfYear = Math.floor((effectiveDate.getTime() - new Date(effectiveDate.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = Math.abs(dayOfYear) % masterclasses.length;
  return masterclasses[index];
}
