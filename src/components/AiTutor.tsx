import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, X, Loader2 } from 'lucide-react';
import { tavilyAsk } from '@/lib/apex';
import type { CourseNode } from '@/lib/types';

interface Props {
  activeLesson: CourseNode | null;
}

interface TutorMsg {
  role: 'tutor' | 'student';
  text: string;
}

export default function AiTutor({ activeLesson }: Props) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<TutorMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLesson) {
      setMsgs([
        {
          role: 'tutor',
          text: `Welcome to Apex Colliville. I'm your Coreground tutor. The current lesson is "${activeLesson.title}". Ask me anything about the material and I'll answer using live web search grounded in this lesson.`,
        },
      ]);
    }
  }, [activeLesson]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs((m) => [...m, { role: 'student', text }]);
    setInput('');
    setLoading(true);

    const lesson = activeLesson;
    const context = lesson
      ? `Lesson: ${lesson.title}. Content: ${lesson.body.join(' ')}`
      : '';

    try {
      const answer = await tavilyAsk(text, context);
      setMsgs((m) => [...m, { role: 'tutor', text: answer }]);
    } catch {
      const fallback = lesson
        ? `Based on this lesson: ${lesson.body[0].slice(0, 160)}… Try rephrasing your question.`
        : 'I could not reach the search service right now. Please try again.';
      setMsgs((m) => [...m, { role: 'tutor', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating dock (only when lesson open) */}
      {activeLesson && (
        <div className="fixed right-4 top-24 z-40 hidden w-80 xl:block">
          <div className={`card overflow-hidden transition-all duration-300 ${open ? 'gold-glow' : ''}`}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center gap-2 border-b border-ink-border bg-black/60 px-4 py-3 text-left"
            >
              <Bot size={16} className="text-gold-soft" />
              <span className="font-serif text-sm font-semibold text-white">Apex Tutor</span>
              <span className="ml-auto flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${loading ? 'bg-gold-soft animate-pulse' : 'bg-green-400'} animate-pulse`} />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">{loading ? 'searching' : 'live'}</span>
              </span>
            </button>
            {open && (
              <div className="flex flex-col">
                <div ref={scrollRef} className="h-64 overflow-y-auto space-y-3 px-4 py-3 text-sm">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === 'student' ? 'flex-row-reverse' : ''}`}>
                      <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${m.role === 'tutor' ? 'bg-gold/10 text-gold-soft' : 'bg-ink-muted text-neutral-300'}`}>
                        {m.role === 'tutor' ? <Bot size={12} /> : <User size={12} />}
                      </div>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.role === 'tutor' ? 'bg-black/60 text-neutral-200' : 'bg-gold/10 text-gold-soft'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/10 text-gold-soft">
                        <Loader2 size={12} className="animate-spin" />
                      </div>
                      <div className="rounded-xl bg-black/60 px-3 py-2 text-xs text-neutral-500">Searching for an answer…</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 border-t border-ink-border p-3">
                  <input
                    className="flex-1 rounded-lg border border-ink-border bg-black/60 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-gold/50"
                    placeholder="Ask the tutor anything…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    disabled={loading}
                  />
                  <button onClick={send} disabled={loading || !input.trim()} className="grid h-8 w-8 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft transition hover:gold-glow disabled:opacity-40">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer variant */}
      {activeLesson && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-ink-card gold-glow xl:hidden"
          aria-label="Toggle Apex Tutor"
        >
          {open ? <X size={18} className="text-gold-soft" /> : <Bot size={18} className="text-gold-soft" />}
        </button>
      )}
      {activeLesson && open && (
        <div className="fixed bottom-20 right-4 z-40 w-72 xl:hidden">
          <div className="card overflow-hidden gold-glow">
            <div ref={scrollRef} className="h-56 overflow-y-auto space-y-3 px-4 py-3 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'student' ? 'flex-row-reverse' : ''}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.role === 'tutor' ? 'bg-black/60 text-neutral-200' : 'bg-gold/10 text-gold-soft'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="rounded-xl bg-black/60 px-3 py-2 text-xs text-neutral-500">Searching…</div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-ink-border p-3">
              <input
                className="flex-1 rounded-lg border border-ink-border bg-black/60 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-gold/50"
                placeholder="Ask the tutor…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                disabled={loading}
              />
              <button onClick={send} disabled={loading || !input.trim()} className="grid h-8 w-8 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft disabled:opacity-40">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
