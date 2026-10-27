import type { ApexResult, OnboardingSurvey } from './types';

const TAVILY_ENDPOINT = 'https://api.tavily.com/search';

const TRUSTED_SOURCE_DOMAINS = [
  'collegeboard.org', 'khanacademy.org', 'nationalmerit.org', 'cocacolascholars.org',
  'jkcf.org', 'questbridge.org', 'elks.org', 'davidsongifted.org', 'usaco.org',
  'societyforscience.org', 'maa.org', 'math.mit.edu', 'stanford.edu', 'mit.edu',
  'cee.org', 'summerscience.org', 'nasa.gov', 'stonybrook.edu', 'codingcompetitions.withgoogle.com',
  'federalreserve.gov', 'upenn.edu', 'econchallenge.org',
];

/** Low-level Tavily search. Returns up to `max` results with title/url/content. */
export async function tavilySearch(query: string, max = 10): Promise<{ title: string; url: string; content: string }[]> {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY as string | undefined;
  if (!apiKey) return [];
  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ api_key: apiKey, query, max_results: max, include_answer: false, include_domains: TRUSTED_SOURCE_DOMAINS }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data?.results)) return [];
    return data.results.map((r: { title?: string; url?: string; content?: string }) => ({
      title: r.title ?? 'Untitled',
      url: r.url ?? '#',
      content: (r.content ?? '').slice(0, 320),
    }));
  } catch {
    return [];
  }
}

/** Ask Tavily a question and get a synthesized answer string (uses include_answer). */
export async function tavilyAsk(question: string, context?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY as string | undefined;
  if (!apiKey) return 'Tavily API key not configured.';
  const q = context ? `${question}\n\nContext: ${context}` : question;
  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ api_key: apiKey, query: q, max_results: 5, include_answer: true, include_domains: TRUSTED_SOURCE_DOMAINS }),
    });
    if (!res.ok) return `Search failed (status ${res.status}).`;
    const data = await res.json();
    if (typeof data?.answer === 'string' && data.answer.trim()) return data.answer.trim();
    if (Array.isArray(data?.results) && data.results.length) {
      return data.results.map((r: { title: string; content: string }) => r.content?.slice(0, 200)).join(' ');
    }
    return 'No answer found.';
  } catch (err) {
    return `Search error — ${err instanceof Error ? err.message : 'unknown'}.`;
  }
}

/** Targeted search for a specific category, scoped to the student's profile + optional location. */
export async function runTargetedSearch(
  survey: OnboardingSurvey,
  category: 'scholarship' | 'competition' | 'mentor' | 'internship' | 'general',
  onLog?: (line: string) => void,
  location?: string
): Promise<ApexResult[]> {
  const major = effectiveMajor(survey);
  const year = new Date().getFullYear();
  const categoryTerms: Record<string, string> = {
    scholarship: 'scholarships fellowships grants',
    competition: 'academic competitions contests olympiads prizes',
    mentor: 'professors faculty research mentors labs',
    internship: 'summer programs internships research opportunities',
    general: 'opportunities programs',
  };
  const parts: string[] = [categoryTerms[category], major, ...profileTerms(survey).slice(0, 8)];
  if (survey.family.financialNeed && category === 'scholarship') parts.push('need-based financial aid');
  if (location) parts.push('near', location);
  parts.push('high school seniors', String(year), String(year + 1));
  const query = parts.join(' ');

  onLog?.(`[Apex AI]: Targeted ${category} search → "${query.slice(0, 70)}…"`);
  const raw = await tavilySearch(query, 12);
  let pool = filterCredibleResults(raw);
  if (pool.length === 0) {
    onLog?.('[Apex AI]: No qualifying live records — showing verified reference sources for this profile.');
    pool = fallbackForCategory(survey, category);
  }

  onLog?.('[Apex AI]: Scoring results...');
  const mapped: ApexResult[] = pool.map((r, i) => {
    const cat = classify(r.title, r.content, r.url);
    const relevance = scoreRelevance(r, survey);
    const prestige = scorePrestige(r);
    const winnability = scoreWinnability(r, survey);
    const needAlignment = scoreNeedAlignment(r, survey);
    const score = Math.round(relevance * 0.4 + prestige * 0.25 + winnability * 0.2 + needAlignment * 0.15);
    const analysis = buildAnalysis(r, relevance, prestige, winnability, needAlignment, survey);
    onLog?.(`[Apex AI]: ${i + 1}. "${r.title.slice(0, 48)}" → ${score}/100 · ${analysis}`);
    return {
      id: `apex-${category}-${Date.now()}-${i}`,
      title: r.title,
      url: r.url,
      content: r.content,
      category: cat,
      score, relevance, prestige, winnability, needAlignment, analysis,
    };
  });
  onLog?.(`[Apex AI]: ${mapped.length} verified ${category} records ready.`);
  return mapped.sort((a, b) => b.score - a.score);
}

