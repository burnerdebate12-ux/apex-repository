import { useMemo } from 'react';
import { GraduationCap, BookOpen, Trophy, Calendar, CheckCircle2, Circle } from 'lucide-react';
import type { OnboardingSurvey } from '@/lib/types';
import { AP_COURSES } from '@/lib/apCatalog';

interface Props {
  survey: OnboardingSurvey | null;
}

interface YearPlan {
  year: string;
  subtitle: string;
  academics: string[];
  ap: string[];
  extracurriculars: string[];
  milestones: string[];
}

function roadmapFor(major: string): Record<'Freshman' | 'Sophomore' | 'Junior' | 'Senior', YearPlan> {
  const base: Record<'Freshman' | 'Sophomore' | 'Junior' | 'Senior', YearPlan> = {
    Freshman: {
      year: 'Freshman Year',
      subtitle: 'Build the foundation',
      academics: ['Honors English 1', 'Honors Algebra 2 (or Geometry)', 'Honors Biology', 'World Language (Level 2)'],
      ap: ['AP Human Geography', 'AP Computer Science Principles'],
      extracurriculars: ['Join 2–3 clubs to explore interests', 'Begin a consistent volunteer commitment', 'Start a learning habit (Khan Academy daily)'],
      milestones: ['Establish GPA baseline', 'Take PSAT 8/9 for practice', 'Identify 2 academic strengths'],
    },
    Sophomore: {
      year: 'Sophomore Year',
      subtitle: 'Deepen and specialize',
      academics: ['Honors English 2', 'Honors Precalculus (or AP Precalc)', 'Honors Chemistry', 'World Language (Level 3)'],
      ap: apCodesFor(['AP Precalc', 'AP Bio', 'AP World', 'AP Human Geo', 'AP CSP', 'AP Drawing', 'AP 2D Art']),
      extracurriculars: ['Narrow to 1–2 core ECs', 'Seek a leadership role in a club', 'Begin research or competition prep'],
      milestones: ['Take PSAT/NMSQT (practice run)', 'Research 5–10 colleges of interest', 'Identify a potential major direction'],
    },
    Junior: {
      year: 'Junior Year',
      subtitle: 'The critical year',
      academics: ['AP English Language', 'AP Calculus AB or BC', 'AP Science (Chem or Physics)', 'AP History (APUSH or AP World)'],
      ap: apCodesFor(['AP Calc AB', 'AP Calc BC', 'AP Stats', 'AP Chem', 'AP Physics 1', 'AP Lang', 'APUSH', 'AP Bio', 'APES', 'AP Art Hist', 'AP Micro', 'AP Macro', 'AP Psych']),
      extracurriculars: ['Pursue a Tier-1 competition (USACO, ISEF, debate nationals)', 'Secure a research mentorship or internship', 'Take a leadership role in your top EC'],
      milestones: ['Take SAT/ACT (aim for one sitting by spring)', 'Take PSAT/NMSQT (qualifying year)', 'Request 2 teacher recommendations', 'Draft college list (8–12 schools)', 'Begin personal statement drafting'],
    },
    Senior: {
      year: 'Senior Year',
      subtitle: 'Execute and apply',
      academics: ['AP English Literature (or AP Lang if not taken)', 'AP course in target major', 'AP Science or History (depth)'],
      ap: apCodesFor(['AP Lit', 'AP CSA', 'AP Physics C', 'AP Gov', 'AP Macro', 'AP Micro', 'AP Stats', 'AP Calc BC', 'AP Spanish Lang', 'AP French', 'AP Chinese', 'AP Music']),
      extracurriculars: ['Sustain leadership roles', 'Finalize and submit a capstone project or publication', 'Maintain ECs through applications (colleges check)'],
      milestones: ['Finalize college list by September', 'Submit applications (early: Oct, regular: Jan)', 'Prepare for alumni/optional interviews', 'Complete FAFSA and CSS Profile', 'Compare financial aid offers'],
    },
  };

  // Tweak by major
  if (major === 'Computer Science') {
    base.Sophomore.ap.push('AP CSP', 'AP CSA');
    base.Junior.ap = ['AP CSA', 'AP Calc BC', 'AP Physics 1', 'AP Lang', ...base.Junior.ap];
    base.Senior.ap = ['AP Physics C', 'AP Stats', 'AP Lit', ...base.Senior.ap];
    base.Junior.extracurriculars.push('Compete in USACO (aim for Silver/Gold by spring)');
  }
  if (major === 'Engineering') {
    base.Junior.ap = ['AP Calc BC', 'AP Physics C', 'AP Chem', 'AP Lang', ...base.Junior.ap];
    base.Senior.ap = ['AP Physics C', 'AP Stats', 'AP Lit', ...base.Senior.ap];
  }
  if (major === 'Pre-Med / Biology') {
    base.Junior.ap = ['AP Bio', 'AP Chem', 'AP Calc AB', 'AP Lang', ...base.Junior.ap];
    base.Senior.ap = ['AP Physics', 'AP Psych', 'AP Lit', ...base.Senior.ap];
  }
  if (major === 'Business / Finance' || /econ|economic/.test(major.toLowerCase())) {
    base.Junior.ap = ['AP Macro', 'AP Micro', 'AP Calc BC', 'AP Stats', 'AP Lang', ...base.Junior.ap];
    base.Senior.ap = ['AP Stats', 'AP Gov', 'AP Lit', ...base.Senior.ap];
    base.Junior.extracurriculars.push('Complete an economics research project, data analysis, or policy competition');
    base.Senior.milestones.push('Build an economics portfolio with research, markets, or public-policy evidence');
  }
  if (major === 'Political Science') {
    base.Junior.ap = ['AP Gov', 'APUSH', 'AP Lang', 'AP Comp Gov', ...base.Junior.ap];
    base.Senior.ap = ['AP Macro', 'AP World', 'AP Lit', ...base.Senior.ap];
  }
  if (major === 'Humanities') {
    base.Junior.ap = ['AP Lit', 'AP Lang', 'AP World', 'AP Art Hist', ...base.Junior.ap];
    base.Senior.ap = ['AP Spanish Lang', 'AP Euro', 'AP Psych', ...base.Senior.ap];
  }
  if (major === 'Arts & Design') {
    base.Junior.ap = ['AP 2D Art', 'AP Drawing', 'AP Art Hist', 'AP Lang', ...base.Junior.ap];
    base.Senior.ap = ['AP 3D Art', 'AP Music', 'AP Lit', ...base.Senior.ap];
  }

  // Dedupe
  (Object.keys(base) as Array<keyof typeof base>).forEach((k) => {
    base[k].ap = Array.from(new Set(base[k].ap));
  });

  return base;
}

