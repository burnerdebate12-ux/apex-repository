import { useState } from 'react';
import { Lock, CheckCircle2, Circle, ArrowLeft, Check, X } from 'lucide-react';
import AiTutor from './AiTutor';
import type { CourseNode } from '@/lib/types';

interface Props {
  courses: CourseNode[];
  onComplete: (id: string) => void;
}

export default function Coreground({ courses, onComplete }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = courses.find((c) => c.id === activeId) ?? null;

  const openNode = (n: CourseNode) => {
    if (n.state === 'locked') return;
    setActiveId(n.id);
  };

  if (active) {
    return (
      <>
        <LessonPlayer
          lesson={active}
          onBack={() => setActiveId(null)}
          onComplete={() => {
            onComplete(active.id);
            setActiveId(null);
          }}
        />
        <AiTutor activeLesson={active} />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Curriculum</p>
        <h1 className="section-title">Coreground Curriculum</h1>
        <p className="mt-1 text-sm text-neutral-400">
          A Duolingo & Khan Academy–style learning map. Nodes glow gold sequentially as you complete lessons.
        </p>
      </div>

      <div className="card p-6">
        <div className="mx-auto flex max-w-md flex-col items-center gap-0">
          {courses.map((n, i) => {
            const Icon = n.state === 'completed' ? CheckCircle2 : n.state === 'available' ? Circle : Lock;
            const glow = n.state === 'available' || n.state === 'completed';
            return (
              <div key={n.id} className="flex w-full flex-col items-center">
                <button
                  onClick={() => openNode(n)}
                  disabled={n.state === 'locked'}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    n.state === 'locked'
                      ? 'border-ink-border bg-black/30 opacity-50'
                      : 'border-gold/40 bg-gold/5 hover:gold-glow hover:bg-gold/10'
                  } ${glow ? 'animate-glowpulse' : ''} ${n.state === 'completed' ? '!animate-none' : ''}`}
                >
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-all ${
                      n.state === 'completed'
                        ? 'border-gold bg-gold/20 text-gold-soft'
                        : n.state === 'available'
                        ? 'border-gold/60 bg-black text-gold-soft'
                        : 'border-ink-border bg-black text-neutral-600'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500">{n.subtitle}</p>
                    <h3 className="font-serif text-base font-medium text-white">{n.title}</h3>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {n.state === 'completed' ? 'Completed' : n.state === 'available' ? 'Tap to begin' : 'Locked — complete previous node'}
                    </p>
                  </div>
                </button>
                {i < courses.length - 1 && (
                  <div className={`h-8 w-px ${n.state === 'completed' ? 'bg-gold/60' : 'bg-ink-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LessonPlayer({
  lesson,
  onBack,
  onComplete,
}: {
  lesson: CourseNode;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(lesson.quiz.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(lesson.quiz.length).fill(false));

  const allCorrect = checked.every((c, i) => c && answers[i] === lesson.quiz[i].answer);

  const pick = (qi: number, oi: number) => {
    if (checked[qi]) return;
    setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
  };

  const check = (qi: number) => {
    if (answers[qi] === null) return;
    setChecked((c) => c.map((v, i) => (i === qi ? true : v)));
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-ghost px-4 py-2 text-sm">
        <ArrowLeft size={14} /> Back to map
      </button>

      <div className="card p-6 lg:p-8">
        <p className="section-eyebrow">{lesson.subtitle}</p>
        <h1 className="section-title">{lesson.title}</h1>

        <div className="mt-5 space-y-4">
          {lesson.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-neutral-300">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="card p-6">
        <h2 className="mb-1 font-serif text-lg font-semibold text-white">Comprehension Check</h2>
        <p className="mb-5 text-sm text-neutral-500">Answer each question to mark this node complete.</p>
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
                <button
                  onClick={() => check(qi)}
                  disabled={answers[qi] === null}
                  className="btn-ghost mt-3 px-4 py-1.5 text-xs disabled:opacity-40"
                >
                  Check answer
                </button>
              )}
              {checked[qi] && (
                <p className={`mt-2 text-xs ${answers[qi] === qz.answer ? 'text-green-400' : 'text-red-400'}`}>
                  {answers[qi] === qz.answer ? 'Correct.' : `Not quite — the correct answer is "${qz.options[qz.answer]}".`}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink-border pt-5">
          <p className="text-sm text-neutral-400">
            {allCorrect ? 'All correct — you may complete this node.' : 'Answer all questions correctly to complete.'}
          </p>
          <button onClick={onComplete} disabled={!allCorrect} className="btn-gold disabled:opacity-40">
            <CheckCircle2 size={16} /> Complete & Unlock Next
          </button>
        </div>
      </div>
    </div>
  );
}
