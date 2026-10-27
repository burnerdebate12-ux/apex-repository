import { NAV_ITEMS } from '@/lib/nav';
import { TerminalSquare, ShieldCheck, Hexagon, LogOut } from 'lucide-react';
import type { OnboardingSurvey } from '@/lib/types';

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  survey: OnboardingSurvey | null;
  onOpenOnboarding: () => void;
  onLogout: () => void;
  locked: boolean;
}

const GROUPS = ['Engine', 'Ledgers', 'Curriculum', 'Track'];

export default function Sidebar({ active, onSelect, survey, onOpenOnboarding, onLogout, locked }: SidebarProps) {
  const onboarded = !!survey?.submitted;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-ink-border bg-ink-card/60 backdrop-blur-md lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-ink-border px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold/40 bg-gold/10 gold-glow">
          <Hexagon className="text-gold-soft" size={20} />
        </div>
        <div>
          <p className="font-serif text-base font-semibold leading-tight text-white">Apex Colliville</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold-dim">Academic Concierge</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {GROUPS.map((group) => (
          <div key={group} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              {group}
            </p>
            <div className="space-y-1">
              {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
                const isLocked = locked && item.id !== 'agent';
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    disabled={isLocked}
                    className={`nav-item w-full ${active === item.id ? 'nav-item-active' : ''} ${
                      isLocked ? 'cursor-not-allowed opacity-40' : ''
                    }`}
                    title={isLocked ? 'Complete onboarding to unlock' : item.label}
                  >
                    <Icon size={17} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Onboarding status + logout */}
      <div className="space-y-2 border-t border-ink-border p-3">
        <button
          onClick={onOpenOnboarding}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all ${
            onboarded
              ? 'border border-gold/30 bg-gold/5 text-gold-soft'
              : 'border border-red-500/40 bg-red-500/5 text-red-300 animate-pulse'
          }`}
        >
          <ShieldCheck size={17} />
          <div className="text-left">
            <p className="font-medium">{onboarded ? 'Onboarding Complete' : 'Onboarding Required'}</p>
            <p className="text-[10px] text-neutral-500">
              {onboarded ? survey?.name || 'Student' : 'Locked — complete to access modules'}
            </p>
          </div>
        </button>
        {onboarded && (
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-300 transition-all hover:border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            <span className="font-medium">Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export function MobileNav({
  active,
  onSelect,
  locked,
}: {
  active: string;
  onSelect: (id: string) => void;
  locked: boolean;
}) {
  return (
    <div className="lg:hidden sticky top-0 z-30 border-b border-ink-border bg-ink-card/80 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-gold/40 bg-gold/10">
          <TerminalSquare className="text-gold-soft" size={16} />
        </div>
        <p className="font-serif text-sm font-semibold text-white">Apex Colliville</p>
        <select
          value={active}
          onChange={(e) => onSelect(e.target.value)}
          className="ml-auto max-w-[55%] truncate rounded-lg border border-ink-border bg-black/60 px-2 py-1.5 text-xs text-neutral-200"
        >
          {NAV_ITEMS.map((n) => {
            const isLocked = locked && n.id !== 'agent';
            return (
              <option key={n.id} value={n.id} disabled={isLocked}>
                {isLocked ? '🔒 ' : ''}
                {n.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