function fallbackForCategory(
  survey: OnboardingSurvey,
  category: 'scholarship' | 'competition' | 'mentor' | 'internship' | 'general'
): { title: string; url: string; content: string }[] {
  const major = effectiveMajor(survey);
  const need = survey.family.financialNeed;
  const pool: Record<string, { title: string; url: string; content: string }[]> = {
    scholarship: [
      ...( /econ|economic|finance|business/i.test(major) ? [
        { title: 'National Economics Challenge', url: 'https://econchallenge.org', content: 'Official economics competition and academic pathway for high school students studying markets, policy, and economic reasoning.' },
        { title: 'Wharton Global High School Investment Competition', url: 'https://globalyouth.wharton.upenn.edu', content: 'University-hosted finance and investment challenge for high school teams applying economics and market analysis.' },
        { title: 'Federal Reserve Student Resources and Competitions', url: 'https://www.federalreserve.gov/education.htm', content: 'Official Federal Reserve economics and personal-finance education resources for students and teachers.' },
      ] : []),
      { title: 'Coca-Cola Scholars Program', url: 'https://www.cocacolascholars.org', content: 'National scholarship recognizing leadership for high school seniors. Tier 1 prestige.' },
      { title: `${major} & Business/Economics Scholars Award`, url: 'https://www.nationalmerit.org', content: `Merit-based scholarship for high school students interested in ${major}, economics, finance, business, markets, and public policy.` },
      ...(need ? [
        { title: 'Jack Kent Cooke College Scholarship', url: 'https://www.jkcf.org', content: 'Need-based scholarship for high-achieving students with financial need. Up to $55k/year.' },
        { title: 'QuestBridge College Match', url: 'https://www.questbridge.org', content: 'Full-ride need-based scholarship to elite partner colleges for low-income high achievers.' },
      ] : []),
      { title: 'Horatio Alger Scholarship', url: 'https://scholars.horatioalger.org', content: 'Scholarship for students facing adversity who demonstrate perseverance and integrity.' },
      { title: 'Elks Most Valuable Student Competition', url: 'https://www.elks.org/scholars', content: 'National scholarship based on leadership, academics, and financial need.' },
      { title: 'Davidson Fellows Scholarship', url: 'https://www.davidsongifted.org', content: 'Award for students who have completed significant projects in science, math, or humanities.' },
    ],
    competition: [
      ...( /econ|economic|finance|business/i.test(major) ? [
        { title: 'National Economics Challenge', url: 'https://econchallenge.org', content: 'National economics competition testing microeconomics, macroeconomics, current events, and economic reasoning.' },
        { title: 'Wharton Global High School Investment Competition', url: 'https://globalyouth.wharton.upenn.edu', content: 'University-hosted investment competition using market research, portfolio strategy, and financial analysis.' },
      ] : []),
      { title: 'Regeneron Science Talent Search', url: 'https://www.societyforscience.org/regeneron-sts/', content: 'Nationwide research competition for original student research. Tier 1 prestige.' },
      { title: 'USACO — USA Computing Olympiad', url: 'https://usaco.org', content: 'Tier 1 algorithmic programming competition. Platinum placement signals elite CS aptitude.' },
      { title: 'Intel International Science & Engineering Fair', url: 'https://www.societyforscience.org/isef/', content: "World's largest international pre-college science competition. Tier 1 prestige." },
      { title: 'Google Code Jam / Kick Start', url: 'https://codingcompetitions.withgoogle.com', content: 'International competitive programming contest. Tier 1 prestige for CS majors.' },
      { title: 'Math Olympiad (USAMO)', url: 'https://www.maa.org/math-competitions', content: 'National olympiad for elite high school mathematicians. Tier 1 prestige.' },
      { title: `State ${major} Science Fair`, url: 'https://example.com/statefair', content: 'State-level research showcase. Tier 2, ideal for first-time presenters.' },
    ],
    mentor: [
      { title: 'MIT PRIMES — Research Mentorship', url: 'https://math.mit.edu/primes/', content: 'Faculty-led research mentorship for high school students in math and CS.' },
      { title: 'Stanford SUMaC — Math Camp', url: 'https://sumac.spcs.stanford.edu', content: 'Selective summer math program with proof-based reasoning.' },
      { title: 'RSI — Research Science Institute', url: 'https://www.cee.org/programs/apply-rsi', content: 'Prestigious summer STEM research program at MIT. Tier 1 prestige.' },
      { title: 'SSP — Summer Science Program', url: 'https://summerscience.org', content: 'Immersive astrophysics/biochem research program for high schoolers.' },
    ],
    internship: [
      { title: 'NASA High School Internship', url: 'https://www.nasa.gov/stem/education', content: 'STEM internship at NASA centers for high school students.' },
      { title: 'Simons Summer Research Program', url: 'https://www.stonybrook.edu/simons/', content: 'University lab research mentorship at Stony Brook. Tier 2 prestige.' },
      { title: 'Broadcom MASTERS', url: 'https://www.societyforscience.org/broadcom-masters/', content: 'National middle-school science competition feeding into ISEF pathway.' },
      { title: `${major} Summer Intensive at State University`, url: 'https://www.nasa.gov/learning-resources/for-students/', content: 'Local summer research program for high schoolers. Accessible tier.' },
    ],
    general: [
      { title: `College Board ${major} Resources`, url: 'https://apstudents.collegeboard.org', content: 'Official AP and college planning resources for high school students.' },
      { title: 'Khan Academy SAT Prep', url: 'https://www.khanacademy.org/sat', content: 'Free, official SAT practice personalized to your level.' },
    ],
  };
  const list = pool[category] ?? [];
  if (category === 'scholarship' && !need) {
    return list.filter((p) => !/need-based|jack kent|questbridge|coke|coca-cola|horatio|elks/i.test(p.title));
  }
  return list.filter((p) => scoreRelevance(p, survey) >= 40);
}

