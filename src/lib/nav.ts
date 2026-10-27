import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  Medal,
  Users,
  TreePalm,
  Building2,
  ShieldCheck,
  Hexagon,
  BookOpen,
  Route,
  MessageCircle,
  TerminalSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavDef {
  id: string;
  label: string;
  icon: LucideIcon;
  group: string;
}

export const NAV_ITEMS: NavDef[] = [
  { id: 'agent', label: 'Apex AI Research Terminal', icon: TerminalSquare, group: 'Engine' },
  { id: 'chatbot', label: 'Apex Assistant Chat', icon: MessageCircle, group: 'Engine' },
  { id: 'dashboard', label: 'Matcher Dashboard', icon: LayoutDashboard, group: 'Ledgers' },
  { id: 'roadmap', label: '4-Year High School Roadmap', icon: Route, group: 'Ledgers' },
  { id: 'ap', label: 'Curated AP Pathway', icon: GraduationCap, group: 'Ledgers' },
  { id: 'aplab', label: 'AP Prep Lab', icon: BookOpen, group: 'Curriculum' },
  { id: 'competitions', label: 'Competitions', icon: Trophy, group: 'Ledgers' },
  { id: 'scholarships', label: 'Scholarships', icon: Medal, group: 'Ledgers' },
  { id: 'mentors', label: 'Mentors', icon: Users, group: 'Ledgers' },
  { id: 'coreground', label: 'Coreground Curriculum', icon: TreePalm, group: 'Curriculum' },
  { id: 'college', label: 'Ivy League Planner', icon: Building2, group: 'Track' },
];

export { ShieldCheck as ONBOARDING_ICON, Hexagon };
