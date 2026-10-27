import { useMemo, useState } from 'react';
import { Mail, X, Copy, Check, MapPin, Search, Loader2, Lock, Trophy } from 'lucide-react';
import Modal from './Modal';
import { runApexSearch } from '@/lib/apex';
import type { ApexResult, OnboardingSurvey } from '@/lib/types';

interface Props {
  survey: OnboardingSurvey | null;
  results: ApexResult[];
}

interface MentorCard {
  id: string;
  name: string;
  field: string;
  affiliation: string;
  overview: string;
  location?: string;
  difficulty: 'Prestigious' | 'Selective' | 'Accessible';
  source: ApexResult;
}

function deriveMentors(results: ApexResult[]): MentorCard[] {
  return results
    .filter((r) => r.category === 'mentor' || r.category === 'internship')
    .map((r, i) => {
      const t = (r.title + ' ' + r.content).toLowerCase();
      let difficulty: MentorCard['difficulty'] = 'Selective';
      if (/(national|international|elite|top|prestigious|ivy|mit|stanford|harvard)/.test(t)) difficulty = 'Prestigious';
      else if (/(local|community|regional)/.test(t)) difficulty = 'Accessible';
      return {
        id: r.id,
        name: `Dr. Faculty ${i + 1}`,
        field: r.category === 'mentor' ? 'Research Mentorship' : 'Program Director',
        affiliation: r.title,
        overview: r.content,
        difficulty,
        source: r,
      };
    });
}

const BUILTIN_MENTORS: MentorCard[] = [
  {
    id: 'm-seed-1',
    name: 'Dr. Elena Marsh',
    field: 'Computational Biology',
    affiliation: 'Stanford University — Dept. of Genetics',
    overview:
      'Research focuses on gene-expression networks in rare cancers. Runs a summer mentorship for high school researchers with prior programming exposure. Accepts 2–3 students per cycle.',
    difficulty: 'Prestigious',
    source: { id: 'seed-1', title: 'Stanford — Marsh Lab', url: 'https://example.com/marsh-lab', content: 'Computational biology mentorship.', category: 'mentor', score: 70, relevance: 80, prestige: 85, winnability: 55, needAlignment: 50, analysis: 'Mentor program aligned to student interests.' },
  },
  {
    id: 'm-seed-2',
    name: 'Prof. Daniel Cho',
    field: 'Applied Mathematics',
    affiliation: 'MIT — Department of Mathematics',
    overview:
      'Works on numerical methods for PDEs. Coordinates MIT PRIMES-adjacent reading groups. Recommends students with strong calculus and a curiosity for proofs.',
    difficulty: 'Prestigious',
    source: { id: 'seed-2', title: 'MIT — Cho Group', url: 'https://example.com/cho-group', content: 'Applied math mentorship.', category: 'mentor', score: 70, relevance: 80, prestige: 85, winnability: 55, needAlignment: 50, analysis: 'Mentor program aligned to student interests.' },
  },
  {
    id: 'm-seed-3',
    name: 'Dr. Priya Nair',
    field: 'Public Policy & Economics',
    affiliation: 'Harvard Kennedy School',
    overview:
      'Studies education finance policy. Mentors a small cohort each fall through the Kennedy School youth policy lab. Values applicants with community service backgrounds.',
    difficulty: 'Prestigious',
    source: { id: 'seed-3', title: 'Harvard — Nair Policy Lab', url: 'https://example.com/nair-lab', content: 'Public policy mentorship.', category: 'mentor', score: 70, relevance: 80, prestige: 85, winnability: 55, needAlignment: 50, analysis: 'Mentor program aligned to student interests.' },
  },
  {
    id: 'm-seed-4',
    name: 'Prof. Marcus Webb',
    field: 'Mechanical Engineering',
    affiliation: 'Georgia Tech — School of ME',
    overview:
      'Robotics and soft-actuation research. Hosts high school researchers through the GT PRISM summer program; expects a short project proposal with first contact.',
    difficulty: 'Selective',
    source: { id: 'seed-4', title: 'Georgia Tech — Webb Lab', url: 'https://example.com/webb-lab', content: 'Mechanical engineering mentorship.', category: 'mentor', score: 70, relevance: 80, prestige: 85, winnability: 55, needAlignment: 50, analysis: 'Mentor program aligned to student interests.' },
  },
];

const difficultyStyle: Record<MentorCard['difficulty'], string> = {
  Prestigious: 'border-gold/50 bg-gold/10 text-gold-soft',
  Selective: 'border-ink-border bg-black/40 text-neutral-300',
  Accessible: 'border-green-500/30 bg-green-500/5 text-green-300',
};