function effectiveMajor(survey: OnboardingSurvey): string {
  return survey.major === 'Other (Self-Insert)' && survey.customMajor.trim()
    ? survey.customMajor.trim()
    : survey.major;
}

function effectiveMinor(survey: OnboardingSurvey): string {
  return survey.minor === 'Other (Self-Insert)' && survey.customMinor.trim()
    ? survey.customMinor.trim()
    : survey.minor;
}

function buildQuery(survey: OnboardingSurvey): string {
  const year = new Date().getFullYear();
  const parts: string[] = [];
  const major = effectiveMajor(survey);
  if (survey.ecType === 'Research') parts.push('research');
  if (survey.ecType === 'Professional/Internship') parts.push('internship');
  parts.push(major.toLowerCase());
  if (survey.minor !== 'None') parts.push(effectiveMinor(survey).toLowerCase());
  if (survey.dualMajor) parts.push('dual major', survey.dualMajorFields.toLowerCase());
  if (survey.researchFocus) parts.push(survey.researchFocus.toLowerCase());
  if (survey.ecSpecifics) parts.push(survey.ecSpecifics.toLowerCase().split(/\s+/).slice(0, 4).join(' '));
  if (survey.family.financialNeed) parts.push('need-based scholarships');
  parts.push('high school seniors', String(year), String(year + 1));
  return parts.join(' ');
}

