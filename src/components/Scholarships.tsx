import { useMemo, useState } from 'react';
import { Medal, ExternalLink, Filter, Lock, Loader2, Search, MapPin, Sparkles } from 'lucide-react';
import type { ApexResult, OnboardingSurvey } from '@/lib/types';
import { runTargetedSearch } from '@/lib/apex';

interface Props {
  survey: OnboardingSurvey | null;
  results: ApexResult[];
  onDeepResults: (results: ApexResult[]) => void;
}

type Winnability = 'All' | 'Very Easy' | 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';

function inferWinnability(r: ApexResult): Winnability {
  const t = (r.title + ' ' + r.content).toLowerCase();
  if (/(local|community|regional)/.test(t)) return 'Easy';
  if (/(national|international|prestigious|talent search|regeneron)/.test(t)) return 'Very Hard';
  if (/(merit|psat|coca-cola)/.test(t)) return 'Hard';
  if (/(questbridge|jack kent|need-based)/.test(t)) return 'Moderate';
  return 'Moderate';
}

function isNeedBased(r: ApexResult): boolean {
  return /need-based|questbridge|jack kent|coke|coca-cola|low-income|financial need|horatio|elks/i.test(r.title + ' ' + r.content);
}

const TAGS = ['Need-Based', 'Merit', 'STEM', 'Research', 'Leadership', 'Local', 'General'];

function inferTags(r: ApexResult): string[] {
  const t = (r.title + ' ' + r.content).toLowerCase();
  const tags: string[] = [];
  if (isNeedBased(r)) tags.push('Need-Based');
  if (/(merit|psat|coca-cola)/.test(t)) tags.push('Merit');
  if (/(stem|comput|engineer|math|science)/.test(t)) tags.push('STEM');
  if (/(research|talent search)/.test(t)) tags.push('Research');
  if (/(leadership|service)/.test(t)) tags.push('Leadership');
  if (/(local|community|regional|near)/.test(t)) tags.push('Local');
  if (tags.length === 0) tags.push('General');
  return tags;
}

export default function Scholarships({ survey, results, onDeepResults }: Props) {
  const [winnability, setWinnability] = useState<Winnability>('All');
  const [tag, setTag] = useState<string>('All');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('');

  const financialNeed = survey?.family.financialNeed ?? false;

  const scholarships = useMemo(() => {
    return results
      .filter((r) => r.category === 'scholarship')
      .filter((r) => (financialNeed ? true : !isNeedBased(r)));
  }, [results, financialNeed]);

  const filtered = useMemo(() => {
    return scholarships
      .map((r) => ({ ...r, win: inferWinnability(r), tags: inferTags(r) }))
      .filter((r) => (winnability === 'All' || r.win === winnability) && (tag === 'All' || r.tags.includes(tag)));
  }, [scholarships, winnability, tag]);

  const deepSearch = async () => {
    if (!survey?.submitted) return;
    setSearching(true);
    setStatus('Running targeted scholarship search…');
    try {
      const out = await runTargetedSearch(survey, 'scholarship', undefined, location.trim() || undefined);
      onDeepResults(out);
      setStatus(`Found ${out.length} scholarship(s)${location.trim() ? ` near ${location.trim()}` : ''}.`);
    } catch {
      setStatus('Search failed. Please try again.');
    } finally {
      setSearching(false);
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Resource Ledger</p>
        <h1 className="section-title">Scholarships</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Filter by winnability and tags. Run a deep search to surface live scholarships — add a location to find local awards. Need-based awards {financialNeed ? 'are visible' : 'are hidden'} per your family profile.
        </p>
      </div>

      {/* Deep search */}
      <div className="card p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-gold-soft" />
          <h2 className="font-serif text-base font-semibold text-white">Deep Scholarship Search</h2>
        </div>
        <p className="mb-3 text-xs text-neutral-500">
          Runs a live Tavily search scoped to your profile and optional location. Results are scored and merged into the ledger below.
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-ink-border bg-black/60 px-3 py-2">
            <MapPin size={14} className="text-gold-soft" />
            <input
              className="flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
              placeholder="Location (city, state or ZIP) — optional"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && deepSearch()}
            />
          </div>
          <button onClick={deepSearch} disabled={searching || !survey?.submitted} className="btn-gold disabled:opacity-40">
            {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {searching ? 'Searching…' : 'Deep Search'}
          </button>
        </div>
        {status && <p className="mt-2 text-xs text-gold-soft">{status}</p>}
        {!survey?.submitted && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
            <Lock size={11} /> Complete onboarding to enable deep search.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Filter size={14} /> Filters
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'] as Winnability[]).map((w) => (
            <button key={w} onClick={() => setWinnability(w)} className={`chip ${winnability === w ? 'chip-gold' : ''}`}>
              {w}
            </button>
          ))}
        </div>
        <div className="ml-2 flex flex-wrap gap-2">
          {['All', ...TAGS].map((t) => (
            <button key={t} onClick={() => setTag(t)} className={`chip ${tag === t ? 'chip-gold' : ''}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card py-12 text-center">
          {!financialNeed && results.some((r) => r.category === 'scholarship' && isNeedBased(r)) ? (
            <div className="mx-auto max-w-md">
              <Lock className="mx-auto mb-3 text-gold-dim" size={26} />
              <p className="text-sm text-neutral-400">
                Need-based scholarships are hidden because your family profile does not indicate financial need.
              </p>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No scholarships match these filters. Run a deep search above to populate the ledger.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className="card group p-5 transition-all duration-300 hover:border-gold/40 hover:shadow-gold">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-serif text-base font-medium text-white">{r.title}</h3>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="chip chip-gold text-[10px]">{r.score}/100</span>
                  <Medal size={18} className="text-gold-soft" />
                </div>
              </div>
              <p className="mb-1 text-[11px] text-gold-soft/80">{r.analysis}</p>
              <p className="mb-3 text-xs leading-relaxed text-neutral-400">{r.content}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span key={t} className="chip text-[10px]">{t}</span>
                ))}
                <span className="chip chip-gold text-[10px]">{r.win}</span>
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-gold-soft hover:text-white">
                <ExternalLink size={12} /> Apply / Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
