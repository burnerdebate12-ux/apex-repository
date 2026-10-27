import { useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, ExternalLink, BookOpen, X, Search } from 'lucide-react';
import { AP_COURSES, AP_CATEGORIES } from '@/lib/apCatalog';
import type { ApCourse, ApLesson } from '@/lib/apCatalog';

interface Props {
  completed: Record<string, boolean>;
  onCompleteLesson: (courseCode: string, lessonIdx: number) => void;
}

export default function ApLab({ completed, onCompleteLesson }: Props) {
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const activeCourse = AP_COURSES.find((c) => c.code === activeCode) ?? null;

  const filtered = useMemo(() => {
    return AP_COURSES.filter((c) => {
      const matchCat = category === 'All' || c.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  if (activeCourse) {
    return (
      <CoursePlayer
        course={activeCourse}
        completed={completed}
        onComplete={(idx) => onCompleteLesson(activeCourse.code, idx)}
        onBack={() => setActiveCode(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Curriculum</p>
        <h1 className="section-title">AP Prep Lab</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Every AP course, with real lesson content, working quizzes, and direct Khan Academy links. Pick a class and start preparing.
        </p>
      </div>

      {/* Search + filters */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            className="input-field pl-9 py-2"
            placeholder="Search 38 AP courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...AP_CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`chip ${category === cat ? 'chip-gold' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-500">{filtered.length} of {AP_COURSES.length} AP courses</p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const total = c.lessons.length;
          const done = c.lessons.filter((_, i) => completed[`${c.code}-${i}`]).length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <button
              key={c.code}
              onClick={() => setActiveCode(c.code)}
              className="card group p-5 text-left transition-all duration-300 hover:border-gold/40 hover:shadow-gold"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="chip chip-gold text-[10px]">{c.code}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < c.difficulty ? 'bg-gold' : 'bg-ink-muted'}`} />
                  ))}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold text-white">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-400">{c.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">{c.category} · {c.lessons.length} lessons</span>
                <span className="text-[10px] text-gold-soft">{pct}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-muted">
                <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CoursePlayer({
  course,
  completed,
  onComplete,
  onBack,
}: {
  course: ApCourse;
  completed: Record<string, boolean>;
  onComplete: (idx: number) => void;
  onBack: () => void;
}) {
  const [lessonIdx, setLessonIdx] = useState(0);
  const lesson = course.lessons[lessonIdx];
  const [answers, setAnswers] = useState<(number | null)[]>(Array(lesson.quiz.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(lesson.quiz.length).fill(false));

  const allCorrect = checked.every((c, i) => c && answers[i] === lesson.quiz[i].answer);
  const lessonDone = completed[`${course.code}-${lessonIdx}`];

  const pick = (qi: number, oi: number) => {
    if (checked[qi]) return;
    setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
  };
  const check = (qi: number) => {
    if (answers[qi] === null) return;
    setChecked((c) => c.map((v, i) => (i === qi ? true : v)));
  };

  const goNext = () => {
    if (allCorrect && !lessonDone) onComplete(lessonIdx);
    if (lessonIdx < course.lessons.length - 1) {
      setLessonIdx(lessonIdx + 1);
      const next = course.lessons[lessonIdx + 1];
      setAnswers(Array(next.quiz.length).fill(null));
      setChecked(Array(next.quiz.length).fill(false));
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-ghost px-4 py-2 text-sm">
        <ArrowLeft size={14} /> All AP Courses
      </button>

      {/* Course header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip chip-gold">{course.code}</span>
          <span className="chip">{course.category}</span>
          <span className="chip">Typical: {course.typicalYear}</span>
          <span className="chip">Difficulty {course.difficulty}/5</span>
        </div>
        <h1 className="section-title mt-3">{course.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">{course.description}</p>
        <a
          href={course.lessons[0].khanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-soft hover:text-white"
        >
          <ExternalLink size={12} /> Open full course on Khan Academy
        </a>
      </div>

      {/* Lesson nav */}
      <div className="flex flex-wrap gap-2">
        {course.lessons.map((l, i) => {
          const done = completed[`${course.code}-${i}`];
          return (
            <button
              key={i}
              onClick={() => {
                setLessonIdx(i);
                setAnswers(Array(l.quiz.length).fill(null));
                setChecked(Array(l.quiz.length).fill(false));
              }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all ${
                i === lessonIdx
                  ? 'border-gold/50 bg-gold/10 text-gold-soft'
                  : done
                  ? 'border-green-500/30 bg-green-500/5 text-green-300'
                  : 'border-ink-border bg-black/40 text-neutral-400 hover:border-gold/30'
              }`}
            >
              {done ? <CheckCircle2 size={13} /> : <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[8px]">{i + 1}</span>}
              Lesson {i + 1}
            </button>
          );
        })}
      </div>

      {/* Lesson body */}
      <div className="card p-6 lg:p-8">
        <p className="section-eyebrow">{course.code} · Lesson {lessonIdx + 1} of {course.lessons.length}</p>
        <h2 className="section-title">{lesson.title}</h2>
        <div className="mt-5 space-y-4">
          {lesson.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-neutral-300">{p}</p>
          ))}
        </div>
        <a
          href={lesson.khanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-gold-soft hover:text-white"
        >
          <BookOpen size={12} /> Practice this on Khan Academy
        </a>
      </div>

      {/* Quiz */}
      <div className="card p-6">
        <h3 className="mb-1 font-serif text-lg font-semibold text-white">Comprehension Check</h3>
        <p className="mb-5 text-sm text-neutral-500">Answer correctly to complete the lesson.</p>
        <div className="space-y-6">
          {lesson.quiz.map((qz, qi) => (
            <div key={qi}>
              <p className="mb-3 font-medium text-neutral-200">
                <span className="text-gold-soft">Q{qi + 1}.</span> {qz.q}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {qz.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  const isAnswer = qz.answer === oi;
                  const showRight = checked[qi] && isAnswer;
                  const showWrong = checked[qi] && selected && !isAnswer;
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={checked[qi]}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                        showRight
                          ? 'border-green-500/50 bg-green-500/10 text-green-300'
                          : showWrong
                          ? 'border-red-500/50 bg-red-500/10 text-red-300'
                          : selected
                          ? 'border-gold/50 bg-gold/10 text-gold-soft'
                          : 'border-ink-border bg-black/40 text-neutral-300 hover:border-gold/30'
                      }`}
                    >
                      <span>{opt}</span>
                      {showRight && <Check size={16} className="text-green-400" />}
                      {showWrong && <X size={16} className="text-red-400" />}
                    </button>
                  );
                })}
              </div>
              {!checked[qi] && (
                <button onClick={() => check(qi)} disabled={answers[qi] === null} className="btn-ghost mt-3 px-4 py-1.5 text-xs disabled:opacity-40">
                  Check answer
                </button>
              )}
              {checked[qi] && (
                <p className={`mt-2 text-xs ${answers[qi] === qz.answer ? 'text-green-400' : 'text-red-400'}`}>
                  {answers[qi] === qz.answer ? 'Correct.' : `Not quite — the answer is "${qz.options[qz.answer]}".`}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-ink-border pt-5">
          <p className="text-sm text-neutral-400">
            {allCorrect ? 'All correct — mark complete and continue.' : 'Answer all correctly to continue.'}
          </p>
          <button onClick={goNext} disabled={!allCorrect} className="btn-gold disabled:opacity-40">
            {lessonIdx < course.lessons.length - 1 ? 'Complete & Next Lesson' : 'Complete Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { ApLesson };