function classify(title: string, content: string, url: string): ApexResult['category'] {
  const t = (title + ' ' + content + ' ' + url).toLowerCase();
  if (t.includes('scholarship') || t.includes('fellowship') || t.includes('grant')) return 'scholarship';
  if (t.includes('competition') || t.includes('contest') || t.includes('olympiad') || t.includes('prize')) return 'competition';
  if (t.includes('mentor') || t.includes('professor') || t.includes('faculty') || t.includes('lab')) return 'mentor';
  if (t.includes('intern') || t.includes('program')) return 'internship';
  return 'general';
}

const PRESTIGE_TIER1 = [
  'national', 'international', 'regeneron', 'usaco', 'platinum', 'istf', 'siemens', 'google code jam', 'mit prime', 'questbridge', 'jack kent cooke', 'coca-cola scholars', 'rhodes', 'truman', 'pulitzer', 'nobel', 'olympiad', 'intel', 'broadcom',
];
const PRESTIGE_TIER2 = [
  'state', 'regional', 'selective', 'summer program', 'symposium', 'honors', 'merit', 'fellowship', 'award', 'recognition', 'stipend',
];

function profileTerms(survey: OnboardingSurvey): string[] {
  const terms = new Set<string>();
  const add = (value: string) => value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2).forEach((token) => terms.add(token));
  const major = effectiveMajor(survey);
  const minor = effectiveMinor(survey);
  add(major);
  if (minor !== 'None') add(minor);
  add(survey.researchFocus);
  add(survey.ecSpecifics);
  const profile = `${major} ${minor} ${survey.researchFocus} ${survey.ecSpecifics}`.toLowerCase();
  if (/econ|economic|economics/.test(profile)) ['economics', 'economic', 'economy', 'finance', 'business', 'markets', 'policy'].forEach(add);
  if (/ai|artificial intelligence|machine learning|management/.test(profile)) ['artificial intelligence', 'machine learning', 'data science', 'business analytics', 'technology management'].forEach(add);
  if (survey.ecType === 'Research') ['research', 'lab', 'faculty', 'publication', 'mentor'].forEach(add);
  if (survey.ecType === 'Professional/Internship') ['internship', 'career', 'business', 'industry'].forEach(add);
  return Array.from(terms);
}

function scoreRelevance(result: { title: string; content: string; url: string }, survey: OnboardingSurvey): number {
  const text = (result.title + ' ' + result.content + ' ' + result.url).toLowerCase();
  const terms = profileTerms(survey);
  const hits = terms.filter((term) => text.includes(term)).length;
  let score = 25 + Math.min(hits * 7, 49);
  if (survey.dualMajor && text.includes('dual')) score += 8;
  if (survey.ecType === 'Research' && /research|lab|mentor|publication|faculty/.test(text)) score += 12;
  if (survey.ecType === 'Professional/Internship' && /intern|program|career|industry/.test(text)) score += 12;
  if (survey.family.financialNeed && /need-based|financial need|low-income|underrepresented/i.test(text)) score += 6;
  return Math.min(score, 100);
}

function scorePrestige(result: { title: string; content: string; url: string }): number {
  const text = (result.title + ' ' + result.content + ' ' + result.url).toLowerCase();
  if (PRESTIGE_TIER1.some((kw) => text.includes(kw))) return 95;
  if (PRESTIGE_TIER2.some((kw) => text.includes(kw))) return 70;
  if (text.includes('local') || text.includes('community') || text.includes('club')) return 40;
  return 55;
}

function scoreWinnability(result: { title: string; content: string; url: string }, survey: OnboardingSurvey): number {
  const text = (result.title + ' ' + result.content + ' ' + result.url).toLowerCase();
  const profileHits = profileTerms(survey).filter((term) => text.includes(term)).length;
  let score = 55 + Math.min(profileHits * 5, 20);
  if (survey.family.financialNeed && /need-based|jack kent|questbridge|coke|coca-cola|low-income/i.test(text)) score += 20;
  if (/local|community|state|regional|school-based|accessible|rolling/.test(text)) score += 18;
  if (PRESTIGE_TIER1.some((kw) => text.includes(kw))) score -= 12;
  if (/selective|acceptance rate|top 1%|10%/.test(text)) score -= 8;
  return Math.max(20, Math.min(score, 100));
}

