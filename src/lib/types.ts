// Shared types across the Apex Colliville Academic Concierge app.

export type Major =
  | 'Computer Science'
  | 'Engineering'
  | 'Pre-Med / Biology'
  | 'Business / Finance'
  | 'Political Science'
  | 'Humanities'
  | 'Arts & Design'
  | 'Undeclared'
  | 'Other (Self-Insert)';

export type Minor =
  | 'None'
  | 'Data Science'
  | 'Entrepreneurship'
  | 'Public Policy'
  | 'Cognitive Science'
  | 'Philosophy'
  | 'Music'
  | 'Environmental Science'
  | 'Other (Self-Insert)';

export type EcType = 'Research' | 'Professional/Internship' | 'Competition' | 'Community Service';

export interface FamilyProfile {
  householdIncome: 'Under $30k' | '$30k–$60k' | '$60k–$100k' | '$100k–$150k' | 'Over $150k';
  dependents: number;
  firstGenCollege: boolean;
  financialNeed: boolean;
}

export interface OnboardingSurvey {
  name: string;
  email: string;
  password: string;
  major: Major;
  customMajor: string;
  minor: Minor;
  customMinor: string;
  dualMajor: boolean;
  dualMajorFields: string;
  ecType: EcType;
  researchFocus: string;
  internshipLocation: string;
  internshipType: string;
  ecSpecifics: string;
  family: FamilyProfile;
  submitted: boolean;
}

export interface ApexResult {
  id: string;
  title: string;
  url: string;
  content: string;
  category: 'scholarship' | 'competition' | 'mentor' | 'internship' | 'general';
  score: number;
  relevance: number;
  prestige: number;
  winnability: number;
  needAlignment: number;
  analysis: string;
}

export interface ApexLogLine {
  t: number;
  text: string;
}

export type CourseNodeState = 'locked' | 'available' | 'completed';

export interface CourseNode {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
  quiz: { q: string; options: string[]; answer: number }[];
  state: CourseNodeState;
}

export type AppStage = 'Wishlist' | 'Preparing' | 'Applied' | 'Interviewing' | 'Accepted';

export interface TrackedCollege {
  id: string;
  name: string;
  stage: AppStage;
  notes: string;
  checklist: CollegeChecklist;
}

export interface CollegeChecklist {
  gpa: boolean;
  satAct: boolean;
  apCourses: boolean;
  tier1: boolean;
  tier2: boolean;
  essays: boolean;
  letters: boolean;
  interview: boolean;
  supplementals: boolean;
  financialAid: boolean;
}

export const MAJORS: Major[] = [
  'Computer Science',
  'Engineering',
  'Pre-Med / Biology',
  'Business / Finance',
  'Political Science',
  'Humanities',
  'Arts & Design',
  'Undeclared',
  'Other (Self-Insert)',
];

export const MINORS: Minor[] = [
  'None',
  'Data Science',
  'Entrepreneurship',
  'Public Policy',
  'Cognitive Science',
  'Philosophy',
  'Music',
  'Environmental Science',
  'Other (Self-Insert)',
];

export const EC_TYPES: EcType[] = ['Research', 'Professional/Internship', 'Competition', 'Community Service'];

export const APP_STAGES: AppStage[] = ['Wishlist', 'Preparing', 'Applied', 'Interviewing', 'Accepted'];

export function emptyChecklist(): CollegeChecklist {
  return {
    gpa: false, satAct: false, apCourses: false, tier1: false, tier2: false,
    essays: false, letters: false, interview: false, supplementals: false, financialAid: false,
  };
}
