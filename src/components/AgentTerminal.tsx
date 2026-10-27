import { useEffect, useRef, useState } from 'react';
import { TerminalSquare, Loader2, Sparkles, ChevronRight, Database, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { runApexSearch, runTargetedSearch, tavilyAsk } from '@/lib/apex';
import type { ApexResult, ApexLogLine, OnboardingSurvey } from '@/lib/types';

interface Props {
  survey: OnboardingSurvey | null;
  onResults: (results: ApexResult[]) => void;
  results: ApexResult[];
  onClearResults: () => void;
  onRequireOnboarding: () => void;
}

interface PromptSuggestion {
  label: string;
  cmd: string;
  desc: string;
}

const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    label: 'Ask a question',
    cmd: 'ask What are the best extracurriculars for a CS major targeting Stanford?',
    desc: 'Get a live AI answer from Tavily',
  },
  {
    label: 'Find scholarships',
    cmd: 'scholarships',
    desc: 'Targeted scholarship search scoped to your profile',
  },
  {
    label: 'Find competitions',
    cmd: 'competitions',
    desc: 'Surface live competitions across all tiers',
  },
  {
    label: 'Find mentors',
    cmd: 'mentors',
    desc: 'Faculty and labs aligned to your research focus',
  },
  {
    label: 'Find internships',
    cmd: 'internships',
    desc: 'Summer programs and internships for your major',
  },
  {
    label: 'General deep search',
    cmd: 'search ivy league admission requirements extracurricular benchmarks',
    desc: 'Open-ended deep web search',
  },
];

function naturalSearchQuery(input: string, survey: OnboardingSurvey | null): string {
  const major = survey?.major === 'Other (Self-Insert)' && survey.customMajor.trim()
    ? survey.customMajor.trim()
    : survey?.major ?? 'student';
  const interests = [survey?.minor, survey?.researchFocus, survey?.ecSpecifics, survey?.dualMajorFields]
    .filter((value): value is string => Boolean(value && value !== 'None'))
    .join(' ');
  const lower = input.toLowerCase();
  if (/\becs?\b|extracurricular|activities|clubs|leadership/.test(lower)) {
    return `${major} high school extracurricular opportunities leadership research competitions internships ${interests}`.trim();
  }
  return `${input} for high school students interested in ${major} ${interests}`.trim();
}