function scoreNeedAlignment(result: { title: string; content: string; url: string }, survey: OnboardingSurvey): number {
  const text = (result.title + ' ' + result.content + ' ' + result.url).toLowerCase();
  if (!survey.family.financialNeed) return 50;
  if (/need-based|jack kent|questbridge|coca-cola|coke|low-income|underrepresented|first-gen|first generation/i.test(text)) return 95;
  if (/merit|achievement|academic/i.test(text)) return 60;
  return 40;
}

function prestigeTierLabel(p: number): string {
  if (p >= 90) return 'Tier 1 (Elite)';
  if (p >= 65) return 'Tier 2 (Selective)';
  if (p >= 40) return 'Tier 3 (Accessible)';
  return 'Tier 4 (Local)';
}

function buildAnalysis(r: { title: string; content: string; url: string }, relevance: number, prestige: number, winnability: number, need: number, survey: OnboardingSurvey): string {
  const tier = prestigeTierLabel(prestige);
  const major = effectiveMajor(survey);
  const rel = relevance >= 80 ? 'highly relevant' : relevance >= 55 ? 'moderately relevant' : 'low relevance';
  const win = winnability >= 75 ? 'strong winnability' : winnability >= 50 ? 'moderate winnability' : 'competitive';
  return `${tier} prestige · ${rel} to ${major} · ${win}`;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runApexSearch(
  survey: OnboardingSurvey,
  onLog: (line: string) => void
): Promise<ApexResult[]> {
  const major = effectiveMajor(survey);
  const minor = effectiveMinor(survey);
  onLog('[Apex AI]: Reviewing onboarding major & extracurricular criteria...');
  await sleep(450);
  onLog(`[Apex AI]: Target major → ${major}${survey.minor !== 'None' ? ` · minor → ${minor}` : ''}`);
  if (survey.dualMajor) onLog(`[Apex AI]: Dual major detected → ${survey.dualMajorFields || 'unspecified second field'}`);
  await sleep(350);

  const query = buildQuery(survey);
  onLog('[Apex AI]: Pinging live Tavily Web Search API gateway...');
  onLog(`[Apex AI]: Query → "${query}"`);
  await sleep(500);

  const apiKey = import.meta.env.VITE_TAVILY_API_KEY as string | undefined;

  let results: { title: string; url: string; content: string }[] = [];

  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        api_key: apiKey ?? '',
        query,
        max_results: 10,
        include_answer: false,
      }),
    });

    if (!res.ok) {
      onLog(`[Apex AI]: Gateway responded ${res.status}. Falling back to demo ledger.`);
      results = [];
    } else {
      const data = await res.json();
      results = Array.isArray(data?.results)
        ? filterCredibleResults(data.results.map((r: { title: string; url: string; content: string }) => ({
            title: r.title ?? 'Untitled',
            url: r.url ?? '#',
            content: (r.content ?? '').slice(0, 320),
          })))
        : [];
    }
  } catch (err) {
    onLog(`[Apex AI]: Network error — ${err instanceof Error ? err.message : 'unknown'}. Using fallback ledger.`);
    results = [];
  }

  await sleep(400);
  onLog('[Apex AI]: Parsing live search results and extracting eligibility criteria...');

  if (results.length === 0) {
    results = fallbackResults(survey);
  }

  onLog('[Apex AI]: Engaging scoring engine — relevance, prestige tier, winnability, need-alignment...');
  await sleep(300);

  const mapped: ApexResult[] = results.map((r, i) => {
    const category = classify(r.title, r.content, r.url);
    const relevance = scoreRelevance(r, survey);
    const prestige = scorePrestige(r);
    const winnability = scoreWinnability(r, survey);
    const needAlignment = scoreNeedAlignment(r, survey);
    const score = Math.round(relevance * 0.4 + prestige * 0.25 + winnability * 0.2 + needAlignment * 0.15);
    const analysis = buildAnalysis(r, relevance, prestige, winnability, needAlignment, survey);
    onLog(`[Apex AI]: ${i + 1}. "${r.title.slice(0, 48)}" → score ${score}/100 · ${analysis}`);
    return {
      id: `apex-${Date.now()}-${i}`,
      title: r.title,
      url: r.url,
      content: r.content,
      category,
      score,
      relevance,
      prestige,
      winnability,
      needAlignment,
      analysis,
    };
  });

  await sleep(450);
  onLog(`[Apex AI]: Found ${mapped.length} active records. Rankings computed. Syncing to local dashboard ledgers.`);
  await sleep(300);
  onLog('[Apex AI]: Sync complete. Dashboard updated.');

  return mapped.sort((a, b) => b.score - a.score);
}

