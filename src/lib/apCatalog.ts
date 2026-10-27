// Comprehensive AP catalog — all 38 AP courses with real lesson content, quizzes, and Khan Academy links.

export interface ApLesson {
  title: string;
  body: string[];
  quiz: { q: string; options: string[]; answer: number }[];
  khanUrl: string;
}

export interface ApCourse {
  code: string;
  name: string;
  category: 'Math & CS' | 'Science' | 'History & Social Science' | 'English' | 'Arts' | 'World Languages';
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  typicalYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Flexible';
  lessons: ApLesson[];
}

export const AP_COURSES: ApCourse[] = [
  // ---------- MATH & CS ----------
  {
    code: 'AP CSP',
    name: 'AP Computer Science Principles',
    category: 'Math & CS',
    difficulty: 2,
    description: 'A broad introduction to computing: creativity, algorithms, programming, the internet, and data. Less coding-heavy than AP CSA, more conceptual.',
    typicalYear: 'Freshman',
    lessons: [
      {
        title: 'What is Computing?',
        body: [
          'Computing is the process of using computers to solve problems and process information. A computer takes input, processes it according to a set of instructions, and produces output.',
          'The power of computing comes from its speed, storage, and programmability. The same hardware can run a spreadsheet, render a game, or train a model — the program determines the behavior.',
          'Abstraction is the central idea in this course: hiding unnecessary detail so you can focus on what matters at each level. A user does not need to know how a CPU works to send an email.',
        ],
        quiz: [
          { q: 'Abstraction in computing means…', options: ['Adding more detail', 'Hiding unnecessary detail', 'Speeding up the CPU', 'Removing all data'], answer: 1 },
          { q: 'What does a computer do with input?', options: ['Ignores it', 'Processes it per instructions', 'Stores it forever', 'Deletes it'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/computing/csp',
      },
      {
        title: 'The Internet & Data',
        body: [
          'The internet is a network of networks. Data travels in packets, and routers direct each packet toward its destination. No single computer controls the whole system.',
          'Redundancy — multiple paths between points — makes the internet resilient. If one route fails, packets find another way. This is why the internet was designed as decentralized.',
          'Big data refers to datasets too large to process by hand. We use computing to find patterns, make predictions, and sometimes to draw conclusions that affect people — which raises ethical questions.',
        ],
        quiz: [
          { q: 'The internet routes data as…', options: ['Single streams', 'Packets', 'Continuous waves', 'Printed pages'], answer: 1 },
          { q: 'Why is the internet resilient?', options: ['It has one strong cable', 'Redundant paths', 'It is never used', 'It is centralized'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/computing/csp/internet',
      },
      {
        title: 'Algorithms & Programming',
        body: [
          'An algorithm is a finite sequence of steps that solves a problem. Programs express algorithms in a language a computer can execute. Sequencing, selection, and iteration are the three building blocks.',
          'Selection lets a program make decisions (if-then-else). Iteration lets it repeat (loops). Combine these two and you can express almost any logic.',
          'Good programmers test their code on edge cases — the empty list, the maximum value, the negative number. Bugs hide where you are not looking.',
        ],
        quiz: [
          { q: 'The three building blocks of programming are sequencing, selection, and…', options: ['Compilation', 'Iteration', 'Encryption', 'Hashing'], answer: 1 },
          { q: 'Selection in a program is also called…', options: ['if-then-else', 'a loop', 'a function', 'a variable'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/computing/csp/programming',
      },
    ],
  },
  {
    code: 'AP CSA',
    name: 'AP Computer Science A',
    category: 'Math & CS',
    difficulty: 4,
    description: 'A college-level intro to software engineering in Java. Object-oriented design, data structures (arrays, ArrayLists), and algorithm analysis. Heavy on code.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Java Fundamentals',
        body: [
          'Java is a strongly-typed, object-oriented language. Every variable has a declared type, and the compiler catches type mismatches before the program runs.',
          'A class is a blueprint; an object is an instance built from that blueprint. Methods define behavior; fields define state. The main method is the entry point of a Java program.',
          'Scope determines where a variable is visible. Local variables live inside a method; instance fields live inside an object and persist for the object lifetime.',
        ],
        quiz: [
          { q: 'Java is…', options: ['Dynamically typed', 'Strongly typed', 'Untyped', 'Script only'], answer: 1 },
          { q: 'An object is…', options: ['A blueprint', 'An instance of a class', 'A method', 'A keyword'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/computing/java',
      },
      {
        title: 'Arrays & ArrayLists',
        body: [
          'An array is a fixed-size, contiguous block of values accessed by index. Once created, its length cannot change. Arrays are fast but inflexible.',
          'An ArrayList is a resizable array that grows as you add elements. It stores objects (not primitives) and provides add, get, set, and remove methods.',
          'Traversing a collection means visiting every element. Off-by-one errors — starting at the wrong index or stopping too early/late — are the most common bug when traversing.',
        ],
        quiz: [
          { q: 'An array in Java…', options: ['Can resize', 'Has fixed size', 'Stores methods', 'Is unordered'], answer: 1 },
          { q: 'ArrayList differs from array because it…', options: ['Resizes automatically', 'Is primitive-only', 'Cannot be traversed', 'Has no methods'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/computing/java/data-structures',
      },
    ],
  },
  {
    code: 'AP Calc AB',
    name: 'AP Calculus AB',
    category: 'Math & CS',
    difficulty: 4,
    description: 'Differential and integral calculus of a single variable: limits, derivatives, applications of derivatives, integrals, and the Fundamental Theorem.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Limits & Continuity',
        body: [
          'A limit describes the value a function approaches as the input approaches some point. Limits do not require the function to be defined at that point — only nearby.',
          'A function is continuous at a point if the limit exists, the function is defined there, and the limit equals the value. Continuity is what makes functions well-behaved.',
          'The squeeze theorem lets you find a limit by trapping a function between two simpler functions whose limits you know.',
        ],
        quiz: [
          { q: 'A function is continuous when…', options: ['The limit equals the value', 'The function is undefined', 'The graph has jumps', 'The derivative is zero'], answer: 0 },
          { q: 'The squeeze theorem…', options: ['Squeezes a function between two known limits', 'Removes limits', 'Compiles code', 'Solves equations directly'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-calculus-ab',
      },
      {
        title: 'Derivatives',
        body: [
          'The derivative measures instantaneous rate of change. Geometrically, it is the slope of the tangent line at a point.',
          'Key rules: power rule, product rule, quotient rule, and chain rule. The chain rule is the one students forget under pressure — practice it until it is reflexive.',
          'Derivatives model motion (velocity is the derivative of position), growth (marginal cost), and optimization (find where the derivative is zero to locate extrema).',
        ],
        quiz: [
          { q: 'The derivative geometrically is…', options: ['The area under the curve', 'The slope of the tangent line', 'The average value', 'The y-intercept'], answer: 1 },
          { q: 'The chain rule is used for…', options: ['Products', 'Quotients', 'Composite functions', 'Constants'], answer: 2 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-calculus-ab/ab-derivative-rules',
      },
      {
        title: 'Integrals & the Fundamental Theorem',
        body: [
          'An integral accumulates quantities. Geometrically, the definite integral is the signed area under a curve between two bounds.',
          'The Fundamental Theorem of Calculus connects differentiation and integration: they are inverse operations. Evaluate an antiderivative at the bounds to compute the definite integral.',
          'Integration techniques include u-substitution, integration by parts, and partial fractions. Each undoes a corresponding differentiation rule.',
        ],
        quiz: [
          { q: 'The Fundamental Theorem connects…', options: ['Algebra and geometry', 'Differentiation and integration', 'Trigonometry and calculus', 'Statistics and probability'], answer: 1 },
          { q: 'A definite integral gives…', options: ['A single number (signed area)', 'A function', 'A slope', 'A limit'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-calculus-ab/ab-integration',
      },
    ],
  },
  {
    code: 'AP Calc BC',
    name: 'AP Calculus BC',
    category: 'Math & CS',
    difficulty: 5,
    description: 'Everything in Calc AB plus parametric/polar/vector functions, sequences and series, and advanced integration techniques. The fast-track calculus course.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Series & Convergence',
        body: [
          'A series is the sum of a sequence. A series converges if the partial sums approach a finite limit; otherwise it diverges.',
          'Tests for convergence: the ratio test, the integral test, the comparison test, and the alternating series test. Each works best on certain shapes of series.',
          'Taylor series approximate functions as infinite polynomials. A few terms of a Taylor series can approximate sin, cos, and e^x to high precision.',
        ],
        quiz: [
          { q: 'A series converges when…', options: ['Partial sums approach a finite limit', 'Terms grow without bound', 'All terms are zero', 'It is finite by definition'], answer: 0 },
          { q: 'Taylor series approximate functions using…', options: ['Logarithms only', 'Infinite polynomials', 'Fractions', 'Matrices'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-calculus-bc',
      },
    ],
  },
  {
    code: 'AP Stats',
    name: 'AP Statistics',
    category: 'Math & CS',
    difficulty: 3,
    description: 'Collecting, representing, and interpreting data. Probability, sampling, hypothesis testing, and confidence intervals. Less algebra, more interpretation.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Describing Data',
        body: [
          'Summary statistics describe a distribution: mean and median for center, standard deviation and IQR for spread. Always report center and spread together.',
          'A distribution shape matters — skewed distributions pull the mean toward the tail, while the median stays put. Outliers can dominate the mean.',
          'Graphs reveal shape: histograms for quantitative data, boxplots for comparing groups, scatterplots for relationships between two variables.',
        ],
        quiz: [
          { q: 'In a right-skewed distribution, the mean is…', options: ['Less than the median', 'Equal to the median', 'Greater than the median', 'Always zero'], answer: 2 },
          { q: 'IQR measures…', options: ['Center', 'Spread', 'Skew', 'Outliers only'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-statistics',
      },
      {
        title: 'Inference & Hypothesis Testing',
        body: [
          'A confidence interval estimates a population parameter with a margin of error. A 95% CI means that, over many samples, 95% of intervals will contain the true parameter.',
          'A hypothesis test asks: could this result have arisen by chance? The p-value is the probability of a result at least as extreme, assuming the null hypothesis is true.',
          'Small p-values (< 0.05) are evidence against the null. But a small p-value is not proof — and a large one is not proof of the null either.',
        ],
        quiz: [
          { q: 'A p-value represents…', options: ['The probability the null is true', 'The probability of a result at least as extreme under the null', 'The margin of error', 'The sample size'], answer: 1 },
          { q: 'A 95% confidence interval means…', options: ['95% of data falls in it', '95% of such intervals contain the parameter', 'The parameter is 95', 'The test is 95% powerful'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/ap-statistics/inference',
      },
    ],
  },
  {
    code: 'AP Precalc',
    name: 'AP Precalculus',
    category: 'Math & CS',
    difficulty: 3,
    description: 'Polynomial and rational functions, exponential and logarithmic functions, trigonometry, and polar/parametric functions. The bridge to calculus.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Functions & Their Behavior',
        body: [
          'A function maps each input to exactly one output. Key features: domain, range, intercepts, zeros, end behavior, and asymptotes.',
          'Rational functions have vertical asymptotes where the denominator is zero (and the numerator is not) and horizontal asymptotes set by the degrees of numerator and denominator.',
          'Composition f(g(x)) chains functions. Inverse functions undo each other: f(f⁻¹(x)) = x. Not every function has an inverse — it must be one-to-one.',
        ],
        quiz: [
          { q: 'A function must map each input to…', options: ['Multiple outputs', 'Exactly one output', 'No output', 'A random output'], answer: 1 },
          { q: 'A rational function has a vertical asymptote where…', options: ['The numerator is zero', 'The denominator is zero', 'Both are zero', 'Neither is zero'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/math/precalculus',
      },
    ],
  },

  // ---------- SCIENCE ----------
  {
    code: 'AP Bio',
    name: 'AP Biology',
    category: 'Science',
    difficulty: 4,
    description: 'Molecular biology, genetics, evolution, and ecology. Big on inquiry, data analysis, and the four big ideas: evolution, energetics, information, and systems.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'The Cell & Energetics',
        body: [
          'Cells are the basic unit of life. Prokaryotes lack a nucleus; eukaryotes have membrane-bound organelles. The cell membrane is selectively permeable.',
          'Cellular respiration converts glucose and oxygen into ATP, water, and CO₂. Photosynthesis does the reverse, capturing light energy to build glucose.',
          'Enzymes are protein catalysts that lower activation energy. They are sensitive to temperature and pH, which is why fever and acidity matter.',
        ],
        quiz: [
          { q: 'Eukaryotes differ from prokaryotes because they have…', options: ['No DNA', 'Membrane-bound organelles', 'Smaller ribosomes only', 'No cell membrane'], answer: 1 },
          { q: 'Enzymes work by…', options: ['Raising activation energy', 'Lowering activation energy', 'Adding heat', 'Destroying products'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-biology/cell-structure-and-function',
      },
      {
        title: 'Genetics & Evolution',
        body: [
          'DNA stores information in a four-letter alphabet (A, T, G, C). Genes code for proteins via transcription and translation. Mutations create variation.',
          'Mendelian genetics tracks alleles across generations. Probability predicts ratios in offspring; meiosis shuffles alleles into gametes.',
          'Evolution by natural selection favors traits that improve survival and reproduction. Variation, heritability, and differential success are the three ingredients.',
        ],
        quiz: [
          { q: 'DNA uses which four bases?', options: ['A, T, G, C', 'A, U, G, C', 'A, T, G, U', 'P, Q, R, S'], answer: 0 },
          { q: 'Natural selection requires…', options: ['Variation, heritability, differential success', 'Only mutation', 'Only environment', 'Only time'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-biology/heredity',
      },
    ],
  },
  {
    code: 'AP Chem',
    name: 'AP Chemistry',
    category: 'Science',
    difficulty: 5,
    description: 'Atomic structure, bonding, reactions, kinetics, thermodynamics, and equilibrium. Math-heavy and conceptually demanding; widely respected for rigor.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Atomic Structure & Bonding',
        body: [
          'Atoms have a nucleus of protons and neutrons surrounded by electrons in orbitals. Electron configuration determines chemical behavior.',
          'Ionic bonds transfer electrons; covalent bonds share them. Electronegativity differences predict bond polarity and molecular shape.',
          'VSEPR theory predicts molecular geometry from electron-pair repulsion. Shape determines properties like polarity and reactivity.',
        ],
        quiz: [
          { q: 'Covalent bonds form by…', options: ['Transferring electrons', 'Sharing electrons', 'Losing protons', 'Gaining neutrons'], answer: 1 },
          { q: 'VSEPR predicts…', options: ['Atomic mass', 'Molecular shape', 'Reaction rate', 'Equilibrium constant'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-chemistry',
      },
      {
        title: 'Kinetics & Equilibrium',
        body: [
          'Reaction rate depends on concentration, temperature, and activation energy. Catalysts lower activation energy without being consumed.',
          'Equilibrium is dynamic — forward and reverse reactions run at equal rates. Le Châtelier principle predicts how a system shifts when disturbed.',
          'The equilibrium constant K quantifies the ratio of products to reactants at equilibrium. Large K favors products; small K favors reactants.',
        ],
        quiz: [
          { q: 'A catalyst works by…', options: ['Increasing temperature', 'Lowering activation energy', 'Adding reactant', 'Removing product'], answer: 1 },
          { q: 'Le Châtelier principle says a disturbed equilibrium…', options: ['Stops reacting', 'Shifts to counter the disturbance', 'Becomes acidic', 'Forms a catalyst'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-chemistry/chemical-equilibrium',
      },
    ],
  },
  {
    code: 'APES',
    name: 'AP Environmental Science',
    category: 'Science',
    difficulty: 3,
    description: 'Ecosystems, energy resources, pollution, and sustainability. Interdisciplinary — draws on biology, chemistry, and Earth science.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Ecosystems & Energy Flow',
        body: [
          'Energy flows through ecosystems from the sun to producers to consumers and decomposers. At each step, most energy is lost as heat — only about 10% is passed on.',
          'Matter cycles — carbon, nitrogen, water — moving between living and non-living reservoirs. Unlike energy, matter is recycled, not lost.',
          'Biodiversity stabilizes ecosystems. Loss of a keystone species can collapse a community; invasive species can disrupt whole food webs.',
        ],
        quiz: [
          { q: 'In an energy pyramid, about what percent reaches the next level?', options: ['1%', '10%', '50%', '90%'], answer: 1 },
          { q: 'Matter in ecosystems is…', options: ['Lost as heat', 'Recycled', 'Created new', 'Destroyed'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-environmental-science',
      },
    ],
  },
  {
    code: 'AP Physics 1',
    name: 'AP Physics 1: Algebra-Based',
    category: 'Science',
    difficulty: 4,
    description: 'Mechanics: kinematics, Newton laws, energy, momentum, rotation, and waves. Algebra-based, conceptual but rigorous.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Kinematics & Newton Laws',
        body: [
          'Kinematics describes motion: position, velocity, acceleration. The four kinematic equations connect these for constant acceleration.',
          'Newton three laws: inertia, F=ma, and action-reaction. Forces cause acceleration, not velocity — a common misconception.',
          'Free-body diagrams isolate an object and show every force acting on it. Drawing one correctly solves most mechanics problems.',
        ],
        quiz: [
          { q: 'Newton second law states…', options: ['F = ma', 'E = mc²', 'F = mv', 'a = Fv'], answer: 0 },
          { q: 'Forces cause…', options: ['Velocity', 'Acceleration', 'Position', 'Mass'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-physics-1',
      },
      {
        title: 'Energy & Momentum',
        body: [
          'Energy is the capacity to do work. Kinetic energy is the energy of motion; potential energy is stored. Energy converts between forms but is conserved.',
          'Momentum is mass times velocity. In collisions, momentum is conserved if no external force acts. Impulse changes momentum.',
          'Elastic collisions conserve both momentum and kinetic energy; inelastic collisions conserve momentum but lose kinetic energy to heat or deformation.',
        ],
        quiz: [
          { q: 'In an isolated system, momentum is…', options: ['Created', 'Destroyed', 'Conserved', 'Increased'], answer: 2 },
          { q: 'Kinetic energy depends on…', options: ['Position', 'Velocity squared', 'Time', 'Acceleration only'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-physics-1/energy-momentum',
      },
    ],
  },
  {
    code: 'AP Physics 2',
    name: 'AP Physics 2: Algebra-Based',
    category: 'Science',
    difficulty: 4,
    description: 'Fluids, thermodynamics, electricity & magnetism, optics, and modern physics. Continues where Physics 1 leaves off.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Electricity & Magnetism',
        body: [
          'Electric charge creates electric fields; moving charges create magnetic fields. Like charges repel; opposite charges attract.',
          'Ohm law (V = IR) connects voltage, current, and resistance. Circuits combine resistors in series (add) and parallel (reciprocal sum).',
          'Faraday law: a changing magnetic field induces an electric field. This is the basis of generators, transformers, and much of modern technology.',
        ],
        quiz: [
          { q: 'Ohm law is…', options: ['V = IR', 'F = ma', 'E = mc²', 'P = IV'], answer: 0 },
          { q: 'A changing magnetic field induces…', options: ['A current only', 'An electric field', 'Heat only', 'Nothing'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/ap-physics-2',
      },
    ],
  },
  {
    code: 'AP Physics C',
    name: 'AP Physics C: Mechanics + E&M',
    category: 'Science',
    difficulty: 5,
    description: 'Calculus-based physics for engineering and physical-science majors. Two exams: Mechanics and Electricity & Magnetism. The most rigorous AP physics.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Calculus-Based Mechanics',
        body: [
          'Physics C uses calculus throughout. Velocity is the derivative of position; acceleration is the derivative of velocity. Integrals recover position from acceleration.',
          'Newton second law becomes a differential equation when mass or force varies. Solving it yields motion as a function of time.',
          'Angular dynamics parallels linear dynamics: torque replaces force, moment of inertia replaces mass, angular momentum replaces linear momentum.',
        ],
        quiz: [
          { q: 'Velocity is the derivative of…', options: ['Acceleration', 'Position', 'Force', 'Time'], answer: 1 },
          { q: 'The rotational analogue of force is…', options: ['Torque', 'Mass', 'Energy', 'Momentum'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/physics',
      },
    ],
  },

  // ---------- HISTORY & SOCIAL SCIENCE ----------
  {
    code: 'APUSH',
    name: 'AP United States History',
    category: 'History & Social Science',
    difficulty: 4,
    description: 'U.S. history from pre-Columbian to present. Heavy on document analysis, argumentation, and historical reasoning skills.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Colonial America & Revolution',
        body: [
          'The 13 colonies developed distinct economies: plantation South, mercantile North, mixed Middle. Slavery was foundational to Southern economy.',
          'Enlightenment ideas — natural rights, consent of the governed — shaped the Declaration of Independence and the Constitution.',
          'The Constitution was a compromise: federal vs state power, large vs small states, slave vs free. The Bill of Rights secured ratification.',
        ],
        quiz: [
          { q: 'The Declaration drew heavily on…', options: ['Enlightenment ideas', 'Divine right of kings', 'Mercantilism', 'Feudalism'], answer: 0 },
          { q: 'The Bill of Rights was added to…', options: ['Replace the Constitution', 'Secure ratification', 'End slavery', 'Tax colonies'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-us-history',
      },
      {
        title: 'Civil War & Reconstruction',
        body: [
          'The Civil War (1861-1865) was fought over slavery, states rights, and the future of the nation. The Union victory ended slavery via the 13th Amendment.',
          'Reconstruction (1865-1877) attempted to rebuild the South and protect freedmen rights. It ended with the Compromise of 1877 and Jim Crow.',
          'The 14th Amendment guaranteed equal protection; the 15th protected voting rights for Black men. Enforcement was weak for a century.',
        ],
        quiz: [
          { q: 'Slavery was formally abolished by the…', options: ['13th Amendment', '14th Amendment', '15th Amendment', 'Emancipation Proclamation alone'], answer: 0 },
          { q: 'Reconstruction ended with…', options: ['The Civil War', 'The Compromise of 1877', 'Brown v. Board', 'The New Deal'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-us-history/period-5',
      },
    ],
  },
  {
    code: 'AP World',
    name: 'AP World History: Modern',
    category: 'History & Social Science',
    difficulty: 4,
    description: 'Global history from 1200 CE to present. Themes: governance, cultural development, economic systems, and social interactions.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Global Connections 1200-1450',
        body: [
          'Before 1450, the world was already connected by trade routes — the Silk Road, the Indian Ocean network, and trans-Saharan caravans.',
          'Major states — Song China, the Abbasid Caliphate, the Mali Empire, the Mongol Empire — shaped and were shaped by these networks.',
          'Religion spread along trade routes: Islam across Afro-Eurasia, Buddhism into East Asia, Christianity along the Mediterranean.',
        ],
        quiz: [
          { q: 'Which empire created the largest contiguous land empire?', options: ['Song China', 'Mongol Empire', 'Mali', 'Abbasid'], answer: 1 },
          { q: 'Trade routes before 1450 included…', options: ['The Silk Road only', 'Silk Road, Indian Ocean, trans-Saharan', 'No major routes', 'Only sea routes'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-world-history',
      },
    ],
  },
  {
    code: 'AP Euro',
    name: 'AP European History',
    category: 'History & Social Science',
    difficulty: 4,
    description: 'European history from 1450 to present. Renaissance through modern era, with emphasis on source analysis and argumentation.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Renaissance & Reformation',
        body: [
          'The Renaissance revived classical learning and emphasized humanism — the study of humanity, its achievements, and its potential.',
          'The Protestant Reformation, sparked by Martin Luther in 1517, split Western Christianity and triggered centuries of religious conflict.',
          'The Catholic Counter-Reformation responded with the Council of Trent, reaffirming doctrine while addressing some abuses.',
        ],
        quiz: [
          { q: 'The Reformation was sparked by…', options: ['Martin Luther', 'John Calvin', 'Henry VIII', 'The Pope'], answer: 0 },
          { q: 'Renaissance humanism emphasized…', options: ['Divine revelation', 'The study of humanity', 'Military conquest', 'Trade routes'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-european-history',
      },
    ],
  },
  {
    code: 'AP Gov',
    name: 'AP U.S. Government & Politics',
    category: 'History & Social Science',
    difficulty: 3,
    description: 'U.S. political institutions, civil liberties, civil rights, political beliefs, and policy. Foundational documents and Supreme Court cases.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Constitutional Foundations',
        body: [
          'The Constitution establishes three branches with separated powers and checks and balances to prevent any one branch from dominating.',
          'Federalism divides power between national and state governments. The supremacy clause makes federal law supreme within its sphere.',
          'Foundational documents — Federalist 10, Federalist 51, the Declaration — explain the design and defend it against critics.',
        ],
        quiz: [
          { q: 'Checks and balances exist to…', options: ['Speed up laws', 'Prevent any one branch dominating', 'Reduce elections', 'Help the President'], answer: 1 },
          { q: 'Federalism divides power between…', options: ['National and state', 'Executive and judicial only', 'Two parties', 'House and Senate only'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-us-government-and-politics',
      },
    ],
  },
  {
    code: 'AP Comp Gov',
    name: 'AP Comparative Government & Politics',
    category: 'History & Social Science',
    difficulty: 3,
    description: 'Political systems of six countries: UK, Russia, China, Iran, Mexico, Nigeria. Compares institutions, regimes, and political change.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Comparing Political Systems',
        body: [
          'Regimes can be democratic, authoritarian, or hybrid. Democracies hold free elections; authoritarian regimes concentrate power and limit opposition.',
          'The six case studies span democracies (UK, Mexico), authoritarian (China, Iran), and hybrid (Russia, Nigeria) — illustrating how regime type shapes policy.',
          'Political legitimacy can come from elections, tradition, ideology, or performance. Sources of legitimacy shape how a regime responds to dissent.',
        ],
        quiz: [
          { q: 'Authoritarian regimes…', options: ['Hold free elections', 'Concentrate power and limit opposition', 'Always have monarchs', 'Cannot tax'], answer: 1 },
          { q: 'Legitimacy can come from…', options: ['Elections only', 'Elections, tradition, ideology, or performance', 'Force only', 'Wealth only'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-comparative-government',
      },
    ],
  },
  {
    code: 'AP Human Geo',
    name: 'AP Human Geography',
    category: 'History & Social Science',
    difficulty: 2,
    description: 'Population, migration, culture, political geography, agriculture, and urbanization. Often the first AP students take.',
    typicalYear: 'Freshman',
    lessons: [
      {
        title: 'Population & Migration',
        body: [
          'Population geography studies where people live and why. Demographic transition models how birth and death rates change as a country develops.',
          'Push factors (war, poverty, disaster) drive people out; pull factors (jobs, safety, family) draw them in. Migration reshapes both origin and destination.',
          'The demographic dividend — a large working-age population — can accelerate growth, but only if jobs exist.',
        ],
        quiz: [
          { q: 'Push factors…', options: ['Attract migrants', 'Drive people out', 'Are always economic', 'Do not exist'], answer: 1 },
          { q: 'Demographic transition tracks…', options: ['Birth and death rates over development', 'City sizes', 'Crop yields', 'Trade routes'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-human-geography',
      },
    ],
  },
  {
    code: 'AP Macro',
    name: 'AP Macroeconomics',
    category: 'History & Social Science',
    difficulty: 3,
    description: 'Whole-economy analysis: GDP, inflation, unemployment, fiscal and monetary policy, and international trade. Graph-heavy.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'GDP & Economic Indicators',
        body: [
          'GDP measures the total value of goods and services produced in a country. Real GDP adjusts for inflation; nominal GDP does not.',
          'Unemployment comes in three types: frictional (between jobs), structural (skills mismatch), and cyclical (recession-driven). Only cyclical is a policy problem.',
          'Inflation is a sustained rise in the price level. High inflation erodes purchasing power; deflation can stall an economy by delaying spending.',
        ],
        quiz: [
          { q: 'Real GDP differs from nominal GDP because it…', options: ['Ignores inflation', 'Adjusts for inflation', 'Is always higher', 'Measures trade only'], answer: 1 },
          { q: 'Cyclical unemployment is caused by…', options: ['Job transitions', 'Recessions', 'Skill mismatch', 'Technology'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/economics-finance-domain/ap-macroeconomics',
      },
    ],
  },
  {
    code: 'AP Micro',
    name: 'AP Microeconomics',
    category: 'History & Social Science',
    difficulty: 3,
    description: 'Individual markets: supply and demand, consumer theory, firm behavior, market structures, and market failure.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Supply & Demand',
        body: [
          'The law of demand: price up, quantity demanded down (substitution and income effects). The law of supply: price up, quantity supplied up.',
          'Equilibrium is where supply meets demand. Surpluses appear above equilibrium; shortages below.',
          'Elasticity measures responsiveness. Elastic demand means consumers are sensitive to price; inelastic demand means they are not.',
        ],
        quiz: [
          { q: 'Equilibrium is where…', options: ['Supply exceeds demand', 'Demand exceeds supply', 'Supply equals demand', 'Price is zero'], answer: 2 },
          { q: 'Inelastic demand means…', options: ['Quantity is very responsive to price', 'Quantity is not very responsive to price', 'Price is zero', 'Demand is infinite'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/economics-finance-domain/ap-microeconomics',
      },
    ],
  },
  {
    code: 'AP Psych',
    name: 'AP Psychology',
    category: 'History & Social Science',
    difficulty: 2,
    description: 'Scientific study of behavior and mental processes: biology of behavior, learning, memory, development, personality, and disorders.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Biology of Behavior',
        body: [
          'Neurons communicate via electrochemical signals across synapses. Neurotransmitters like dopamine and serotonin affect mood and behavior.',
          'The brain has specialized regions: the frontal lobe (planning), the temporal lobe (memory), the occipital lobe (vision).',
          'Nature vs nurture is a false dichotomy — behavior always reflects both genes and environment interacting.',
        ],
        quiz: [
          { q: 'Neurons communicate via…', options: ['Sound waves only', 'Electrochemical signals', 'Light only', 'Gravity'], answer: 1 },
          { q: 'The frontal lobe is associated with…', options: ['Vision', 'Planning', 'Hearing', 'Balance'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/science/psychology',
      },
    ],
  },

  // ---------- ENGLISH ----------
  {
    code: 'AP Lang',
    name: 'AP English Language & Composition',
    category: 'English',
    difficulty: 4,
    description: 'Rhetoric and argument. Reading nonfiction closely and writing persuasive essays. Skills-based, not content-based.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Rhetorical Analysis',
        body: [
          'Rhetoric is the art of persuasion. The rhetorical triangle — speaker, audience, purpose — frames every argument.',
          'Ethos (credibility), pathos (emotion), and logos (logic) are the three appeals. Strong arguments weave all three.',
          'Syntax and diction shape tone. A short sentence can land like a hammer; a long one can build a careful argument. Read aloud to hear both.',
        ],
        quiz: [
          { q: 'The three rhetorical appeals are…', options: ['Ethos, pathos, logos', 'Speaker, audience, purpose', 'Claim, evidence, warrant', 'Tone, mood, voice'], answer: 0 },
          { q: 'Pathos appeals to…', options: ['Credibility', 'Emotion', 'Logic', 'Grammar'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-english-language',
      },
      {
        title: 'Argument & Synthesis',
        body: [
          'A strong argument has a clear claim, supported by evidence and reasoning. The warrant connects evidence to claim.',
          'Synthesis combines multiple sources into a single argument. You must engage with sources, not just quote them — agree, complicate, or refute.',
          'Concession acknowledges the opposing view; refutation explains why your view still holds. Together they build credibility.',
        ],
        quiz: [
          { q: 'The warrant connects…', options: ['Evidence to claim', 'Two quotes', 'Speaker to audience', 'Tone to mood'], answer: 0 },
          { q: 'Synthesis requires you to…', options: ['Quote every source', 'Engage with sources, not just quote them', 'Ignore sources', 'Use only one source'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-english-language/writing',
      },
    ],
  },
  {
    code: 'AP Lit',
    name: 'AP English Literature',
    category: 'English',
    difficulty: 4,
    description: 'Reading imaginative literature (fiction, poetry, drama) closely and writing analytical essays about meaning, form, and craft.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Close Reading & Interpretation',
        body: [
          'Close reading examines specific words, images, and structures to infer meaning. Every choice an author makes is a clue.',
          'Theme is the central idea a work explores — not the topic. "War" is a topic; "war destroys innocence" is a theme.',
          'Figurative language — metaphor, simile, personification — works by comparison. Identify the comparison, then ask what it reveals.',
        ],
        quiz: [
          { q: 'A theme differs from a topic because it…', options: ['Is shorter', 'States a central idea about the topic', 'Is always stated directly', 'Is the setting'], answer: 1 },
          { q: 'A metaphor works by…', options: ['Direct definition', 'Comparison', 'Repetition', 'Negation'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-literature',
      },
    ],
  },

  // ---------- ARTS ----------
  {
    code: 'AP 2D Art',
    name: 'AP 2-D Art and Design',
    category: 'Arts',
    difficulty: 3,
    description: 'A portfolio-based course in 2-D design principles, drawing, photography, or digital media. Submitted as a portfolio, not an exam.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Design Principles',
        body: [
          'Composition organizes elements within a frame. Balance, emphasis, contrast, rhythm, and unity guide the eye and create meaning.',
          'Negative space is as important as positive space. The space around an object shapes how we read it.',
          'A sustained investigation — the portfolio focus — should explore a question over many pieces, not repeat a single idea.',
        ],
        quiz: [
          { q: 'Negative space refers to…', options: ['The space around objects', 'Dark colors only', 'Empty frames', 'Background music'], answer: 0 },
          { q: 'A sustained investigation…', options: ['Explores one question over many pieces', 'Repeats one idea', 'Has no focus', 'Is one piece only'], answer: 0 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/art-history',
      },
    ],
  },
  {
    code: 'AP 3D Art',
    name: 'AP 3-D Art and Design',
    category: 'Arts',
    difficulty: 3,
    description: 'A portfolio course exploring three-dimensional design: sculpture, ceramics, architecture models, and product design.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Form, Space & Structure',
        body: [
          'Three-dimensional design works with mass, volume, and space. Form follows function — but also emotion and meaning.',
          'Scale changes impact: a small object feels intimate; a large one feels monumental. Material carries meaning (glass fragility, stone permanence).',
          'A strong portfolio shows evolution — each piece building on the last — not just technical skill in isolation.',
        ],
        quiz: [
          { q: 'In 3-D design, mass refers to…', options: ['Color', 'Physical volume and weight', 'Line only', 'Texture only'], answer: 1 },
          { q: 'Material in sculpture…', options: ['Is irrelevant', 'Carries meaning (glass fragility, stone permanence)', 'Must always be metal', 'Must be hidden'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/art-history',
      },
    ],
  },
  {
    code: 'AP Drawing',
    name: 'AP Drawing',
    category: 'Arts',
    difficulty: 3,
    description: 'A portfolio course in mark-making: observational drawing, imaginative work, and experimental media. Portfolio submission only.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Mark-Making & Observation',
        body: [
          'Drawing is seeing. Train your eye to observe relationships — angle, proportion, value — before your hand moves.',
          'Line quality communicates: confident lines feel sure; sketchy lines feel searching. Match your line to your intent.',
          'Value creates form: light, shadow, and highlight turn a flat shape into a three-dimensional object on paper.',
        ],
        quiz: [
          { q: 'Value in drawing creates…', options: ['Color only', 'Form (3-D appearance)', 'Texture only', 'Line weight'], answer: 1 },
          { q: 'Good drawing starts with…', options: ['Moving the hand fast', 'Observing relationships', 'Using many colors', 'Erasing constantly'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/art-history',
      },
    ],
  },
  {
    code: 'AP Art Hist',
    name: 'AP Art History',
    category: 'Arts',
    difficulty: 3,
    description: 'Global art from prehistory to present. 250 required works spanning cultures, media, and periods. Visual, contextual, and analytical.',
    typicalYear: 'Junior',
    lessons: [
      {
        title: 'Reading Art Across Cultures',
        body: [
          'Art history examines form, content, and context. Form is how it looks; content is what it depicts; context is when, where, and why it was made.',
          'The 250 works span cultures: Egyptian, Greek, Islamic, Chinese, African, European, Indigenous American, and contemporary global.',
          'Comparison reveals influence and difference: how do two cultures depict power? The sacred? The body?',
        ],
        quiz: [
          { q: 'The three lenses of art history are…', options: ['Form, content, context', 'Color, line, shape', 'Price, artist, date', 'Style, medium, frame'], answer: 0 },
          { q: 'The 250 works span…', options: ['Only European art', 'Many cultures globally', 'Only modern art', 'Only ancient art'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-art-history',
      },
    ],
  },
  {
    code: 'AP Music',
    name: 'AP Music Theory',
    category: 'Arts',
    difficulty: 4,
    description: 'Musical notation, scales, harmony, voice-leading, and aural skills. Requires reading music and ear training.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Scales & Harmony',
        body: [
          'A scale is an ordered set of pitches. Major scales sound bright; minor scales sound dark. The pattern of intervals defines the scale.',
          'A chord is three or more notes sounding together. Triads (root, third, fifth) are the building blocks of harmony.',
          'Voice-leading connects chords smoothly. Common-tone and stepwise motion keep the music coherent; avoid parallel fifths and octaves.',
        ],
        quiz: [
          { q: 'A triad consists of…', options: ['Two notes', 'Root, third, fifth', 'Four notes', 'Any pitch'], answer: 1 },
          { q: 'Minor scales generally sound…', options: ['Bright', 'Dark', 'Identical to major', 'Atonal'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/music-theory',
      },
    ],
  },

  // ---------- WORLD LANGUAGES ----------
  {
    code: 'AP Spanish Lang',
    name: 'AP Spanish Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'Interpersonal, interpretive, and presentational Spanish. Themes: families, communities, science, art, and contemporary life.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Comunicación y Cultura',
        body: [
          'AP Spanish assesses three modes: interpersonal (conversation), interpretive (reading/listening), and presentational (speaking/writing).',
          'Cultural context matters. The exam tests not just grammar but understanding of Spanish-speaking communities and their practices.',
          'Register — formal vs informal — affects word choice. Knowing tú vs usted and when to use subjunctive is key.',
        ],
        quiz: [
          { q: 'AP Spanish assesses three modes: interpersonal, interpretive, and…', options: ['Translational', 'Presentational', 'Grammatical', 'Phonetic'], answer: 1 },
          { q: 'Usted is used for…', options: ['Close friends', 'Formal situations', 'Children only', 'Animals'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-spanish-language',
      },
    ],
  },
  {
    code: 'AP Spanish Lit',
    name: 'AP Spanish Literature',
    category: 'World Languages',
    difficulty: 5,
    description: 'Literary analysis of Spanish-language texts from medieval to contemporary. A required reading list of ~38 works.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Tradición Literaria',
        body: [
          'The required list spans the medieval Poema de mio Cid to contemporary Latin American authors like García Márquez.',
          'Literary movements — Romanticismo, Realismo, Modernismo — frame how to read each text. Identify the movement to find the conventions.',
          'Analysis examines theme, style, and historical context. Compare texts across periods and regions.',
        ],
        quiz: [
          { q: 'The AP Spanish Lit list spans from…', options: ['1900 to now', 'Medieval to contemporary', 'Only 21st century', 'Only Spanish (European)'], answer: 1 },
          { q: 'Literary movements help you…', options: ['Translate faster', 'Find conventions of each text', 'Memorize vocabulary', 'Skip reading'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-spanish-literature',
      },
    ],
  },
  {
    code: 'AP French',
    name: 'AP French Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'French proficiency across interpersonal, interpretive, and presentational modes. Themes of global francophone communities.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Langue et Culture Francophones',
        body: [
          'French is spoken across five continents. The exam covers francophone Africa, the Caribbean, and North America — not just France.',
          'Subjunctive mood expresses doubt, desire, and necessity. Recognizing triggers is essential for accuracy.',
          'Authentic sources — articles, podcasts, films — build the cultural knowledge the exam rewards.',
        ],
        quiz: [
          { q: 'French is spoken…', options: ['Only in France', 'Across five continents', 'Only in Europe', 'Only in Canada'], answer: 1 },
          { q: 'The subjunctive expresses…', options: ['Past actions only', 'Doubt, desire, necessity', 'Commands only', 'Numbers'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-french-language',
      },
    ],
  },
  {
    code: 'AP German',
    name: 'AP German Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'German proficiency and cultural knowledge. Themes: contemporary life, global challenges, science, and identity.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Sprache und Kultur',
        body: [
          'German grammar is highly inflected: four cases (nominative, accusative, dative, genitive) change articles and adjectives.',
          'Word order matters — the verb typically goes second in main clauses, last in subordinate clauses.',
          'Contemporary Germany, Austria, and Switzerland form the cultural core, but the exam also covers migration and identity.',
        ],
        quiz: [
          { q: 'German has how many cases?', options: ['Two', 'Three', 'Four', 'Six'], answer: 2 },
          { q: 'In subordinate clauses, the verb goes…', options: ['First', 'Second', 'Last', 'Anywhere'], answer: 2 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-german-language',
      },
    ],
  },
  {
    code: 'AP Chinese',
    name: 'AP Chinese Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'Mandarin Chinese proficiency across listening, speaking, reading, and writing (simplified and traditional).',
    typicalYear: 'Senior',
    lessons: [
      {
        title: '中文语言与文化',
        body: [
          'Mandarin is tonal: four tones (plus neutral) change meaning. Saying "ma" with different tones gives mother, hemp, horse, or scold.',
          'Characters encode meaning; pinyin encodes pronunciation. Both simplified and traditional characters appear on the exam.',
          'Chinese culture — family, festivals, philosophy — is woven into every theme. Language and culture are inseparable.',
        ],
        quiz: [
          { q: 'Mandarin has how many tones (excluding neutral)?', options: ['Two', 'Three', 'Four', 'Five'], answer: 2 },
          { q: 'The exam includes…', options: ['Only simplified characters', 'Only traditional', 'Both simplified and traditional', 'Pinyin only'], answer: 2 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-chinese-language',
      },
    ],
  },
  {
    code: 'AP Japanese',
    name: 'AP Japanese Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'Japanese proficiency: three writing systems (hiragana, katakana, kanji), grammar, and cultural knowledge.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: '日本語と文化',
        body: [
          'Japanese uses three scripts: hiragana (native words), katakana (loanwords), and kanji (Chinese characters). All three appear on the exam.',
          'Politeness levels — casual, polite, formal — change verb endings. Match the level to the social context.',
          'Keigo (honorific language) is essential in business and formal settings. Misusing it can cause offense.',
        ],
        quiz: [
          { q: 'Japanese uses how many writing systems?', options: ['One', 'Two', 'Three', 'Four'], answer: 2 },
          { q: 'Keigo is…', options: ['Casual speech', 'Honorific language', 'A writing system', 'A dialect'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-japanese-language',
      },
    ],
  },
  {
    code: 'AP Italian',
    name: 'AP Italian Language & Culture',
    category: 'World Languages',
    difficulty: 4,
    description: 'Italian proficiency and cultural knowledge: communication, communities, and the Italian-speaking world.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Lingua e Cultura Italiana',
        body: [
          'Italian pronunciation is highly regular — words are largely pronounced as written. This makes speaking easier than reading in other languages.',
          'Italian has formal (Lei) and informal (tu) registers. Use Lei for strangers and superiors.',
          'Regional variation is significant — dialects and cuisine differ widely across Italy, reflecting a unified nation only since 1861.',
        ],
        quiz: [
          { q: 'Italian pronunciation is…', options: ['Highly irregular', 'Largely regular', 'Silent letters everywhere', 'Like English'], answer: 1 },
          { q: 'Lei is used for…', options: ['Close friends', 'Formal situations', 'Children', 'Animals'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-italian-language',
      },
    ],
  },
  {
    code: 'AP Latin',
    name: 'AP Latin',
    category: 'World Languages',
    difficulty: 5,
    description: 'Translation and analysis of Caesar Gallic War and Vergil Aeneid. Grammar-heavy; the most rigorous language AP.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Caesar & Vergil',
        body: [
          'AP Latin focuses on two authors: Caesar (prose, military, political) and Vergil (epic poetry, heroism, fate).',
          'Latin is highly inflected: case endings determine grammatical role, not word order. Identify the case before translating.',
          'Figures of speech — chiasmus, alliteration, anaphora — structure Vergil poetry. Spot them to find meaning.',
        ],
        quiz: [
          { q: 'AP Latin centers on which two authors?', options: ['Caesar and Vergil', 'Cicero and Ovid', 'Homer and Plato', 'Sallust and Livy'], answer: 0 },
          { q: 'In Latin, grammatical role is determined by…', options: ['Word order', 'Case endings', 'Articles', 'Tone'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/ap-latin',
      },
    ],
  },

  // ---------- AP CAPSTONE ----------
  {
    code: 'AP Seminar',
    name: 'AP Seminar',
    category: 'English',
    difficulty: 3,
    description: 'The first of two AP Capstone courses. Students investigate real-world issues from multiple perspectives, write research-based essays, and present an oral defense. Skills-based, not content-based.',
    typicalYear: 'Sophomore',
    lessons: [
      {
        title: 'Inquiry & Research',
        body: [
          'AP Seminar is built on inquiry. You choose a real-world issue, research it from multiple perspectives, and construct an evidence-based argument. The skill is not knowing an answer — it is learning how to find one.',
          'Source credibility is everything. A peer-reviewed study outweighs a blog post; a primary source outweighs a secondary one. Always evaluate the author, the publisher, the date, and the bias.',
          'The lens approach means examining an issue through different frameworks — cultural, ethical, economic, scientific. The same topic looks different from each angle, and a strong seminar paper triangulates across them.',
        ],
        quiz: [
          { q: 'AP Seminar is fundamentally a course about…', options: ['Memorizing facts', 'Inquiry and research', 'Public speaking only', 'Standardized tests'], answer: 1 },
          { q: 'A peer-reviewed study is generally…', options: ['Less credible than a blog', 'More credible than a blog', 'Equally credible', 'Irrelevant'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/grammar',
      },
      {
        title: 'Writing & Presenting',
        body: [
          'The Individual Research Report (IRR) requires you to analyze and evaluate a perspective on an issue. You are not arguing your own opinion yet — you are fairly representing someone else argument.',
          'The Team Multimedia Presentation (TMP) is collaborative. You and your team must synthesize individual research into a coherent, well-organized presentation with a clear thesis.',
          'The Individual Written Argument (IWA) is where you finally take a position. You must support it with evidence from your research, address counterarguments, and cite everything properly.',
        ],
        quiz: [
          { q: 'The IRR asks you to…', options: ['Argue your own opinion', 'Analyze a perspective fairly', 'Write a poem', 'Give a speech'], answer: 1 },
          { q: 'The IWA is where you…', options: ['Stay neutral', 'Take and defend a position', 'Summarize only', 'Write fiction'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/grammar/style',
      },
    ],
  },
  {
    code: 'AP Research',
    name: 'AP Research',
    category: 'English',
    difficulty: 4,
    description: 'The second AP Capstone course. Students design, conduct, and report on a year-long independent research project. Culminates in a 4,000–5,000 word academic paper and oral defense. The AP Capstone Diploma requires both Seminar and Research.',
    typicalYear: 'Senior',
    lessons: [
      {
        title: 'Designing Your Research Project',
        body: [
          'AP Research is a year-long independent project. You pick the question, design the method, collect the data, and write it up. The freedom is the challenge — there is no textbook to follow.',
          'A research question must be focused enough to answer in a year but rich enough to matter. "How does social media affect teens?" is too broad. "How does Instagram use affect sleep duration in 11th graders at my school?" is answerable.',
          'Methodology can be qualitative (interviews, case studies), quantitative (surveys, experiments, data analysis), or mixed. The method must match the question — do not force a survey onto a question that needs interviews.',
        ],
        quiz: [
          { q: 'AP Research culminates in…', options: ['A multiple-choice exam', 'A 4,000–5,000 word paper and oral defense', 'A lab report', 'A presentation only'], answer: 1 },
          { q: 'A good research question should be…', options: ['As broad as possible', 'Focused enough to answer in a year', 'Unanswerable', 'About everything'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/grammar/research',
      },
      {
        title: 'The Academic Paper & Oral Defense',
        body: [
          'The academic paper follows scholarly conventions: abstract, introduction, literature review, methodology, results, discussion, conclusion, and citations. Each section has a job — know what it is.',
          'The literature review positions your work in the existing conversation. You are not the first person to study this — show what came before, then explain what you add.',
          'The oral defense is a 15–20 minute presentation with Q&A. You must explain your research choices, defend your methodology, and discuss limitations. Know your project cold — the panel will probe.',
        ],
        quiz: [
          { q: 'The literature review…', options: ['Summarizes your results', 'Positions your work in existing research', 'Lists citations only', 'Is optional'], answer: 1 },
          { q: 'The oral defense tests whether you…', options: ['Memorized a speech', 'Understand and can defend your research choices', 'Can code', 'Have perfect grammar'], answer: 1 },
        ],
        khanUrl: 'https://www.khanacademy.org/humanities/grammar/research-methods',
      },
    ],
  },
];

export const AP_CATEGORIES = [
  'Math & CS',
  'Science',
  'History & Social Science',
  'English',
  'Arts',
  'World Languages',
] as const;
