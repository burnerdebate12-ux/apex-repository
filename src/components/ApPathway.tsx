import { GraduationCap, CheckCircle2 } from 'lucide-react';
import type { OnboardingSurvey } from '@/lib/types';

interface Props {
  survey: OnboardingSurvey | null;
}

const AP_MAP: Record<string, { code: string; name: string; why: string }[]> = {
  'Computer Science': [
    { code: 'AP CSP', name: 'AP Computer Science Principles', why: 'Foundational algorithmic literacy; gateway to CS coursework.' },
    { code: 'AP CSA', name: 'AP Computer Science A', why: 'Java fluency expected by selective CS programs; signals rigor.' },
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Math backbone for algorithms, ML, and engineering tracks.' },
    { code: 'AP Stats', name: 'AP Statistics', why: 'Data fluency for analytics, research, and ML coursework.' },
    { code: 'AP Physics C', name: 'AP Physics C: Mechanics', why: 'Quantitative reasoning prized by engineering-leaning CS applicants.' },
  ],
  Engineering: [
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Non-negotiable for top engineering programs.' },
    { code: 'AP Physics C', name: 'AP Physics C: E&M + Mechanics', why: 'Core engineering science; both halves expected.' },
    { code: 'AP Chem', name: 'AP Chemistry', why: 'Required for chemical / materials engineering tracks.' },
    { code: 'AP CSA', name: 'AP Computer Science A', why: 'Increasingly expected for modern engineering admissions.' },
  ],
  'Pre-Med / Biology': [
    { code: 'AP Bio', name: 'AP Biology', why: 'Foundational for pre-med and life-science majors.' },
    { code: 'AP Chem', name: 'AP Chemistry', why: 'Core pre-med science; heavily weighted by BS/MD programs.' },
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Expected quantitative rigor for top pre-med programs.' },
    { code: 'AP Physics', name: 'AP Physics 1/2 or C', why: 'Required science breadth for medical school prerequisites.' },
  ],
  'Business / Finance': [
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Quantitative backbone for finance and economics.' },
    { code: 'AP Macro', name: 'AP Macroeconomics', why: 'Core economic literacy for business applicants.' },
    { code: 'AP Micro', name: 'AP Microeconomics', why: 'Demonstrates economic reasoning for business programs.' },
    { code: 'AP Stats', name: 'AP Statistics', why: 'Data fluency for analytics-driven business tracks.' },
  ],
  Economics: [
    { code: 'AP Macro', name: 'AP Macroeconomics', why: 'Core theory for markets, growth, inflation, and economic policy.' },
    { code: 'AP Micro', name: 'AP Microeconomics', why: 'Builds rigorous reasoning about firms, incentives, and market structure.' },
    { code: 'AP Stats', name: 'AP Statistics', why: 'Essential evidence and data fluency for economics research.' },
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Prepares you for econometrics, finance, and quantitative economics.' },
  ],
  'Political Science': [
    { code: 'AP Gov', name: 'AP U.S. Government & Politics', why: 'Direct subject mastery for political science majors.' },
    { code: 'APUSH', name: 'AP United States History', why: 'Historical context expected for policy-focused applicants.' },
    { code: 'AP Comp Gov', name: 'AP Comparative Government', why: 'Global political systems breadth for top programs.' },
    { code: 'AP Lang', name: 'AP English Language', why: 'Argumentation skills central to policy work.' },
  ],
  Humanities: [
    { code: 'AP Lit', name: 'AP English Literature', why: 'Close-reading rigor expected by selective humanities programs.' },
    { code: 'AP Lang', name: 'AP English Language', why: 'Argumentation and rhetoric foundation.' },
    { code: 'AP World', name: 'AP World History', why: 'Global historical breadth prized by humanities admissions.' },
    { code: 'AP Art Hist', name: 'AP Art History', why: 'Cultural literacy signal for humanities applicants.' },
  ],
  'Arts & Design': [
    { code: 'AP 2D / 3D Art', name: 'AP 2-D / 3-D Art and Design', why: 'Portfolio rigor expected by art programs.' },
    { code: 'AP Drawing', name: 'AP Drawing', why: 'Core portfolio skill for illustration and fine-arts tracks.' },
    { code: 'AP Art Hist', name: 'AP Art History', why: 'Contextual literacy for design scholarship.' },
    { code: 'AP Lang', name: 'AP English Language', why: 'Statement-of-intent writing skills for applications.' },
  ],
  Undeclared: [
    { code: 'AP Calc BC', name: 'AP Calculus BC', why: 'Keeps every quantitative major open.' },
    { code: 'AP Lang', name: 'AP English Language', why: 'Keeps every humanities / writing path open.' },
    { code: 'AP Bio', name: 'AP Biology', why: 'Science breadth for undecided applicants.' },
    { code: 'AP Stats', name: 'AP Statistics', why: 'Universal data fluency across disciplines.' },
  ],
};

export default function ApPathway({ survey }: Props) {
  const major = survey?.major === 'Other (Self-Insert)' && survey.customMajor.trim()
    ? survey.customMajor.trim()
    : survey?.major ?? 'Undeclared';
  const normalizedMajor = /econ|economic|finance|business/.test(major.toLowerCase()) ? 'Economics' : major;
  const path = AP_MAP[normalizedMajor] ?? AP_MAP['Undeclared'];

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Resource Ledger</p>
        <h1 className="section-title">Curated AP Pathway</h1>
        <p className="mt-1 text-sm text-neutral-400">
          A clean roadmap of recommended advanced-placement classes for a <span className="text-gold-soft">{major}</span> target.
        </p>
      </div>

      <div className="card p-6">
        <div className="mb-5 flex items-center gap-3">
          <GraduationCap className="text-gold-soft" size={22} />
          <h2 className="font-serif text-lg font-semibold text-white">Recommended Sequence</h2>
        </div>
        <ol className="relative space-y-4 pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />
          {path.map((ap, i) => (
            <li key={ap.code} className="relative animate-slidein" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="absolute -left-[27px] top-1 grid h-6 w-6 place-items-center rounded-full border border-gold/50 bg-black gold-glow">
                <span className="text-[10px] font-semibold text-gold-soft">{i + 1}</span>
              </div>
              <div className="card-2 p-4 transition-all duration-300 hover:border-gold/40 hover:shadow-gold">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="chip chip-gold">{ap.code}</span>
                    <h3 className="mt-2 font-serif text-base font-medium text-white">{ap.name}</h3>
                  </div>
                  <CheckCircle2 className="mt-1 text-gold-dim/60" size={18} />
                </div>
                <p className="mt-2 text-sm text-neutral-400">{ap.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
