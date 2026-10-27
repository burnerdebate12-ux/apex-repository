import { Sparkles, Target, TrendingUp, FileText } from 'lucide-react';
import type { ApexResult, OnboardingSurvey } from '@/lib/types';

interface Props {
  survey: OnboardingSurvey | null;
  results: ApexResult[];
  onRequireOnboarding: () => void;
}

export default function MatcherDashboard({ survey, results, onRequireOnboarding }: Props) {
  if (!survey?.submitted) {
    return (
      <div className="grid place-items-center py-20">
        <div className="card max-w-md p-8 text-center gold-glow">
          <Target className="mx-auto mb-3 text-gold-soft" size={28} />
          <h2 className="section-title">Complete Onboarding First</h2>
          <p className="mt-2 text-sm text-neutral-400">Your tactical recommendations are generated from your profile.</p>
          <button onClick={onRequireOnboarding} className="btn-gold mt-5">Begin Onboarding</button>
        </div>
      </div>
    );
  }

  const scholarships = results.filter((r) => r.category === 'scholarship');
  const competitions = results.filter((r) => r.category === 'competition');
  const mentors = results.filter((r) => r.category === 'mentor');
  const programs = results.filter((r) => r.category === 'internship' || r.category === 'general');

  const recommendations = [
    {
      icon: Target,
      title: 'Profile Match',
      body: `Your target major is ${survey.major} with a ${survey.ecType} focus. The agent has matched ${results.length} live records to your profile across scholarships, competitions, and mentors.`,
      tone: 'gold',
    },
    {
      icon: TrendingUp,
      title: 'High-Priority Competitions',
      body: competitions.length
        ? `${competitions.length} competition(s) detected. Prioritize Tier-1 national placements (e.g. USACO Platinum, Regeneron STS) — these map to the "Required Tier 1" benchmark in the Ivy League planner.`
        : 'No competition records yet. Run the Apex AI agent to surface Tier-1 opportunities for your major.',
      tone: 'gold',
    },
    {
      icon: Sparkles,
      title: 'Scholarship Pipeline',
      body: scholarships.length
        ? `${scholarships.length} scholarship(s) synced. ${
            survey.family.financialNeed
              ? 'Need-based awards are visible because your family profile indicates financial need.'
              : 'Need-based awards are hidden — your family profile does not indicate financial need.'
          }`
        : 'No scholarships synced yet. Run the Apex AI agent to populate your scholarship pipeline.',
      tone: survey.family.financialNeed ? 'gold' : 'muted',
    },
    {
      icon: FileText,
      title: 'Mentor & Program Outreach',
      body: mentors.length + programs.length
        ? `${mentors.length} mentor(s) and ${programs.length} program(s) available. Draft cold emails from the Mentors tab to faculty leading research aligned with "${survey.researchFocus || survey.major}".`
        : 'No mentor or program records yet. Run the Apex AI agent to surface faculty and summer programs.',
      tone: 'gold',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Resource Ledger</p>
        <h1 className="section-title">Matcher Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Tactical recommendations generated directly from the Apex AI agent's live extraction.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div key={rec.title} className="card group p-5 transition-all duration-300 hover:border-gold/40 hover:shadow-gold">
              <div className="mb-3 flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl border ${rec.tone === 'gold' ? 'border-gold/40 bg-gold/10' : 'border-ink-border bg-black/40'}`}>
                  <Icon size={18} className={rec.tone === 'gold' ? 'text-gold-soft' : 'text-neutral-500'} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-white">{rec.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-neutral-400">{rec.body}</p>
            </div>
          );
        })}
      </div>

      {/* Live records snapshot */}
      <div className="card p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-white">Latest Extracted Records</h2>
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-border py-10 text-center">
            <p className="text-sm text-neutral-500">Run the Apex AI agent to populate live records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-border text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Title</th>
                  <th className="pb-2 pr-4 font-medium">Category</th>
                  <th className="pb-2 pr-4 font-medium">Score</th>
                  <th className="pb-2 pr-4 font-medium">Analysis</th>
                  <th className="pb-2 font-medium">Excerpt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-border">
                {results.slice(0, 8).map((r) => (
                  <tr key={r.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-medium text-white">{r.title}</td>
                    <td className="py-3 pr-4 capitalize text-gold-soft">{r.category}</td>
                    <td className="py-3 pr-4">
                      <span className="chip chip-gold">{r.score}/100</span>
                    </td>
                    <td className="py-3 pr-4 max-w-xs text-[11px] text-gold-soft/80">{r.analysis}</td>
                    <td className="py-3 max-w-md text-neutral-400">{r.content.slice(0, 80)}…</td>
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
