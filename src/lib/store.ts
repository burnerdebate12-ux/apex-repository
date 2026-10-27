import type { OnboardingSurvey, CourseNode, TrackedCollege, AppStage, CollegeChecklist } from './types';

const KEYS = {
  survey: 'apex_survey',
  apexResults: 'apex_results',
  courses: 'apex_courses',
  colleges: 'apex_colleges',
  activeView: 'apex_active_view',
  apLessons: 'apex_ap_lessons',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const StoreKeys = KEYS;

export function defaultSurvey(): OnboardingSurvey {
  return {
    name: '',
    email: '',
    password: '',
    major: 'Undeclared',
    customMajor: '',
    minor: 'None',
    customMinor: '',
    dualMajor: false,
    dualMajorFields: '',
    ecType: 'Research',
    researchFocus: '',
    internshipLocation: '',
    internshipType: '',
    ecSpecifics: '',
    family: {
      householdIncome: 'Under $30k',
      dependents: 1,
      firstGenCollege: false,
      financialNeed: false,
    },
    submitted: false,
  };
}

export function defaultCourses(): CourseNode[] {
  return [
    {
      id: 'c1',
      title: 'Foundations of Algorithmic Thinking',
      subtitle: 'Coreground · Module 1',
      body: [
        'Algorithms are precise sequences of steps that solve a problem. The same problem can often be solved by many different algorithms, and choosing the right one is a skill you will practice throughout this course.',
        'We measure algorithms by their time complexity — how the number of operations grows as the input grows. An algorithm that scales linearly (O(n)) is usually preferable to one that scales quadratically (O(n²)).',
        'Before writing any code, it helps to think in pseudocode: plain-language steps that capture the logic without worrying about syntax. This module trains that habit.',
      ],
      quiz: [
        {
          q: 'Which complexity is generally better for large inputs?',
          options: ['O(n²)', 'O(n)', 'O(2ⁿ)', 'O(n!)'],
          answer: 1,
        },
        {
          q: 'Pseudocode is best described as…',
          options: [
            'A compiled programming language',
            'Plain-language steps describing logic',
            'A type of machine code',
            'A debugging tool',
          ],
          answer: 1,
        },
      ],
      state: 'available',
    },
    {
      id: 'c2',
      title: 'Data Structures in Practice',
      subtitle: 'Coreground · Module 2',
      body: [
        'A data structure is a way of organizing data so it can be used efficiently. Arrays give constant-time access by index; linked lists give constant-time insertion at the head.',
        'Hash maps trade a bit of memory for near-constant-time lookup by key. They are the workhorse behind almost every modern application cache.',
        'Trees — and especially balanced trees — keep operations efficient even as the dataset grows. Binary search trees are the gateway to understanding recursion and divide-and-conquer.',
      ],
      quiz: [
        {
          q: 'Which structure gives O(1) access by index?',
          options: ['Linked list', 'Array', 'Binary tree', 'Hash set'],
          answer: 1,
        },
        {
          q: 'A hash map provides roughly…',
          options: ['O(n) lookup', 'O(log n) lookup', 'O(1) lookup', 'O(n²) lookup'],
          answer: 2,
        },
      ],
      state: 'locked',
    },
    {
      id: 'c3',
      title: 'Writing That Persuades',
      subtitle: 'Coreground · Module 3',
      body: [
        'Strong academic writing begins with a claim and supports it with evidence. A claim without evidence is an opinion; evidence without a claim is a list of facts.',
        'Transitions are the connective tissue of an essay. Each paragraph should hand the reader cleanly to the next, not start a new thought from scratch.',
        'Revision is where good writing becomes great. Read your draft aloud — the sentences that trip your tongue are the ones your reader will stumble on too.',
      ],
      quiz: [
        {
          q: 'A strong paragraph should…',
          options: [
            'Open a brand-new unrelated topic',
            'Hand the reader to the next idea',
            'Repeat the previous point',
            'Avoid transitions',
          ],
          answer: 1,
        },
        {
          q: 'Reading a draft aloud helps you find…',
          options: ['Spelling errors only', 'Sentences that trip the tongue', 'Citations', 'Formatting bugs'],
          answer: 1,
        },
      ],
      state: 'locked',
    },
    {
      id: 'c4',
      title: 'Calculus Intuition',
      subtitle: 'Coreground · Module 4',
      body: [
        'Calculus is the study of change. The derivative answers "how fast is this changing right now?"; the integral answers "how much has accumulated over an interval?"',
        'Limits are the foundation. A derivative is a limit of average rates as the interval shrinks to zero. An integral is a limit of Riemann sums as the slices grow infinitely thin.',
        'The Fundamental Theorem of Calculus ties the two together: differentiation and integration are inverse operations. This is the centerpiece of the entire subject.',
      ],
      quiz: [
        {
          q: 'The derivative measures…',
          options: ['Total accumulation', 'Instantaneous rate of change', 'Average value', 'A limit of sums'],
          answer: 1,
        },
        {
          q: 'The Fundamental Theorem connects…',
          options: [
            'Algebra and geometry',
            'Differentiation and integration',
            'Trigonometry and calculus',
            'Statistics and probability',
          ],
          answer: 1,
        },
      ],
      state: 'locked',
    },
    {
      id: 'c5',
      title: 'Capstone Synthesis',
      subtitle: 'Coreground · Module 5',
      body: [
        'The capstone asks you to combine every skill from the pathway: design an algorithm, structure your evidence, communicate the result, and quantify the tradeoffs.',
        'You will write a short technical brief and present it. The goal is clarity for a non-specialist audience — the most demanding audience there is.',
        'When you finish, the next node glows gold. Your Coreground pathway is complete.',
      ],
      quiz: [
        {
          q: 'A capstone brief should be written for…',
          options: ['A specialist only', 'A non-specialist audience', 'No audience', 'A grading script'],
          answer: 1,
        },
        {
          q: 'The capstone combines…',
          options: ['One skill', 'Two unrelated skills', 'Every skill in the pathway', 'Only writing'],
          answer: 2,
        },
      ],
      state: 'locked',
    },
  ];
}

export function nextStage(stage: AppStage): AppStage {
  const order: AppStage[] = ['Wishlist', 'Preparing', 'Applied', 'Interviewing', 'Accepted'];
  const i = order.indexOf(stage);
  if (i === -1) return stage;
  return order[Math.min(i + 1, order.length - 1)];
}

export function emptyColleges(): TrackedCollege[] {
  return [];
}

export function emptyChecklist(): CollegeChecklist {
  return {
    gpa: false, satAct: false, apCourses: false, tier1: false, tier2: false,
    essays: false, letters: false, interview: false, supplementals: false, financialAid: false,
  };
}