function apCodesFor(codes: string[]): string[] {
  return AP_COURSES.filter((c) => codes.includes(c.code)).map((c) => c.name);
}

const YEAR_ICON = { Freshman: BookOpen, Sophomore: Calendar, Junior: Trophy, Senior: GraduationCap };

export default function Roadmap({ survey }: Props) {
  const major = survey?.major === 'Other (Self-Insert)' && survey.customMajor.trim()
    ? survey.customMajor.trim()
    : survey?.major ?? 'Undeclared';
  const roadmap = useMemo(() => roadmapFor(major), [major]);

  const years = Object.keys(roadmap) as Array<keyof typeof roadmap>;

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Ledgers</p>
        <h1 className="section-title">4-Year High School Roadmap</h1>
        <p className="mt-1 text-sm text-neutral-400">
          A year-by-year plan for a <span className="text-gold-soft">{major}</span> target. Academics, APs, extracurriculars, and milestones — Freshman through Senior.
        </p>
      </div>

      <div className="space-y-6">
        {years.map((y, yi) => {
          const plan = roadmap[y];
          const Icon = YEAR_ICON[y];
          return (
            <div key={y} className="card p-6 animate-slidein" style={{ animationDelay: `${yi * 80}ms` }}>
              {/* Year header */}
              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/40 bg-gold/10 gold-glow">
                  <Icon size={20} className="text-gold-soft" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-white">{plan.year}</h2>
                  <p className="text-xs text-neutral-500">{plan.subtitle}</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {years.map((_, i) => (
                    <span key={i} className={`h-2 w-6 rounded-full ${i <= yi ? 'bg-gold' : 'bg-ink-muted'}`} />
                  ))}
                </div>
              </div>

              {/* Columns */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <RoadmapColumn title="Core Academics" items={plan.academics} icon={BookOpen} />
                <RoadmapColumn title="AP Courses" items={plan.ap} icon={GraduationCap} gold />
                <RoadmapColumn title="Extracurriculars" items={plan.extracurriculars} icon={Trophy} />
                <RoadmapColumn title="Milestones" items={plan.milestones} icon={CheckCircle2} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoadmapColumn({
  title,
  items,
  icon: Icon,
  gold,
}: {
  title: string;
  items: string[];
  icon: typeof BookOpen;
  gold?: boolean;
}) {
  return (
    <div className="card-2 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={14} className={gold ? 'text-gold-soft' : 'text-neutral-400'} />
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${gold ? 'text-gold-soft' : 'text-neutral-300'}`}>{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-neutral-300">
            <Circle size={8} className={`mt-1 shrink-0 ${gold ? 'text-gold' : 'text-neutral-600'}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
