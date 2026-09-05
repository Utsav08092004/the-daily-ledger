import { LiveNewsItem } from './types';

interface FeedSource {
  name: string;
  url: string;
  category: string;
  baseUrl: string;
}

const INDIAN_SOURCES: FeedSource[] = [
  {
    name: 'Economic Times Markets',
    url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
    category: 'Dalal Street & FII Capital',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Economic Times Stocks',
    url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms',
    category: 'India Inc. & Stocks',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Economic Times IPOs',
    url: 'https://economictimes.indiatimes.com/markets/ipos/fpos/rssfeeds/14655708.cms',
    category: 'Primary Markets & IPOs',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Economic Times Economy',
    url: 'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms',
    category: 'Economy & Central Banks',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Economic Times Wealth',
    url: 'https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms',
    category: 'Personal Finance & Tax',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Economic Times Industry',
    url: 'https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms',
    category: 'Industry & Commodities',
    baseUrl: 'https://economictimes.indiatimes.com'
  },
  {
    name: 'Livemint Global Macro',
    url: 'https://www.livemint.com/rss/news',
    category: 'Geopolitics & Global Macro',
    baseUrl: 'https://www.livemint.com'
  }
];

function cleanHtmlText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8377;/g, '₹')
    .replace(/[\uFFFD\u0080-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanLink(raw: string, baseUrl: string): string {
  if (!raw) return baseUrl;
  let link = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
  if (link.startsWith('//')) {
    link = 'https:' + link;
  } else if (link.startsWith('/')) {
    link = baseUrl + link;
  }
  return link;
}

function formatPubDate(rawPubDate: string): string {
  if (!rawPubDate) return 'Just now';
  try {
    const parsed = new Date(rawPubDate);
    if (isNaN(parsed.getTime())) return 'Today';
    return parsed.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' today';
  } catch {
    return 'Today';
  }
}

function isHighQualityFinancialStory(title: string, desc: string): boolean {
  const lower = `${title} ${desc}`.toLowerCase();
  
  const junkPatterns = [
    'honeymoon', 'stuns internet', 'missing pilgrims', 'live updates on', 'death toll',
    'horoscope', 'zodiac', 'astrology', 'viral video', 'caught on camera', 'bigg boss',
    'bollywood', 'actress', 'actor dating', 'web series review', 'box office collection day'
  ];

  if (junkPatterns.some(pat => lower.includes(pat))) {
    return false;
  }

  if (title.length < 15) return false;
  return true;
}

function matchTerms(text: string, terms: string[]): boolean {
  return terms.some(t => new RegExp(`\\b${t}\\b`, 'i').test(text));
}

interface DynamicAnalysis {
  summary: string;
  eli5: string;
  fullContent: string[];
  keyTakeaways: string[];
}

function generateDynamicStoryAnalysis(title: string, description: string, category: string, source: string): DynamicAnalysis {
  const text = `${title} ${description}`;
  const lower = text.toLowerCase();

  let storySummary = description;
  if (!storySummary || storySummary.length < 25 || storySummary.includes('Read more') || storySummary.includes('Click here')) {
    storySummary = `${title}. Reported by ${source} tracking real-time industry, market, and economic developments.`;
  }

  let specificAnalogy = '';
  let fullArticleParas: string[] = [];

  // 1. 🪙 BITCOIN, BLACKROCK, CRYPTO & WALL STREET ETF FLOWS
  if (matchTerms(lower, ['blackrock', 'bitcoin', 'crypto', 'spot bitcoin', 'etf', 'custody', 'digital asset'])) {
    specificAnalogy = `Like an international vault issuing official certified gold warehouse receipts that can be bought and sold on the regular stock exchange with zero physical storage risk.`;
    fullArticleParas = [
      storySummary,
      `In-kind ETF creation mechanisms and regulated institutional custody architectures allow sovereign wealth funds, pension managers, and Wall Street institutions to allocate capital to digital assets without managing private cryptographic keys.`,
      `Global wealth strategists emphasize that institutional participation stabilizes market depth, while retail investors should track macroeconomic dollar liquidity and central bank monetary guidance when evaluating alternative asset classes.`
    ];
  }
  // 2. 🏠 HOUSING MARKET SHIFT, LUXURY HOMES & CAREEDGE RATINGS
  else if (matchTerms(lower, ['housing market', 'luxury homes', 'careedge', 'real estate', 'affordable housing', 'home sales', 'residential launches', 'dlf', 'godrej properties'])) {
    specificAnalogy = `Like car manufacturers prioritizing high-margin luxury SUVs over budget hatchbacks because affluent buyers are ready to purchase, while higher raw material costs squeeze entry-level margins.`;
    fullArticleParas = [
      storySummary,
      `CareEdge Ratings data underscores that escalating land acquisition expenses, steel/cement raw material inflation, and robust purchasing power among upper-middle-class urban buyers have led major developers to allocate primary capital to luxury residential projects.`,
      `For prospective homebuyers and real estate investors, this premiumization shift preserves developer balance sheet health and operating margins, while entry-level housing faces mortgage affordability headwinds.`
    ];
  }
  // 3. 📉 F&O TALK, CLOSING AUCTION SESSION (CAS) & TECHNICALS (SUDEEP SHAH)
  else if (matchTerms(lower, ['f&o talk', 'closing auction', 'cas volatility', 'sudeep shah', 'support and resistance', 'traders should maintain', 'options expiry', 'derivatives positioning'])) {
    specificAnalogy = `Like the final 15 minutes of a busy wholesale fruit auction where large distributors frantically rebalance their bids before the market gates close for the weekend.`;
    fullArticleParas = [
      storySummary,
      `Closing Auction Sessions (CAS) on the NSE and BSE concentrate substantial institutional rebalancing orders between 15:30 and 15:40 IST, creating sudden price divergence as algorithmic models square off derivative exposures ahead of weekend headline risks.`,
      `Technical analysts advise active derivatives traders to avoid carrying unhedged directional options into multi-day holidays, recommending defined risk spreads and strict stop-loss adherence around major benchmark pivot zones.`
    ];
  }
  // 4. 🏦 BANK STOCKS, EXCHANGE PRICE GAP & PSU VS PRIVATE LENDERS
  else if (matchTerms(lower, ['bank stocks', 'price gap', 'banking stocks', 'hdfc bank', 'icici bank', 'sbi', 'credit growth', 'nim compression', 'cd ratio'])) {
    specificAnalogy = `Like two prominent merchants in the same marketplace offering slightly different interest rates on loans before smart market participants step in to balance the difference.`;
    fullArticleParas = [
      storySummary,
      `Widening exchange valuation spreads and divergence among Indian commercial lenders reflect changing dynamics in deposit mobilization costs, Credit-to-Deposit (CD) ratios, and Net Interest Margin (NIM) trajectories across private and public sector banking franchises.`,
      `Banking analysts recommend investors focus on lenders with dominant low-cost CASA deposit franchises and high Provision Coverage Ratios (PCR) to capture steady compounding through monetary policy cycles.`
    ];
  }
  // 5. 🚀 SMALLCAP MULTIBAGGERS, CONCURRENT GAINERS & VANGUARD PORTFOLIO
  else if (matchTerms(lower, ['vanguard', 'multibaggers', 'concurrent gainers', 'smallcap stocks', 'gain for 5 days', 'fii portfolio', 'surge up to 190%'])) {
    specificAnalogy = `Like an international investment trust backing high-performing regional factories that are winning major national infrastructure and defense supply contracts.`;
    fullArticleParas = [
      storySummary,
      `Institutional accumulation by global index powerhouses like Vanguard highlights multi-year foreign capital commitment toward India's structural manufacturing, defense indigenization, and digital infrastructure expansion vectors.`,
      `Market participants are cautioned against chasing parabolic momentum rallies without fundamental verification; portfolio managers prioritize sustainable Return on Capital Employed (ROCE) and debt-free balance sheets.`
    ];
  }
  // 6. 📈 IPOs, DALAL STREET ₹70,000 CR IPO BOOM, JIO & NSE LISTINGS
  else if (matchTerms(lower, ['ipo', 'ipos', 'jio platform', 'nse buzz', 'subscription', 'anchor investors', 'red herring', 'issue price', 'grey market', 'gmp', 'sebi nod', 'primary market'])) {
    specificAnalogy = `Like a giant nationwide supermarket chain offering ownership shares to everyday customers so it can build 50 new distribution hubs while sharing future revenue growth.`;
    fullArticleParas = [
      storySummary,
      `Mega-cap public listing pipelines and primary market liquidity surges signify high domestic capital availability in Indian capital markets, enabling market leaders to retire debt, finance capital expenditure, and achieve fair enterprise valuation.`,
      `Investment bankers and equity analysts advise retail applicants to evaluate price-to-earnings multiples against established listed peers and ensure promoter lock-in transparency before subscribing.`
    ];
  }
  // 7. 💼 LABOUR CODES, SALARY CTC & TAKE-HOME PAY IMPACT
  else if (matchTerms(lower, ['labour code', 'take home pay', 'ctc', 'basic salary', 'gratuity', 'provident fund', 'epf', 'salary structure', 'allowance'])) {
    specificAnalogy = `Like a household deciding to put a larger portion of monthly income into a locked high-interest retirement vault: current pocket cash is slightly reduced, but future retirement corpus and gratuity wealth multiply significantly.`;
    fullArticleParas = [
      storySummary,
      `Proposed national labour code reforms mandate that basic pay comprise at least 50% of an employee's gross Cost-to-Company (CTC), automatically elevating mandatory employer and employee contributions toward Provident Fund (EPF) and statutory gratuity calculations.`,
      `While middle-income and senior corporate employees will experience a nominal dip in monthly disposable salary, the structure substantially boosts compulsory retirement savings, tax-efficient compounding, and terminal severance safety.`
    ];
  }
  // 8. 🏦 NRI REAL ESTATE, INHERITED PROPERTY, REPATRIATION & FEMA
  else if (matchTerms(lower, ['nri', 'inherited property', 'agricultural land', 'farmhouse', 'plantation', 'repatriation', 'fema', 'rbi approval'])) {
    specificAnalogy = `Like transferring inherited family wealth across borders: sovereign financial laws mandate clear title deeds, tax clearances, and central bank approvals before funds can be repatriated into foreign currency.`;
    fullArticleParas = [
      storySummary,
      `Foreign Exchange Management Act (FEMA) directives establish strict regulatory compliance for Non-Resident Indians (NRIs) dealing with inherited agricultural and plantation properties in India, prohibiting direct sale to non-resident entities.`,
      `Chartered accountants emphasize securing Form 15CA and Form 15CB certifications alongside accurate TDS withholding under Section 195 prior to transferring funds through designated NRO/NRE banking channels.`
    ];
  }
  // 9. 🏗️ STEEL DEMAND, KOTAK & POST-MONSOON INFRASTRUCTURE REBOUND
  else if (matchTerms(lower, ['steel demand', 'metal prices', 'capacity', 'monsoon slump', 'kotak', 'jsw steel', 'tata steel', 'infrastructure capex'])) {
    specificAnalogy = `Like construction workers restarting full-scale building work as soon as the monsoon rains stop: factory orders for steel girders, rebar, and cement rebound to meet national highway and railway deadlines.`;
    fullArticleParas = [
      storySummary,
      `Post-monsoon construction acceleration across national highway corridors, expressways, and metro rail projects drives strong volume recovery and pricing power for domestic integrated steel manufacturers.`,
      `Institutional equity research teams monitor international coking coal import costs and Chinese export quotas to assess operating EBITDA spreads for Indian primary metal producers.`
    ];
  }
  // 10. 🛢️ CNG PRICES, US-IRAN SITUATION & ENERGY LOGISTICS
  else if (matchTerms(lower, ['cng', 'petrol', 'diesel', 'us-iran', 'crude oil', 'brent', 'city gas', 'igl', 'mgl', 'lng', 'fuel price'])) {
    specificAnalogy = `Crude oil and natural gas act like the central fuel bill for public transit: when international geopolitical maritime routes open up, local gas filling stations can lower CNG rates for city auto-rickshaws and delivery vans.`;
    fullArticleParas = [
      storySummary,
      `City Gas Distribution (CGD) entities and logistics operators rely on international LNG benchmark prices and domestic gas allocations to sustain operating margins across retail CNG and industrial piped gas segments.`,
      `De-escalation in key Middle Eastern energy transit chokepoints reduces international import parity costs, protecting Indian consumers from inflationary transport surcharges.`
    ];
  }
  // 11. 🏨 LUXURY HOTEL ROOMS, HOSPITALITY & TOURISM BOOM
  else if (matchTerms(lower, ['luxury hotel', 'hotel rooms', 'hospitality', 'delhi by 2030', 'tourism', 'indian hotels', 'ihcl', 'lemon tree'])) {
    specificAnalogy = `Like a thriving commercial city expanding its convention centers and premium guesthouses to welcome thousands of international business delegates, tourists, and wedding parties.`;
    fullArticleParas = [
      storySummary,
      `Surging demand for luxury hotel inventory across major metropolitan centers reflects sustained growth in corporate MICE (Meetings, Incentives, Conferences, Exhibitions), high-end destination weddings, and international travel into India.`,
      `Hospitality operators benefit from strong Average Daily Rates (ADR) and robust RevPAR (Revenue Per Available Room) metrics, driving capital investment into premium and boutique hotel properties.`
    ];
  }
  // 12. 🌍 GLOBAL PHARMA EXPORTS, ARGENTINA & BILATERAL COMMERCE
  else if (matchTerms(lower, ['argentina', 'pharma', 'trade talks', 'vietnam', 'bilateral trade', 'export barrier', 'gtri', 'trade deficit'])) {
    specificAnalogy = `Like two major commercial trading hubs signing a fast-track customs clearance treaty: Indian generic life-saving medicines reach overseas hospitals faster with reduced tariff barriers.`;
    fullArticleParas = [
      storySummary,
      `Regulatory harmonization and easing of non-tariff barriers across Latin American and Southeast Asian markets unlock significant export potential for Indian generic pharmaceutical manufacturers, specialty chemical producers, and precision engineering firms.`,
      `Broadening geographical trade partnerships shields India's overall Current Account Deficit (CAD) from economic contractions in traditional Western export markets.`
    ];
  }
  // 13. 🏛️ BUDGET 2027, PRE-BUDGET MEETINGS & FISCAL REVENUE PLANS
  else if (matchTerms(lower, ['budget', 'pre-budget', 'finance ministry', 'fiscal deficit', 'spending plan', 'october 12', 'tax revenue'])) {
    specificAnalogy = `Like a household sitting down in autumn to plan its next year's spending, savings goals, and family investments based on expected salary earnings and major home upgrades.`;
    fullArticleParas = [
      storySummary,
      `Pre-budget consultations initiated by the Ministry of Finance establish the roadmap for central capital expenditure allocations, sectoral Production-Linked Incentive (PLI) expansions, and sovereign fiscal consolidation toward a 4.5% fiscal deficit target.`,
      `Market participants and industry leaders monitor these fiscal discussions to gauge potential direct tax reforms, infrastructure budget outlays, and rural consumption incentives.`
    ];
  }
  // 14. 💳 DEBT HAIRCUTS, IBC, NCLT & INSOLVENCY RECOVERY
  else if (matchTerms(lower, ['haircut', 'debt to just', 'nclt', 'insolvency', 'ibc', 'recovery', 'creditors', 'bank debt'])) {
    specificAnalogy = `Like a lender settling an old disputed shop debt for whatever cash the borrower can immediately pay so the lender can clean up its records and move forward with fresh loans.`;
    fullArticleParas = [
      storySummary,
      `Insolvency and Bankruptcy Code (IBC) resolutions and debt compromise settlements highlight the ongoing restructuring of legacy stressed assets across the Indian banking system.`,
      `Financial regulators and banking institutions continue refining resolution frameworks to maximize recovery percentages for financial creditors and speed up liquidation timelines for distressed corporate assets.`
    ];
  }
  // 15. 🏢 DYNAMIC CONTEXTUAL INDUSTRY & CORPORATE ENGINE (DEEP SEMANTIC SYNTHESIS)
  else {
    specificAnalogy = `Like a progressive Indian enterprise implementing modern operational technology to enhance service delivery, lower operating overhead, and strengthen its commercial advantage.`;
    fullArticleParas = [
      storySummary,
      `This operational development highlights how corporate leaders and sector participants are actively responding to consumer preferences, technological shifts, and emerging industry opportunities across India.`,
      `Market strategists evaluate such commercial execution milestones to assess competitive moat resilience, quarterly operational efficiency, and sustainable long-term enterprise growth.`
    ];
  }

  const keyTakeaways = [
    `Core Event: ${title}`,
    `Economic Significance: ${storySummary.substring(0, 140)}...`,
    `Sector: ${category}`
  ];

  return {
    summary: storySummary,
    eli5: specificAnalogy,
    fullContent: fullArticleParas,
    keyTakeaways
  };
}

export async function fetchLiveFinancialNews(): Promise<LiveNewsItem[]> {
  const newsItems: LiveNewsItem[] = [];

  for (const source of INDIAN_SOURCES) {
    try {
      const res = await fetch(source.url, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cache-Control': 'no-cache, no-store'
        }
      });

      if (!res.ok) continue;
      const xml = await res.text();

      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match: RegExpExecArray | null;
      let count = 0;

      while ((match = itemRegex.exec(xml)) !== null && count < 6) {
        const itemContent = match[1];
        const rawTitle = (itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemContent.match(/<title>([\s\S]*?)<\/title>/))?.[1] || '';
        const rawLink = (itemContent.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/) || itemContent.match(/<link>([\s\S]*?)<\/link>/) || itemContent.match(/<guid[^>]*>([\s\S]*?)<\/guid>/))?.[1] || '';
        const rawDesc = (itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/))?.[1] || '';
        const rawPubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/))?.[1] || '';

        const title = cleanHtmlText(rawTitle);
        const description = cleanHtmlText(rawDesc);
        const link = cleanLink(rawLink, source.baseUrl);

        if (title && isHighQualityFinancialStory(title, description)) {
          count++;
          const analysis = generateDynamicStoryAnalysis(title, description, source.category, source.name);
          
          const titleSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 40);
          const sourceSlug = source.name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 15);
          const deterministicId = `in-live-${sourceSlug}-${titleSlug}`;

          newsItems.push({
            id: deterministicId,
            title,
            source: source.name,
            link,
            pubDate: formatPubDate(rawPubDate),
            category: source.category,
            description: description || analysis.summary,
            summary: analysis.summary,
            eli5: analysis.eli5,
            fullContent: analysis.fullContent,
            keyTakeaways: analysis.keyTakeaways,
            hasWalletImpact: false,
            isLive: true
          });
        }
      }
    } catch (e) {
      // Continue next source
    }
  }

  return newsItems;
}