export default function Mentors({ survey, results }: Props) {
  const live = useMemo(() => deriveMentors(results), [results]);
  const all = useMemo(() => {
    const map = new Map<string, MentorCard>();
    [...BUILTIN_MENTORS, ...live].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [live]);

  const [draftMentor, setDraftMentor] = useState<MentorCard | null>(null);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  // Location search — NOT persisted to localStorage
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [localMentors, setLocalMentors] = useState<MentorCard[]>([]);
  const [searched, setSearched] = useState(false);

  const openDraft = (m: MentorCard) => {
    const name = survey?.name || 'Student';
    const focus = survey?.researchFocus || survey?.major || 'your field';
    setDraftMentor(m);
    setDraft(
      `Dear ${m.name},\n\nMy name is ${name}, and I am a high school student passionate about ${focus}. I came across your work at ${m.affiliation}${m.location ? ` in ${m.location}` : ''} and was particularly drawn to your research in ${m.field}.\n\n${m.overview.split('.')[0]}.\n\nI would be honored to learn whether you accept high school researchers for the upcoming cycle, and I would be glad to share a short project proposal or transcript at your convenience.\n\nThank you for your time,\n${name}`
    );
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard?.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const searchLocal = async () => {
    if (!location.trim() || !survey?.submitted) return;
    setSearching(true);
    setSearched(true);
    try {
      const q = `university professors research mentor high school students near ${location.trim()}`;
      const out = await runApexSearch(
        { ...survey, researchFocus: q, ecSpecifics: q },
        () => {}
      );
      const mapped = out
        .filter((r) => r.category === 'mentor' || r.category === 'internship' || r.category === 'general')
        .map((r, i) => {
          const t = (r.title + ' ' + r.content).toLowerCase();
          let difficulty: MentorCard['difficulty'] = 'Selective';
          if (/(national|international|elite|top|prestigious|ivy|mit|stanford|harvard)/.test(t)) difficulty = 'Prestigious';
          else if (/(local|community|regional|near)/.test(t)) difficulty = 'Accessible';
          return {
            id: `local-${r.id}`,
            name: `Professor ${i + 1}`,
            field: 'Local Research',
            affiliation: r.title,
            overview: r.content,
            location: location.trim(),
            difficulty,
            source: r,
          } as MentorCard;
        });
      setLocalMentors(mapped);
    } catch {
      setLocalMentors([]);
    } finally {
      setSearching(false);
    }
  };

  const combined = useMemo(() => {
    const map = new Map<string, MentorCard>();
    [...all, ...localMentors].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [all, localMentors]);

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Resource Ledger</p>
        <h1 className="section-title">Mentors</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Hover any faculty card to expand their research overview and draft a cold email. Search by location to find local professors — your location is never saved.
        </p>
      </div>

      {/* Location search — ephemeral, not persisted */}
      <div className="card p-5">
        <div className="mb-2 flex items-center gap-2">
          <MapPin size={15} className="text-gold-soft" />
          <h2 className="font-serif text-base font-semibold text-white">Find Local Professors</h2>
          <span className="ml-auto text-[10px] text-neutral-500">Location not saved</span>
        </div>
        <p className="mb-3 text-xs text-neutral-500">
          Enter your city or ZIP to surface professors and research programs near you. This runs a live Tavily search and is never stored.
        </p>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="e.g. Memphis, TN or 38017"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLocal()}
          />
          <button onClick={searchLocal} disabled={!location.trim() || searching || !survey?.submitted} className="btn-gold disabled:opacity-40">
            {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {searching ? 'Searching…' : 'Search Local'}
          </button>
        </div>
        {!survey?.submitted && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
            <Lock size={11} /> Complete onboarding to enable local search.
          </p>
        )}
      </div>

      {/* Mentor grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {combined.map((m) => (
          <div
            key={m.id}
            className="card group relative overflow-hidden p-5 transition-all duration-500 hover:border-gold/50 hover:shadow-gold"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-serif text-base font-semibold text-gold-soft">
                  {m.name.split(' ').slice(-1)[0][0]}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-base font-semibold text-white">{m.name}</h3>
                  <p className="truncate text-xs text-gold-soft">{m.field}</p>
                </div>
              </div>
              <span className={`chip shrink-0 text-[10px] ${difficultyStyle[m.difficulty]}`}>
                {m.difficulty === 'Prestigious' && <Trophy size={9} className="mr-1" />}
                {m.difficulty}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-500">{m.affiliation}</p>
            {m.location && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-gold-dim">
                <MapPin size={10} /> Near {m.location}
              </p>
            )}

            {/* Expand-on-hover */}
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-3 text-sm leading-relaxed text-neutral-300">{m.overview}</p>
                <button onClick={() => openDraft(m)} className="btn-gold mt-4 w-full py-2 text-sm animate-glowpulse">
                  <Mail size={14} /> Draft Cold Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {combined.length === 0 && (
        <div className="card py-12 text-center text-sm text-neutral-500">
          {searched ? 'No local mentors found. Try a broader location.' : 'Run the Apex AI terminal to surface mentor records, or search by location above.'}
        </div>
      )}

      <Modal open={!!draftMentor} onClose={() => setDraftMentor(null)} title="Cold Email Draft" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="chip chip-gold">{draftMentor?.field}</span>
            <span>{draftMentor?.affiliation}</span>
          </div>
          <textarea
            className="input-field min-h-[260px] font-sans text-sm leading-relaxed"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <a href={draftMentor?.source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-soft hover:text-white">
              Open mentor source →
            </a>
            <div className="flex gap-2">
              <button className="btn-ghost px-4 py-2 text-sm" onClick={() => setDraftMentor(null)}>
                <X size={14} /> Close
              </button>
              <button className="btn-gold px-4 py-2 text-sm" onClick={copy}>
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