export default function AgentTerminal({
  survey,
  onResults,
  results,
  onClearResults,
  onRequireOnboarding,
}: Props) {
  const [logs, setLogs] = useState<ApexLogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs.length]);

  const pushLog = (text: string) => {
    setLogs((prev) => [...prev, { t: Date.now(), text }]);
  };

  const executeSearch = async (query: string) => {
    if (!survey?.submitted) {
      onRequireOnboarding();
      return;
    }
    setRunning(true);
    setLogs([{ t: Date.now(), text: `[Apex AI]: Opening research session — "${query.slice(0, 60)}"` }]);
    try {
      // Override the survey query with the typed command
      const customSurvey = { ...survey, researchFocus: query, ecSpecifics: query };
      const out = await runApexSearch(customSurvey, pushLog);
      onResults(out);
    } catch (err) {
      pushLog(`[Apex AI]: Fatal error — ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      setRunning(false);
    }
  };

  const run = async () => {
    const raw = input.trim();
    if (!raw || running) return;
    pushLog(`> ${raw}`);
    setHistory((h) => [...h, raw]);
    setHistIdx(-1);
    setInput('');

    const lower = raw.toLowerCase();

    // Built-in commands
    if (lower === 'help' || lower === '?') {
      pushLog('[Apex AI]: Commands available:');
      pushLog('  ask <question>     — get a live AI answer from Tavily');
      pushLog('  search <query>     — open-ended live deep search via Tavily');
      pushLog('  scholarships       — targeted scholarship search for your profile');
      pushLog('  competitions       — targeted competition search across all tiers');
      pushLog('  mentors            — find professors & labs for your field');
      pushLog('  internships        — find summer programs & internships');
      pushLog('  results            — list synced records with scores');
      pushLog('  status             — show engine + ledger status');
      pushLog('  clear              — clear the terminal');
      pushLog('  prompts            — show suggested research prompts');
      pushLog('  help               — show this help');
      return;
    }
    if (lower === 'clear') {
      setLogs([]);
      return;
    }
    if (lower === 'results') {
      if (results.length === 0) {
        pushLog('[Apex AI]: No records synced. Run a search first.');
      } else {
        results.slice(0, 8).forEach((r) => pushLog(`  · ${r.title.slice(0, 50)} [${r.category}] → score ${r.score}/100 · ${r.analysis}`));
        if (results.length > 8) pushLog(`  …and ${results.length - 8} more.`);
      }
      return;
    }
    if (lower === 'status') {
      pushLog(`[Apex AI]: Engine ${running ? 'running' : 'idle'} | Gateway: Tavily /search | Records: ${results.length} | Onboarding: ${survey?.submitted ? 'complete' : 'pending'}`);
      return;
    }
    if (lower === 'prompt:suggestions' || lower === 'prompts') {
      PROMPT_SUGGESTIONS.forEach((p) => pushLog(`  ${p.cmd}`));
      return;
    }

    // ask command — live AI answer
    if (lower.startsWith('ask ')) {
      if (!survey?.submitted) { onRequireOnboarding(); return; }
      setRunning(true);
      const question = raw.slice(4);
      pushLog('[Apex AI]: Querying Tavily for a synthesized answer…');
      try {
        const answer = await tavilyAsk(question, `Student targeting ${survey.major}.`);
        // Split long answers across lines for readability
        answer.split(/(?<=\.)\s+/).forEach((line) => pushLog(`[Apex AI]: ${line.trim()}`));
      } catch (err) {
        pushLog(`[Apex AI]: Answer failed — ${err instanceof Error ? err.message : 'unknown'}`);
      } finally {
        setRunning(false);
      }
      return;
    }

    // Category commands — targeted searches
    const catMatch = lower.match(/^(scholarships|competitions|mentors|internships)$/);
    if (catMatch) {
      if (!survey?.submitted) { onRequireOnboarding(); return; }
      setRunning(true);
      const cat = catMatch[1] as 'scholarship' | 'competition' | 'mentor' | 'internship';
      pushLog(`[Apex AI]: Running targeted ${cat} search…`);
      try {
        const out = await runTargetedSearch(survey, cat, pushLog);
        onResults(out);
      } catch (err) {
        pushLog(`[Apex AI]: Search failed — ${err instanceof Error ? err.message : 'unknown'}`);
      } finally {
        setRunning(false);
      }
      return;
    }

    // Search command — open-ended deep search
    if (lower.startsWith('search ')) {
      const searchMatch = raw.slice(7).trim();
      if (!searchMatch) {
        pushLog('[Apex AI]: Add a topic after search, for example: search economics scholarships.');
        return;
      }
      await executeSearch(searchMatch);
      return;
    }

    // Plain-English requests are treated as live profile searches.
    await executeSearch(naturalSearchQuery(raw, survey));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const ni = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(ni);
      setInput(history[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const ni = histIdx + 1;
      if (ni >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(ni);
        setInput(history[ni]);
      }
    }
  };

  const runPreset = async (cmd: string) => {
    setInput('');
    setLogs((prev) => [...prev, { t: Date.now(), text: `> ${cmd}` }]);
    setHistory((h) => [...h, cmd]);
    await executeSearch(cmd);
  };

  const categoryLabel: Record<ApexResult['category'], string> = {
    scholarship: 'Scholarship',
    competition: 'Competition',
    mentor: 'Mentor',
    internship: 'Program',
    general: 'Resource',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="section-eyebrow">Live Engine</p>
        <h1 className="section-title">Apex AI Research Terminal</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          An interactive terminal for autonomous academic research. Type commands, run deep searches against the live
          Tavily web-search API, and pipe results straight to your dashboard ledgers.
        </p>
      </div>

      {/* Prompt suggestions */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-gold-soft" />
          <h2 className="font-serif text-base font-semibold text-white">Suggested Research Prompts</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PROMPT_SUGGESTIONS.map((p) => (
            <button
              key={p.label}
              onClick={() => runPreset(p.cmd)}
              disabled={running}
              className="group flex items-start gap-3 rounded-xl border border-ink-border bg-black/40 p-3 text-left transition-all hover:border-gold/40 hover:bg-gold/5 disabled:opacity-50"
            >
              <ChevronRight size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              <div>
                <p className="text-xs font-medium text-neutral-200 group-hover:text-gold-soft">{p.label}</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-border bg-black/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 font-mono text-xs text-neutral-500">apex-engine — interactive shell</span>
          <span className="ml-auto flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${running ? 'bg-green-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">{running ? 'running' : 'idle'}</span>
          </span>
        </div>

        <div ref={scrollRef} className="h-80 overflow-y-auto bg-black px-4 py-3 font-mono text-[13px] leading-relaxed text-green-400/90">
          {logs.length === 0 && (
            <div className="text-neutral-600">
              <p>// Apex AI Research Terminal ready.</p>
              <p>// Type a command or pick a prompt above. Try: <span className="text-gold-soft">help</span></p>
            </div>
          )}
          {logs.map((l, i) => (
            <div key={i} className="animate-slidein whitespace-pre-wrap">
              {l.text.startsWith('>') ? (
                <span className="text-gold-soft">{l.text}</span>
              ) : (
                <span><span className="text-green-600/60">$</span> {l.text}</span>
              )}
            </div>
          ))}
          {running && <div className="mt-1 h-4 w-2 animate-blink bg-green-400/80" />}
        </div>

        {/* Input line */}
        <div className="flex items-center gap-2 border-t border-ink-border bg-black/60 px-4 py-3">
          <TerminalSquare size={16} className="text-gold-soft" />
          <span className="font-mono text-sm text-gold-soft">{'>'}</span>
          <input
            className="flex-1 bg-transparent font-mono text-sm text-green-400 outline-none placeholder:text-neutral-600"
            placeholder={running ? 'running…' : 'ask, search, scholarships, competitions, mentors, internships…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={running}
            autoFocus
          />
          <button onClick={run} disabled={running || !input.trim()} className="btn-gold px-3 py-1.5 text-xs disabled:opacity-40">
            {running ? <Loader2 size={13} className="animate-spin" /> : 'Run'}
          </button>
        </div>
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: 'Status', v: running ? 'Active' : 'Idle', accent: running },
          { k: 'Records', v: String(results.length), accent: results.length > 0 },
          { k: 'Gateway', v: 'Tavily /search', accent: true },
          { k: 'Ledger', v: 'localStorage', accent: true },
        ].map((s) => (
          <div key={s.k} className="card-2 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{s.k}</p>
            <p className={`mt-1 font-serif text-lg ${s.accent ? 'text-gold-soft' : 'text-neutral-300'}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-gold-soft" />
            <h2 className="font-serif text-lg font-semibold text-white">Synced Ledger Records</h2>
          </div>
          {results.length > 0 && (
            <button onClick={onClearResults} className="btn-ghost px-3 py-1.5 text-xs">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-border py-12 text-center">
            <p className="text-sm text-neutral-500">No records synced yet. Run a search command to populate this ledger.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {results.map((r) => (
              <div key={r.id} className="card-2 group p-4 transition-all duration-300 hover:border-gold/40 hover:shadow-gold">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-serif text-base font-medium text-white leading-snug">{r.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="chip chip-gold">{r.score}/100</span>
                    <span className="chip">{categoryLabel[r.category]}</span>
                  </div>
                </div>
                <p className="mb-2 text-[11px] text-gold-soft/80">{r.analysis}</p>
                <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-neutral-400">{r.content}</p>
                <div className="mb-3 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-md bg-black/40 py-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-neutral-500">Relevance</p>
                    <p className="font-mono text-xs text-neutral-200">{r.relevance}</p>
                  </div>
                  <div className="rounded-md bg-black/40 py-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-neutral-500">Prestige</p>
                    <p className="font-mono text-xs text-neutral-200">{r.prestige}</p>
                  </div>
                  <div className="rounded-md bg-black/40 py-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-neutral-500">Winnability</p>
                    <p className="font-mono text-xs text-neutral-200">{r.winnability}</p>
                  </div>
                  <div className="rounded-md bg-black/40 py-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-neutral-500">Need-Fit</p>
                    <p className="font-mono text-xs text-neutral-200">{r.needAlignment}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-green-400/80">
                    <ShieldCheck size={12} /> Verified source
                  </span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-gold-soft hover:text-white">
                    <ExternalLink size={12} /> Visit source
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