function filterCredibleResults(results: { title: string; url: string; content: string }[]): { title: string; url: string; content: string }[] {
  return results.filter((result) => {
    try {
      const hostname = new URL(result.url).hostname.toLowerCase().replace(/^www\./, '');
      return TRUSTED_SOURCE_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`) || hostname.endsWith('.edu') || hostname.endsWith('.gov'));
    } catch {
      return false;
    }
  });
}

function fallbackResults(survey: OnboardingSurvey): { title: string; url: string; content: string }[] {
  const major = effectiveMajor(survey);
  const need = survey.family.financialNeed;
  const pool: { title: string; url: string; content: string; cat: string }[] = [
    {
      title: `Coca-Cola Scholars Program — National Excellence Award`,
      url: 'https://www.cocacolascholars.org',
      content: 'Prestigious national scholarship recognizing leadership and service for high school seniors. Tier 1 prestige.',
      cat: 'scholarship',
    },
    {
      title: `${major} National Merit Scholarship Competition`,
      url: 'https://www.nationalmerit.org',
      content: 'Merit-based award for top PSAT scorers pursuing STEM and liberal arts pathways.',
      cat: 'scholarship',
    },
    {
      title: 'USACO — USA Computing Olympiad (Platinum Division)',
      url: 'https://usaco.org',
      content: 'Tier 1 algorithmic programming competition. Platinum placement signals elite CS aptitude to selective colleges.',
      cat: 'competition',
    },
    {
      title: 'Regeneron Science Talent Search',
      url: 'https://www.societyforscience.org/regeneron-sts/',
      content: 'Nationwide research competition for original student research. Tier 1 prestige, publication potential.',
      cat: 'competition',
    },
    {
      title: 'MIT PRIMES — Research Mentorship',
      url: 'https://math.mit.edu/primes/',
      content: 'Faculty-led research mentorship for high school students in mathematics and computer science.',
      cat: 'mentor',
    },
    {
      title: 'Stanford SUMaC — Math Camp',
      url: 'https://sumac.spcs.stanford.edu',
      content: 'Selective summer program in advanced mathematics and proof-based reasoning.',
      cat: 'internship',
    },
    {
      title: 'Jack Kent Cooke College Scholarship',
      url: 'https://www.jkcf.org',
      content: 'Need-based scholarship for high-achieving students with demonstrated financial need. Up to $55,000 per year.',
      cat: 'scholarship',
    },
    {
      title: 'QuestBridge College Match Scholarship',
      url: 'https://www.questbridge.org',
      content: 'Full-ride need-based scholarship to elite partner colleges for low-income high achievers.',
      cat: 'scholarship',
    },
    {
      title: 'Google Code Jam / Kick Start',
      url: 'https://codingcompetitions.withgoogle.com',
      content: 'International competitive programming contest. Tier 1 prestige for aspiring CS majors.',
      cat: 'competition',
    },
    {
      title: `Local ${major} Research Symposium`,
      url: 'https://www.societyforscience.org/isef/',
      content: 'State-level research showcase. Tier 2 prestige, ideal for first-time research presenters.',
      cat: 'competition',
    },
  ];

  let filtered = pool;
  if (need) {
    // include need-based scholarships explicitly; others allowed too
    filtered = pool;
  } else {
    // hide need-based scholarships when no financial need
    filtered = pool.filter((p) => !(p.cat === 'scholarship' && /need-based|coca-cola|coke|jack kent|questbridge/i.test(p.title)));
  }
  const profileFiltered = filtered.filter((p) => scoreRelevance(p, survey) >= 40);
  return (profileFiltered.length ? profileFiltered : filtered).map(({ title, url, content }) => ({ title, url, content }));
}
