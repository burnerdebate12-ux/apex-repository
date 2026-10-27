import { useState } from 'react';
import { Building2, Plus, ChevronRight, X, Trophy, Star, DollarSign, BookOpen, FileText, Users, GraduationCap, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import Modal from './Modal';
import type { TrackedCollege, AppStage, OnboardingSurvey, CollegeChecklist } from '@/lib/types';
import { APP_STAGES } from '@/lib/types';
import { nextStage, emptyChecklist } from '@/lib/store';

interface Props {
  survey: OnboardingSurvey | null;
  colleges: TrackedCollege[];
  onSave: (c: TrackedCollege[]) => void;
  onUpdateChecklist: (id: string, key: keyof CollegeChecklist, value: boolean) => void;
}

interface CollegePreset {
  name: string;
  tier1: { item: string; detail: string }[];
  tier2: { item: string; detail: string }[];
  ap: string;
  apDetail: string;
  aid: string;
  aidScore: number;
  satRange: string;
  actRange: string;
  gpaRange: string;
  acceptanceRate: string;
  essays: string;
  interview: string;
  letters: string;
  supplementals: string;
  specialPrograms: string;
  overview: string;
}

const COLLEGE_PRESETS: CollegePreset[] = [
  {
    name: 'Harvard University',
    overview: 'The oldest U.S. university and the most selective. Harvard seeks students who will be leaders in their fields, not just strong students. Demonstrated impact at a national or international level matters more than raw stats.',
    tier1: [
      { item: 'USACO Platinum / IOI', detail: 'Top-tier algorithmic competition — signals elite quantitative ability. Most admitted CS applicants have Silver or higher.' },
      { item: 'Regeneron STS Top 300', detail: 'National science research recognition. Top 300 is meaningful; Top 40 is extraordinary. Published research is a strong alternative.' },
      { item: 'Published research (peer-reviewed)', detail: 'Co-authorship on a peer-reviewed paper or preprint with a university mentor demonstrates genuine scholarship.' },
    ],
    tier2: [
      { item: 'Student body president', detail: 'Elected school-wide leadership. Shows you can mobilize peers and hold a mandate.' },
      { item: 'Captain of varsity sport', detail: 'Demonstrates commitment, teamwork, and time management over multiple seasons.' },
      { item: 'Founded a registered nonprofit', detail: 'Sustained community impact with organizational leadership. Must show real outcomes, not just registration.' },
    ],
    ap: 'Avg 5 on 8+ AP exams',
    apDetail: 'Harvard expects breadth and depth. Aim for 8+ APs across humanities, STEM, and your intended major. Scores of 5 are the norm among admitted students. Calc BC is expected for STEM.',
    aid: '100% demonstrated need met, no loans',
    aidScore: 5,
    satRange: '1480–1580',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~3.4%',
    essays: 'Personal statement + Harvard supplemental essays (varies by year). Expect short-answer questions about your intellectual life, community, and future.',
    interview: 'Alumni interview offered in many regions. Not evaluative in the formal sense but a positive interview can help at the margin.',
    letters: '2 teacher recommendations (core academic subjects) + counselor letter. Teachers should speak to your intellectual engagement, not just grades.',
    supplementals: 'Optional portfolio submissions for arts, music, and research. Submit only if exceptional.',
    specialPrograms: 'No separate programs for high school students, but summer research at Harvard labs is a known signal.',
  },
  {
    name: 'Stanford University',
    overview: 'Stanford values intellectual vitality and entrepreneurial spirit. The "Stanford letter to roommate" essay is famous — they want to know who you are, not just what you achieved. Innovation and impact at scale are rewarded.',
    tier1: [
      { item: 'USACO Platinum', detail: 'Stanford CS admissions heavily weight competitive programming. Platinum division is the strongest signal.' },
      { item: 'ISEF Grand Award', detail: 'Intel International Science and Engineering Fair top placement. Category awards count; Best in Fair is exceptional.' },
      { item: 'Founded venture with traction', detail: 'A real company with users or revenue demonstrates Stanford entrepreneurial DNA. A pitch deck alone is not enough.' },
    ],
    tier2: [
      { item: 'Research internship w/ publication', detail: 'Stanford-affiliated labs or any university research with a publication or presentation.' },
      { item: 'Varsity athletics at state level', detail: 'Stanford is a D1 athletic powerhouse. State-level placement in any sport is meaningful.' },
      { item: 'Lead role in national club', detail: 'National officer in DECA, FBLA, Model UN, or similar. Shows you can lead beyond your school.' },
    ],
    ap: 'Avg 5 on 7+ AP exams',
    apDetail: 'Stanford wants to see you challenge yourself within your school context. 7+ APs with mostly 5s is typical. They consider what courses were available to you.',
    aid: 'Full need met for families under $100k',
    aidScore: 5,
    satRange: '1470–1570',
    actRange: '32–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~3.7%',
    essays: 'Personal statement + Stanford supplements including the famous "letter to your roommate" and "what matters to you and why." Be authentic, not strategic.',
    interview: 'Alumni interview offered in some regions. Optional but recommended where available.',
    letters: '2 teacher recommendations + counselor letter. One STEM and one humanities teacher is the ideal spread.',
    supplementals: 'Optional arts portfolio and research supplement. Submit only at a high level.',
    specialPrograms: 'Stanford Pre-Collegiate Summer Institutes and SUMaC are signals but do not guarantee admission.',
  },
  {
    name: 'MIT',
    overview: 'MIT is the premier STEM institution. They value hands-on building, problem-solving, and collaboration. The "maker" culture is real — students who build things (robots, apps, rockets) stand out. Pure GPA/stars are not enough; you must show you love doing the work.',
    tier1: [
      { item: 'USACO Platinum / IOI', detail: 'The single strongest CS signal for MIT. IOI team membership is nearly a guaranteed-look. Platinum is the baseline.' },
      { item: 'Maker portfolio w/ national recognition', detail: 'MIT has a dedicated maker portfolio submission. Projects that won national awards or got press attention are powerful.' },
      { item: 'Regeneron STS', detail: 'Science Talent Search. Top 300 is meaningful; semifinalist and above is a strong signal.' },
    ],
    tier2: [
      { item: 'Math Olympiad (USAMO)', detail: 'USA Mathematical Olympiad qualifier. Signals elite mathematical reasoning.' },
      { item: 'Robotics team captain (FRC)', detail: 'FIRST Robotics Competition team leadership. MIT values the build-and-compete culture.' },
      { item: 'Published side project w/ press', detail: 'An app, tool, or hardware project that gained real users or media attention.' },
    ],
    ap: 'Avg 5 on 6+ AP exams (Calc BC expected)',
    apDetail: 'For STEM applicants, AP Calculus BC with a 5 is essentially required. AP Physics C is strongly preferred over Physics 1. 6+ APs total is typical.',
    aid: 'Full need met for families under $140k',
    aidScore: 5,
    satRange: '1510–1580',
    actRange: '34–36',
    gpaRange: '3.95+ (weighted)',
    acceptanceRate: '~4.5%',
    essays: 'Personal statement + MIT-specific short essays. They ask about your world, how you collaborate, and what you build. Be concrete, not abstract.',
    interview: 'Educational Counselors (alumni) interview most applicants. This is a meaningful part of the process — prepare to talk about projects.',
    letters: '1 math/science teacher + 1 humanities/language teacher + counselor letter. The STEM letter is critical.',
    supplementals: 'Maker portfolio (strongly encouraged for builders). Research supplement if applicable. Arts portfolio optional.',
    specialPrograms: 'MIT PRIMES, RSI (Research Science Institute), and MITES are elite pipeline programs. RSI admission is perhaps the strongest single signal.',
  },
  {
    name: 'Princeton University',
    overview: 'Princeton values intellectual depth and independent work. The senior thesis is the centerpiece of a Princeton education, so they look for students who already show scholarly habits. Strong writing and sustained intellectual curiosity are rewarded.',
    tier1: [
      { item: 'Published research', detail: 'Any peer-reviewed or mentored research output. Princeton values independent scholarship above all.' },
      { item: 'IMO / USAMO', detail: 'International Mathematical Olympiad or USAMO qualification. Princeton math is world-class; this is the strongest signal.' },
      { item: 'National debate champion', detail: 'TOC (Tournament of Champions) level placement. Princeton has a deep debate and policy tradition.' },
    ],
    tier2: [
      { item: 'Class president', detail: 'Demonstrates peer trust and organizational leadership over time.' },
      { item: 'Lead in major school production', detail: 'Theater, music, or arts leadership. Princeton values the arts highly for a research university.' },
      { item: 'Community nonprofit founder', detail: 'Sustained service with measurable impact. Princeton has a strong service ethic (Princeton in the Nation\'s Service).' },
    ],
    ap: 'Avg 5 on 7+ AP exams',
    apDetail: 'Princeton expects a rigorous curriculum. 7+ APs with mostly 5s. They value writing-heavy APs (Lang, Lit, History) alongside STEM.',
    aid: 'Full need met; no-loan policy',
    aidScore: 5,
    satRange: '1460–1570',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~4%',
    essays: 'Personal statement + Princeton supplements. They ask about your voice, your extracurriculars in detail, and a "favorite" (book, source, etc.).',
    interview: 'Alumni interview (Bric-a-Brac). Offered in most regions. Conversational, not adversarial.',
    letters: '2 teacher recommendations + counselor letter. One should be from a humanities or writing teacher given the thesis requirement.',
    supplementals: 'Optional arts, music, and research supplements. Graded paper submission may be requested.',
    specialPrograms: 'Princeton Summer Journalism Program and Laboratory Learning Program are signals but not pipelines.',
  },
  {
    name: 'Yale University',
    overview: 'Yale values broad intellectualism and community engagement. The residential college system shapes the culture — they want students who will contribute to a close community. Strong writing, arts, and public service are all valued alongside STEM.',
    tier1: [
      { item: 'Regeneron STS', detail: 'Science Talent Search recognition. Top 300 or above is a strong signal at Yale.' },
      { item: 'National arts/portfolio recognition', detail: 'Scholastic Art & Writing Awards gold key, national portfolio day, or similar national arts recognition.' },
      { item: 'Published humanities research', detail: 'Research in history, literature, or social science with a mentor. Yale values humanities scholarship unusually highly.' },
    ],
    tier2: [
      { item: 'Editor-in-chief of school paper', detail: 'Yale has a legendary journalism tradition (Yale Daily News). Student journalism leadership is a known signal.' },
      { item: 'Model UN national award', detail: 'YMUN or national circuit awards. Yale is a top Model UN school.' },
      { item: 'Varsity captain', detail: 'Any sport, multiple seasons. Yale values athletic leadership for community building.' },
    ],
    ap: 'Avg 5 on 7+ AP exams',
    apDetail: 'Yale wants balance. 7+ APs with 5s across STEM and humanities. AP US History and AP English are well-regarded given Yale culture.',
    aid: 'Full need met for families under $75k',
    aidScore: 5,
    satRange: '1460–1570',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~4.5%',
    essays: 'Personal statement + Yale supplements including "Why Yale" and short takes. They want to see how you will use the residential college system.',
    interview: 'Alumni interview (Senior Interviewers in some regions). Conversational, meant to gauge fit.',
    letters: '2 teacher recommendations + counselor letter. Yale values letters that speak to character and community contribution.',
    supplementals: 'Optional arts supplement (strongly encouraged for arts applicants). Research supplement optional.',
    specialPrograms: 'Yale Young Global Scholars (YYGS) is a signal but not a pipeline. Yale summer drama program for arts students.',
  },
  {
    name: 'Columbia University',
    overview: 'Columbia values intellectual rigor and the core curriculum. The Core is famous — every student reads the same foundational texts. They want students who will engage deeply with the Western canon and New York City as a learning laboratory.',
    tier1: [
      { item: 'Published research', detail: 'Any mentored research output. Columbia has strong STEM and humanities research expectations.' },
      { item: 'Pulitzer-level student journalism', detail: 'Columbia Journalism School is legendary. Student journalism at a national award level is a powerful signal.' },
      { item: 'USACO Platinum', detail: 'For CS/engineering applicants. Columbia CS is growing in selectivity.' },
    ],
    tier2: [
      { item: 'Editor of major publication', detail: 'School newspaper, literary magazine, or online publication with real readership.' },
      { item: 'Citywide leadership role', detail: 'Leadership in a NYC or major-metro organization. Columbia values urban engagement.' },
      { item: 'Founder of community org', detail: 'Sustained community impact, especially in an urban context.' },
    ],
    ap: 'Avg 5 on 6+ AP exams',
    apDetail: 'Columbia values the Core, so writing-heavy APs (Lang, Lit, World History, Euro) are well-regarded alongside STEM. 6+ APs is typical.',
    aid: 'Full need met for families under $100k',
    aidScore: 4,
    satRange: '1470–1570',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~3.9%',
    essays: 'Personal statement + Columbia supplements including lists (books, media, events) and essays on the Core and NYC. The lists matter — be genuine.',
    interview: 'Alumni interview offered in many regions. Be prepared to discuss books and current events.',
    letters: '2 teacher recommendations + counselor letter. One from a humanities teacher is important given the Core.',
    supplementals: 'Optional research and arts supplements. Columbia has a strong research culture.',
    specialPrograms: 'Columbia Science Honors Program and summer programs are signals. The Dual BA program with Sciences Po is a separate application.',
  },
  {
    name: 'University of Pennsylvania',
    overview: 'Penn values pre-professional drive and interdisciplinary work. Wharton is the premier undergraduate business program. Penn wants students who know what they want to do and have already started doing it. "Well-rounded" matters less than "pointy" here.',
    tier1: [
      { item: 'Wharton summer program w/ distinction', detail: 'LBW (Leadership in the Business World) or similar with high marks. Signals Wharton fit.' },
      { item: 'Published research', detail: 'Research in any field with a mentor. Penn has strong research across disciplines.' },
      { item: 'USACO Platinum', detail: 'For M&T (Management & Technology) or SEAS applicants. The M&T program is extremely competitive.' },
    ],
    tier2: [
      { item: 'DECA / FBLA national placement', detail: 'Top 10 at ICDC or NLC. Wharton values demonstrated business competition success.' },
      { item: 'Founded business w/ revenue', detail: 'Real venture with customers. Penn is the most entrepreneurial Ivy.' },
      { item: 'Student government president', detail: 'Penn values visible leadership. Elected school-wide office is a strong signal.' },
    ],
    ap: 'Avg 5 on 7+ AP exams',
    apDetail: 'For Wharton: AP Macro, Micro, Calc BC, and Stats are expected. For SEAS: Calc BC, Physics C, Chem. For CAS: broad APs across disciplines. 7+ APs typical.',
    aid: 'Full need met for families under $85k',
    aidScore: 4,
    satRange: '1470–1570',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~5.8%',
    essays: 'Personal statement + Penn supplements including "Why Penn" and school-specific essays. The "Why" must be specific — name programs, professors, clubs.',
    interview: 'Alumni interview offered in most regions. Penn interviews matter — they gauge fit and interest.',
    letters: '2 teacher recommendations + counselor letter. For Wharton, a math or economics teacher is ideal.',
    supplementals: 'Optional research, arts supplements. Wharton does not require but rewards business experience.',
    specialPrograms: 'LBW (Wharton summer), M&T program, Vagelos LSM (Life Sciences & Management), and coordinated dual-degree programs are separate, more competitive applications.',
  },
  {
    name: 'Brown University',
    overview: 'Brown is famous for its open curriculum — no required courses. They want self-directed students who will design their own education. The PLME (Program in Liberal Medical Education) is the most competitive combined BA/MD program in the country.',
    tier1: [
      { item: 'Regeneron STS', detail: 'Science research recognition. Top 300 or above is a strong signal, especially for PLME.' },
      { item: 'Published research', detail: 'Any mentored research. Brown values independent inquiry highly given the open curriculum.' },
      { item: 'National arts recognition', detail: 'Scholastic Art & Writing gold, national portfolio recognition, or similar.' },
    ],
    tier2: [
      { item: 'Community org founder', detail: 'Sustained service with impact. Brown has a strong service culture.' },
      { item: 'Varsity captain', detail: 'Athletic leadership. Brown values the scholar-athlete.' },
      { item: 'Open-curriculum-aligned project', detail: 'A self-designed project or independent study that shows you can direct your own learning — this is what Brown is built for.' },
    ],
    ap: 'Avg 5 on 6+ AP exams',
    apDetail: 'Brown values intellectual breadth given the open curriculum. 6+ APs across disciplines with 5s. They care less about a specific pattern and more about genuine curiosity.',
    aid: 'Full need met; no-loan for low income',
    aidScore: 4,
    satRange: '1460–1570',
    actRange: '33–35',
    gpaRange: '3.9+ (weighted)',
    acceptanceRate: '~5%',
    essays: 'Personal statement + Brown supplements including "Why Brown" and the open curriculum essay. You must explain how you will use the freedom.',
    interview: 'Alumni interview offered in many regions. Conversational, gauges intellectual curiosity.',
    letters: '2 teacher recommendations + counselor letter. Letters that show intellectual independence are prized.',
    supplementals: 'Optional arts and research supplements. PLME requires a separate, additional essay.',
    specialPrograms: 'PLME (BA/MD) is the crown jewel — a separate, far more competitive application. Brown|RISD Dual Degree is also separate. Summer@Brown is a signal but not a pipeline.',
  },
];

export default function CollegePlanner({ colleges, onSave, onUpdateChecklist }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [benchOpen, setBenchOpen] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const preset = COLLEGE_PRESETS.find((p) => p.name === benchOpen) ?? null;
  const checklistCollege = colleges.find((c) => c.id === checklistOpen) ?? null;

  const addCollege = (name: string) => {
    const c: TrackedCollege = { id: `col-${Date.now()}`, name, stage: 'Wishlist', notes: '', checklist: emptyChecklist() };
    onSave([...colleges, c]);
    setCustomName('');
    setCustomNotes('');
    setAddOpen(false);
  };

  const advance = (id: string) => onSave(colleges.map((c) => (c.id === id ? { ...c, stage: nextStage(c.stage) } : c)));
  const setStage = (id: string, stage: AppStage) => onSave(colleges.map((c) => (c.id === id ? { ...c, stage } : c)));
  const remove = (id: string) => onSave(colleges.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Track</p>
          <h1 className="section-title">Ivy League College Planner</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Track target schools across an application milestone board. Open any card for full admission requirements.
          </p>
        </div>
        <button className="btn-gold" onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add Dream School
        </button>
      </div>

      {/* Pipeline */}
      {colleges.length === 0 ? (
        <div className="card py-16 text-center">
          <Building2 className="mx-auto mb-3 text-gold-dim" size={28} />
          <p className="text-sm text-neutral-400">No colleges tracked yet. Add a dream school to begin.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-5">
          <div className="flex gap-4 min-w-max">
            {APP_STAGES.map((stage) => {
              const inStage = colleges.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="w-64 shrink-0">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stage === 'Accepted' ? 'bg-gold' : 'bg-gold/40'}`} />
                    <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-neutral-300">{stage}</h3>
                    <span className="ml-auto text-xs text-neutral-600">{inStage.length}</span>
                  </div>
                  <div className="space-y-2">
                    {inStage.map((c) => {
                      const presetData = COLLEGE_PRESETS.find((p) => p.name === c.name);
                      return (
                        <div key={c.id} className="card-2 group p-3 transition-all hover:border-gold/40 hover:shadow-gold">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-serif text-sm font-medium text-white">{c.name}</p>
                            <button onClick={() => remove(c.id)} className="text-neutral-600 hover:text-red-400" aria-label="Remove">
                              <X size={13} />
                            </button>
                          </div>
                          {presetData && (
                            <p className="mt-1 text-[10px] text-neutral-600">Accept rate {presetData.acceptanceRate} · SAT {presetData.satRange}</p>
                          )}
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="h-1.5 overflow-hidden rounded-full bg-ink-muted">
                                  <div className="h-full rounded-full bg-gold/70" style={{ width: `${computeChance(c.checklist)}%` }} />
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-gold-soft">{computeChance(c.checklist)}%</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-1.5">
                            <select
                              value={c.stage}
                              onChange={(e) => setStage(c.id, e.target.value as AppStage)}
                              className="flex-1 rounded-md border border-ink-border bg-black/60 px-2 py-1 text-[11px] text-neutral-300"
                            >
                              {APP_STAGES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            {c.stage !== 'Accepted' && (
                              <button onClick={() => advance(c.id)} className="grid h-6 w-6 place-items-center rounded-md border border-gold/40 bg-gold/10 text-gold-soft transition hover:gold-glow" title="Advance stage">
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            {presetData && (
                              <button onClick={() => setBenchOpen(presetData.name)} className="text-[10px] text-gold-soft hover:text-white">
                                Requirements →
                              </button>
                            )}
                            <button onClick={() => setChecklistOpen(c.id)} className="text-[10px] text-neutral-400 hover:text-gold-soft">
                              Checklist ({Object.values(c.checklist).filter(Boolean).length}/10)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {inStage.length === 0 && (
                      <div className="rounded-xl border border-dashed border-ink-border py-6 text-center text-[11px] text-neutral-600">Empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a Dream School">
        <div className="space-y-4">
          <div>
            <label className="label-field">Quick add — Ivy presets</label>
            <div className="grid grid-cols-2 gap-2">
              {COLLEGE_PRESETS.map((p) => (
                <button key={p.name} onClick={() => addCollege(p.name)} className="card-2 px-3 py-2 text-left text-xs text-neutral-300 transition hover:border-gold/40 hover:text-gold-soft">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-field">Or add a custom school</label>
            <input className="input-field" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Vanderbilt University" />
          </div>
          <div>
            <label className="label-field">Notes (optional)</label>
            <textarea className="input-field min-h-[70px]" value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} placeholder="Why this school? Specific program of interest…" />
          </div>
          <div className="flex justify-end">
            <button onClick={() => customName.trim() && addCollege(customName.trim())} disabled={!customName.trim()} className="btn-gold disabled:opacity-40">
              Add to Wishlist
            </button>
          </div>
        </div>
      </Modal>

      {/* Full requirements modal */}
      <Modal open={!!benchOpen} onClose={() => setBenchOpen(null)} title="Admission Requirements" maxWidth="max-w-3xl">
        {preset && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10">
                <Building2 className="text-gold-soft" size={18} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">{preset.name}</h3>
                <p className="text-xs text-neutral-500">{preset.overview}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Accept Rate" value={preset.acceptanceRate} />
              <Stat label="SAT Range" value={preset.satRange} />
              <Stat label="ACT Range" value={preset.actRange} />
              <Stat label="GPA" value={preset.gpaRange} />
            </div>

            {/* Tier 1 */}
            <div className="card-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Trophy size={15} className="text-gold-soft" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-soft">Tier 1 — Required Extracurricular Achievements</h4>
              </div>
              <div className="space-y-3">
                {preset.tier1.map((t, i) => (
                  <div key={i} className="border-l-2 border-gold/40 pl-3">
                    <p className="text-sm font-medium text-white">{t.item}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier 2 */}
            <div className="card-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Star size={15} className="text-gold-dim" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Tier 2 — Leadership Signals</h4>
              </div>
              <div className="space-y-3">
                {preset.tier2.map((t, i) => (
                  <div key={i} className="border-l-2 border-gold/30 pl-3">
                    <p className="text-sm font-medium text-white">{t.item}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AP + Aid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-2 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen size={15} className="text-gold-soft" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-soft">AP Profile</h4>
                </div>
                <p className="text-sm font-medium text-white">{preset.ap}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{preset.apDetail}</p>
              </div>
              <div className="card-2 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign size={15} className="text-green-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400">Financial Aid</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={`h-2 w-6 rounded-sm ${n <= preset.aidScore ? 'bg-gold' : 'bg-ink-muted'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">{preset.aidScore}/5</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">{preset.aid}</p>
              </div>
            </div>

            {/* Essays + Interview + Letters + Programs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailBlock icon={FileText} title="Essays" body={preset.essays} />
              <DetailBlock icon={Users} title="Interview" body={preset.interview} />
              <DetailBlock icon={GraduationCap} title="Recommendations" body={preset.letters} />
              <DetailBlock icon={BookOpen} title="Supplementals" body={preset.supplementals} />
            </div>

            <div className="card-2 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Building2 size={15} className="text-gold-soft" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-soft">Special Programs & Pipeline Signals</h4>
              </div>
              <p className="text-xs leading-relaxed text-neutral-400">{preset.specialPrograms}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Checklist modal */}
      <Modal open={!!checklistCollege} onClose={() => setChecklistOpen(null)} title={`${checklistCollege?.name ?? ''} — Application Checklist`} maxWidth="max-w-xl">
        {checklistCollege && (
          <div className="space-y-5">
            <div className="rounded-xl border border-ink-border bg-black/40 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp size={16} className="text-gold-soft" />
                <h4 className="text-sm font-semibold text-white">Estimated Admission Readiness</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-ink-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-500"
                      style={{ width: `${computeChance(checklistCollege.checklist)}%` }}
                    />
                  </div>
                </div>
                <span className="font-serif text-lg font-semibold text-gold-soft">{computeChance(checklistCollege.checklist)}%</span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Every item you check off increases your estimated readiness. This is a motivational gauge, not a guarantee.
              </p>
            </div>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map(({ key, label, icon: Icon }) => {
                const done = checklistCollege.checklist[key];
                return (
                  <button
                    key={key}
                    onClick={() => onUpdateChecklist(checklistCollege.id, key, !done)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      done
                        ? 'border-gold/40 bg-gold/10 text-gold-soft'
                        : 'border-ink-border bg-black/40 text-neutral-300 hover:border-gold/30'
                    }`}
                  >
                    {done ? <CheckCircle2 size={18} className="text-gold-soft" /> : <Circle size={18} className="text-neutral-600" />}
                    <Icon size={15} className={done ? 'text-gold-soft' : 'text-neutral-500'} />
                    <span className="text-sm">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function computeChance(checklist: CollegeChecklist): number {
  const items = Object.values(checklist);
  const checked = items.filter(Boolean).length;
  const base = 5;
  const bonus = (checked / items.length) * 85;
  return Math.round(base + bonus);
}

const CHECKLIST_ITEMS: { key: keyof CollegeChecklist; label: string; icon: typeof Trophy }[] = [
  { key: 'gpa', label: 'Target GPA achieved', icon: Star },
  { key: 'satAct', label: 'SAT/ACT in range', icon: BookOpen },
  { key: 'apCourses', label: 'AP courses complete', icon: GraduationCap },
  { key: 'tier1', label: 'Tier-1 EC achieved', icon: Trophy },
  { key: 'tier2', label: 'Tier-2 leadership', icon: Star },
  { key: 'essays', label: 'Essays drafted', icon: FileText },
  { key: 'letters', label: 'Recommendations secured', icon: Users },
  { key: 'interview', label: 'Interview prep done', icon: Users },
  { key: 'supplementals', label: 'Supplementals submitted', icon: FileText },
  { key: 'financialAid', label: 'Financial aid filed (FAFSA/CSS)', icon: DollarSign },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-2 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 font-serif text-sm text-gold-soft">{value}</p>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, body }: { icon: typeof FileText; title: string; body: string }) {
  return (
    <div className="card-2 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className="text-gold-soft" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">{title}</h4>
      </div>
      <p className="text-xs leading-relaxed text-neutral-400">{body}</p>
    </div>
  );
}
