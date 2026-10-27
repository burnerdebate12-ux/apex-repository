import { useEffect, useState } from 'react';
import Sidebar, { MobileNav } from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import AgentTerminal from '@/components/AgentTerminal';
import Chatbot from '@/components/Chatbot';
import MatcherDashboard from '@/components/MatcherDashboard';
import Roadmap from '@/components/Roadmap';
import ApPathway from '@/components/ApPathway';
import ApLab from '@/components/ApLab';
import Competitions from '@/components/Competitions';
import Scholarships from '@/components/Scholarships';
import Mentors from '@/components/Mentors';
import Coreground from '@/components/Coreground';
import CollegePlanner from '@/components/CollegePlanner';
import { load, save, defaultSurvey, defaultCourses, emptyColleges, StoreKeys, emptyChecklist } from '@/lib/store';
import type { OnboardingSurvey, ApexResult, CourseNode, TrackedCollege, CollegeChecklist } from '@/lib/types';

export default function App() {
  const [survey, setSurvey] = useState<OnboardingSurvey | null>(() =>
    load<OnboardingSurvey | null>(StoreKeys.survey, null)
  );
  const [results, setResults] = useState<ApexResult[]>(() => load<ApexResult[]>(StoreKeys.apexResults, []));
  const [courses, setCourses] = useState<CourseNode[]>(() => load<CourseNode[]>(StoreKeys.courses, defaultCourses()));
  const [colleges, setColleges] = useState<TrackedCollege[]>(() =>
    load<TrackedCollege[]>(StoreKeys.colleges, emptyColleges()).map((college) => ({
      ...college,
      checklist: college.checklist ?? emptyChecklist(),
    }))
  );
  const [apLessons, setApLessons] = useState<Record<string, boolean>>(() =>
    load<Record<string, boolean>>(StoreKeys.apLessons, {})
  );
  const [activeView, setActiveView] = useState<string>(() => load<string>(StoreKeys.activeView, 'agent'));
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(!survey?.submitted);

  useEffect(() => save(StoreKeys.survey, survey), [survey]);
  useEffect(() => save(StoreKeys.apexResults, results), [results]);
  useEffect(() => save(StoreKeys.courses, courses), [courses]);
  useEffect(() => save(StoreKeys.colleges, colleges), [colleges]);
  useEffect(() => save(StoreKeys.apLessons, apLessons), [apLessons]);
  useEffect(() => save(StoreKeys.activeView, activeView), [activeView]);

  const locked = !survey?.submitted;

  const handleSurveySubmit = (s: OnboardingSurvey) => {
    setSurvey(s);
    setOnboardingOpen(false);
    setActiveView('agent');
  };

  const handleResults = (r: ApexResult[]) => {
    setResults((prev) => {
      const map = new Map<string, ApexResult>();
      [...prev, ...r].forEach((x) => map.set(x.id, x));
      return Array.from(map.values()).slice(-40);
    });
  };

  const handleCompleteApLesson = (courseCode: string, lessonIdx: number) => {
    setApLessons((prev) => ({ ...prev, [`${courseCode}-${lessonIdx}`]: true }));
  };

  const handleCompleteNode = (id: string) => {
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], state: 'completed' };
      if (idx + 1 < next.length && next[idx + 1].state === 'locked') {
        next[idx + 1] = { ...next[idx + 1], state: 'available' };
      }
      return next;
    });
  };

  const handleLogout = () => {
    setSurvey(null);
    setResults([]);
    setCourses(defaultCourses());
    setColleges([]);
    setApLessons({});
    setActiveView('agent');
    setOnboardingOpen(true);
  };

  const handleUpdateCollegeChecklist = (id: string, key: keyof CollegeChecklist, value: boolean) => {
    setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, checklist: { ...c.checklist, [key]: value } } : c)));
  };



  const renderView = () => {
    if (locked && activeView !== 'agent') {
      return (
        <div className="grid place-items-center py-24">
          <div className="card max-w-md p-8 text-center gold-glow">
            <h2 className="section-title">Onboarding Required</h2>
            <p className="mt-2 text-sm text-neutral-400">
              All modules are locked until you complete the onboarding survey. This guardrail ensures the Apex AI
              agent has your profile before it runs.
            </p>
            <button className="btn-gold mt-5" onClick={() => setOnboardingOpen(true)}>
              Begin Onboarding
            </button>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'agent':
        return (
          <AgentTerminal
            survey={survey}
            results={results}
            onResults={handleResults}
            onClearResults={() => setResults([])}
            onRequireOnboarding={() => setOnboardingOpen(true)}
          />
        );
      case 'chatbot':
        return <Chatbot survey={survey} />;
      case 'dashboard':
        return <MatcherDashboard survey={survey} results={results} onRequireOnboarding={() => setOnboardingOpen(true)} />;
      case 'roadmap':
        return <Roadmap survey={survey} />;
      case 'ap':
        return <ApPathway survey={survey} />;
      case 'aplab':
        return <ApLab completed={apLessons} onCompleteLesson={handleCompleteApLesson} />;
      case 'competitions':
        return <Competitions survey={survey} results={results} onDeepResults={handleResults} />;
      case 'scholarships':
        return <Scholarships survey={survey} results={results} onDeepResults={handleResults} />;
      case 'mentors':
        return <Mentors survey={survey} results={results} />;
      case 'coreground':
        return <Coreground courses={courses} onComplete={handleCompleteNode} />;
      case 'college':
        return <CollegePlanner survey={survey} colleges={colleges} onSave={setColleges} onUpdateChecklist={handleUpdateCollegeChecklist} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-base">
      <Sidebar
        active={activeView}
        onSelect={setActiveView}
        survey={survey}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onLogout={handleLogout}
        locked={locked}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav active={activeView} onSelect={setActiveView} locked={locked} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {renderView()}
        </main>
        <footer className="border-t border-ink-border px-6 py-5 text-center text-[11px] text-neutral-600">
          Apex Colliville Academic Concierge — data persisted locally via browser storage
        </footer>
      </div>

      <OnboardingModal
        open={onboardingOpen}
        onClose={() => {
          if (survey?.submitted) setOnboardingOpen(false);
        }}
        onSubmit={handleSurveySubmit}
        initial={survey ?? defaultSurvey()}
      />
    </div>
  );
}
