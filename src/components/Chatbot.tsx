import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles, User, Bot, RotateCcw, Loader2 } from 'lucide-react';
import type { OnboardingSurvey, ApexResult } from '@/lib/types';
import { AP_COURSES } from '@/lib/apCatalog';
import { runTargetedSearch, tavilyAsk } from '@/lib/apex';

interface Props {
  survey: OnboardingSurvey | null;
}

interface ChatMsg {
  role: 'bot' | 'user';
  text: string;
  results?: ApexResult[];
}

const SUGGESTED = [
  'What AP classes should I take for Computer Science?',
  'How do I build a strong extracurricular profile?',
  'Find scholarships for me',
  'Explain the Coreground curriculum',
  'What does an Ivy League application need?',
];

async function getAssistantAnswer(question: string, context: string, fallback: string): Promise<string> {
  const answer = await tavilyAsk(question, context);
  return /Tavily API key not configured|Search failed|No answer found|Search error/.test(answer) ? fallback : answer;
}

export default function Chatbot({ survey }: Props) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([
      {
        role: 'bot',
        text: survey?.submitted
          ? `Hey ${survey.name || 'there'}! I'm your Apex Assistant. I can help you plan APs, find live scholarships, prep for college, or just chat about academics. What's on your mind?`
          : `Hi! I'm your Apex Assistant. Complete the onboarding survey so I can tailor advice to your profile — but I'm happy to chat in the meantime.`,
      },
    ]);
  }, [survey?.submitted, survey?.name]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length, typing]);

  const respond = async (text: string) => {
    setTyping(true);
    const lower = text.toLowerCase();

    let reply = '';
    let searchResults: ApexResult[] | undefined;

    try {
      if (/scholarship/.test(lower)) {
        if (survey?.submitted) {
          reply = 'Searching for live scholarships matching your profile…';
          setMsgs((prev) => [...prev, { role: 'bot', text: reply }]);
          const out = await runTargetedSearch(survey, 'scholarship');
          searchResults = out;
          reply = `I found ${searchResults.length} scholarship(s)${survey.family.financialNeed ? ', including need-based awards' : ''}. Here are the top matches:\n\n${searchResults.slice(0, 3).map((r) => `• ${r.title} — score ${r.score}/100`).join('\n')}`;
        } else {
          reply = 'Complete onboarding first so I can tailor the scholarship search to your profile.';
        }
      } else if (/ap class|ap course|which ap|ap for|ap i should|what ap/.test(lower)) {
        const major = survey?.major ?? 'Undeclared';
        const matches = AP_COURSES.filter((c) =>
          c.code.toLowerCase().includes(lower) ||
          c.name.toLowerCase().includes(lower) ||
          (major !== 'Undeclared' && c.description.toLowerCase().includes(major.toLowerCase()))
        ).slice(0, 5);
        if (matches.length) {
          reply = `For ${major}, here are strong AP choices:\n\n${matches.map((c) => `• ${c.name} — ${c.description.slice(0, 80)}…`).join('\n\n')}\n\nOpen the AP Prep Lab to study any of these in depth.`;
        } else {
          const liveAnswer = await getAssistantAnswer(
            text,
            `Student targeting ${major}. Recommending AP courses for high school students.`,
            `For ${major}, prioritize the most rigorous courses available at your school, then use the AP Pathway and AP Prep Lab to choose the best sequence.`
          );
          reply = `${liveAnswer}\n\nYou can also browse all 38 AP courses with full lessons in the AP Prep Lab.`;
        }
      } else if (/extracurricular|ec|activity|leadership/.test(lower)) {
        const liveAnswer = await getAssistantAnswer(
          text,
          'High school extracurricular profile building for college admissions, tier-1 achievements.',
          'Build one sustained activity around your strongest academic interest, add measurable impact, and pair it with a research, leadership, or competition outcome.'
        );
        reply = `${liveAnswer}\n\nThe Matcher Dashboard and Competitions tab surface live opportunities from the Apex AI agent.`;
      } else if (/ivy|college|admission|application/.test(lower)) {
        const liveAnswer = await getAssistantAnswer(
          text,
          'Ivy League college admission requirements for high school students.',
          'Strong applications combine demanding coursework, excellent academic performance, meaningful long-term activities, thoughtful essays, and recommendations that show character.'
        );
        reply = `${liveAnswer}\n\nOpen the Ivy League Planner to see exact benchmarks per school and track your application stages.`;
      } else if (/mentor|professor|research mentor/.test(lower)) {
        const liveAnswer = await getAssistantAnswer(
          text,
          'Finding university professors and research mentors for high school students.',
          'Start with faculty whose recent work matches your research focus, read one paper or project summary, and send a short, specific introduction with a clear way you can contribute.'
        );
        reply = `${liveAnswer}\n\nThe Mentors tab shows faculty and research programs aligned to your field. You can also search by location there.`;
      } else if (/roadmap|year|freshman|sophomore|junior|senior/.test(lower)) {
        reply = 'The 4-Year Roadmap lays out academics, APs, extracurriculars, and milestones for each year of high school — tailored to your target major. Open it from the sidebar to see your full plan.';
      } else if (/coreground|curriculum|lesson|learn/.test(lower)) {
        reply = 'The Coreground Curriculum is a Duolingo + Khan Academy-style learning path. You unlock nodes sequentially by completing quizzes. Each lesson has multi-paragraph content, instant feedback, and a floating AI tutor powered by live web search. The AP Prep Lab has the same format for all 38 AP courses.';
      } else if (/competition|contest|olympiad/.test(lower)) {
        if (survey?.submitted) {
          reply = 'Searching for live competitions matching your profile…';
          setMsgs((prev) => [...prev, { role: 'bot', text: reply }]);
          const out = await runTargetedSearch(survey, 'competition');
          searchResults = out;
          reply = `I found ${searchResults.length} competition(s). Top matches:\n\n${searchResults.slice(0, 3).map((r) => `• ${r.title} — ${r.score}/100`).join('\n')}`;
        } else {
          reply = 'Complete onboarding first so I can tailor the competition search.';
        }
      } else if (/internship|summer program/.test(lower)) {
        if (survey?.submitted) {
          reply = 'Searching for live internships and summer programs…';
          setMsgs((prev) => [...prev, { role: 'bot', text: reply }]);
          const out = await runTargetedSearch(survey, 'internship');
          searchResults = out;
          reply = `I found ${searchResults.length} program(s). Top matches:\n\n${searchResults.slice(0, 3).map((r) => `• ${r.title} — ${r.score}/100`).join('\n')}`;
        } else {
          reply = 'Complete onboarding first so I can tailor the internship search.';
        }
      } else if (/hi|hello|hey|sup/.test(lower)) {
        reply = `Happy to help! Ask me about APs, scholarships, competitions, college planning, extracurriculars, or anything academic. ${survey?.submitted ? `Since you're targeting ${survey.major}, I can give specific recommendations and run live searches.` : 'Complete onboarding for tailored advice.'}`;
      } else if (/thanks|thank/.test(lower)) {
        reply = 'Anytime! Feel free to ask me anything else.';
      } else if (/help|what can you/.test(lower)) {
        reply = 'I can help with:\n• Choosing AP classes for your major\n• Finding live scholarships & competitions\n• Planning your extracurricular profile\n• Understanding Ivy League requirements\n• Finding mentors & internships\n• College application strategy\n\nJust ask me anything in plain English!';
      } else {
        // General fallback — use live Tavily answer
        const liveAnswer = await getAssistantAnswer(
          text,
          survey?.submitted ? `Student targeting ${survey.major}.` : 'High school student academic planning.',
          survey?.submitted
            ? `I can help you plan around ${survey.major}, build extracurricular depth, find opportunities, and prepare a college application strategy.`
            : 'I can help with AP classes, extracurriculars, scholarships, competitions, mentors, and college planning.'
        );
        reply = liveAnswer;
      }
    } catch {
      reply = 'I had trouble reaching the search service. Please try again in a moment.';
    }

    setTyping(false);
    setMsgs((prev) => [...prev, { role: 'bot', text: reply, results: searchResults }]);
  };

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setMsgs((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    respond(msg);
  };

  const reset = () => {
    setMsgs([{ role: 'bot', text: 'Conversation reset. What would you like to talk about?' }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="section-eyebrow">Engine</p>
          <h1 className="section-title">Apex Assistant Chat</h1>
          <p className="mt-1 text-sm text-neutral-400">A friendly conversational assistant powered by live web search. Ask in plain English.</p>
        </div>
        <button onClick={reset} className="btn-ghost px-3 py-2 text-xs">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="card flex h-[560px] flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === 'bot' ? 'bg-gold/10 text-gold-soft' : 'bg-ink-muted text-neutral-300'}`}>
                {m.role === 'bot' ? <Bot size={15} /> : <User size={15} />}
              </div>
              <div className={`max-w-[75%] ${m.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === 'bot' ? 'bg-black/60 text-neutral-200 border border-ink-border' : 'bg-gold/10 text-gold-soft border border-gold/30'}`}>
                  {m.text}
                </div>
                {m.results && m.results.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.results.slice(0, 3).map((r) => (
                      <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-ink-border bg-black/40 px-3 py-2 text-left text-xs text-neutral-300 transition hover:border-gold/40 hover:text-gold-soft">
                        <p className="font-medium">{r.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-neutral-500">{r.content}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/10 text-gold-soft">
                <Loader2 size={15} className="animate-spin" />
              </div>
              <div className="rounded-2xl border border-ink-border bg-black/60 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold-soft [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold-soft [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold-soft [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested prompts */}
        {msgs.length <= 1 && (
          <div className="border-t border-ink-border px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Sparkles size={12} className="text-gold-soft" /> Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => send(s)} className="chip hover:chip-gold">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-ink-border p-4">
          <MessageCircle size={16} className="text-neutral-500" />
          <input
            className="flex-1 rounded-lg border border-ink-border bg-black/60 px-4 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-gold/50"
            placeholder="Ask me anything about academics…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={typing}
          />
          <button onClick={() => send()} disabled={!input.trim() || typing} className="btn-gold px-4 py-2.5 text-sm disabled:opacity-40">
            {typing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
