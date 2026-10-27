import { useMemo, useState } from 'react';
import { Trophy, ExternalLink, Filter, Loader2, Search, MapPin, Sparkles } from 'lucide-react';
import type { ApexResult, OnboardingSurvey, Major } from '@/lib/types';
import { runTargetedSearch } from '@/lib/apex';

interface Props {
  survey: OnboardingSurvey | null;
  results: ApexResult[];
  onDeepResults: (results: ApexResult[]) => void;
}

type Tier = 'All' | 'Tier 1' | 'Tier 2' | 'Tier 3';

function inferTier(r: ApexResult): 'Tier 1' | 'Tier 2' | 'Tier 3' {
  const t = (r.title + ' ' + r.content).toLowerCase();
  if (/(national|international|olympiad|platinum|regeneron|sts|world|google code|usaco|intel|isef|broadcom)/.test(t)) return 'Tier 1';
  if (/(state|regional|symposium|summer|camp|program)/.test(t)) return 'Tier 2';
  return 'Tier 3';
}

function inferMajor(r: ApexResult): Major {
  const t = (r.title + ' ' + r.content).toLowerCase();
  if (t.includes('comput') || t.includes('usaco') || t.includes('code')) return 'Computer Science';
  if (t.includes('engineer') || t.includes('physics')) return 'Engineering';
  if (t.includes('bio') || t.includes('med') || t.includes('science talent')) return 'Pre-Med / Biology';
  if (t.includes('business') || t.includes('finance') || t.includes('econom') || t.includes('market')) return 'Business / Finance';
  if (t.includes('policy') || t.includes('government') || t.includes('debate')) return 'Political Science';
  if (t.includes('math') && t.includes('camp')) return 'Undeclared';
  return 'Undeclared';
}

export default function Competitions({ survey, results, onDeepResults }: Props) {
  const [tier, setTier] = useState<Tier>('All');
  const [major, setMajor] = useState<'All' | Major>('All');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('');

  const competitions = useMemo(() => results.filter((r) => r.category === 'competition'), [results]);

  const rows = useMemo(() => {
    return competitions
      .map((r) => ({ ...r, tier: inferTier(r), major: inferMajor(r) }))
      .filter((r) => (tier === 'All' || r.tier === tier) && (major === 'All' || r.major === major));
  }, [competitions, tier, major]);

  const deepSearch = async () => {
    if (!survey?.submitted) return;
    setSearching(true);
    setStatus('Running targeted competition search…');
    try {
      const out = await runTargetedSearch(survey, 'competition', undefined, location.trim() || undefined);
      onDeepResults(out);
      setStatus(`Found ${out.length} competition(s)${location.trim() ? ` near ${location.trim()}` : ''}.`);
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
        <h1 className="section-title">Competitions</h1>
        <p className="mt-1 text-sm text-neutral-400">Filterable by prestige tier and target major. Run a deep search to surface live competitions beyond Tier-1.</p>
      </div>

      {/* Deep search */}
      <div className="card p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-gold-soft" />
          <h2 className="font-serif text-base font-semibold text-white">Deep Competition Search</h2>
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
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Filter size={14} /> Filters
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Tier 1', 'Tier 2', 'Tier 3'] as Tier[]).map((t) => (
            <button key={t} onClick={() => setTier(t)} className={`chip ${tier === t ? 'chip-gold' : ''}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="w-40">
          <select className="input-field py-1.5 text-xs" value={major} onChange={(e) => setMajor(e.target.value as 'All' | Major)}>
            <option value="All">All Majors</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Pre-Med / Biology</option>
            <option>Business / Finance</option>
            <option>Political Science</option>
            <option>Undeclared</option>
            <option>Humanities</option>
            <option>Arts & Design</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-border px-5 py-4">
          <Trophy size={16} className="text-gold-soft" />
          <h2 className="font-serif text-lg font-semibold text-white">Competition Ledger</h2>
          <span className="ml-auto text-xs text-neutral-500">{rows.length} records</span>
        </div>
        {rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-neutral-500">
            No competition records match these filters. Run a deep search above to populate the ledger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-border text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Competition</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Prestige</th>
                  <th className="px-5 py-3 font-medium">Target Major</th>
                  <th className="px-5 py-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-border">
                {rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{r.title}</p>
                      <p className="mt-0.5 max-w-md text-xs text-neutral-500">{r.content.slice(0, 100)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="chip chip-gold text-[10px]">{r.score}/100</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`chip ${
                          r.tier === 'Tier 1' ? 'chip-gold' : r.tier === 'Tier 2' ? 'border-gold/30 text-gold-dim' : ''
                        }`}
                      >
                        {r.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-300">{r.major}</td>
                    <td className="px-5 py-3">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gold-soft hover:text-white">
                        <ExternalLink size={12} /> Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
