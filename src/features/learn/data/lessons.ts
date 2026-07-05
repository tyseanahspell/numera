import type { Lesson, Quiz } from '@/shared/types';

function createQuiz(lessonId: string, questions: Quiz['questions']): Quiz {
  return { id: `quiz_${lessonId}`, lessonId, questions };
}

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'history',
    title: 'History of Numerology',
    topic: 'Foundations',
    description: 'Explore the ancient roots of numerology across cultures.',
    durationMinutes: 8,
    experienceLevel: 'beginner',
    order: 1,
    content: `# History of Numerology

Numerology is the study of the symbolic meaning of numbers. Its roots stretch across ancient civilizations.

## Ancient Origins

**Pythagoras (c. 570–495 BCE)** — The Greek philosopher is often credited with formalizing number symbolism in the Western tradition. He believed "all is number."

**Babylonian & Chaldean traditions** — Ancient Mesopotamian cultures used numbers in divination and astronomy, influencing later Chaldean numerology.

**Chinese numerology** — Numbers carry auspicious and inauspicious meanings. Eight (八) is considered lucky; four (四) is often avoided.

**Indian Vedic tradition** — Numbers connect to planetary energies and life paths in Jyotish (Vedic astrology).

## Modern Era

In the 20th century, **L. Dow Balliett** and **Dr. Juno Jordan** popularized Pythagorean numerology in English. Today, numerology is practiced worldwide as a tool for self-reflection.

> Remember: Numerology is a spiritual practice for personal exploration, not a science.`,
    quiz: createQuiz('history', [
      {
        id: 'h1',
        question: 'Who is often credited with formalizing Western number symbolism?',
        options: ['Plato', 'Pythagoras', 'Aristotle', 'Euclid'],
        correctIndex: 1,
        explanation: 'Pythagoras believed "all is number" and developed early Western numerological concepts.',
      },
      {
        id: 'h2',
        question: 'Chaldean numerology originated from which region?',
        options: ['Greece', 'Egypt', 'Mesopotamia', 'India'],
        correctIndex: 2,
        explanation: 'Chaldean numerology has roots in ancient Babylonian/Mesopotamian traditions.',
      },
    ]),
  },
  {
    id: 'pythagorean',
    title: 'Pythagorean Numerology',
    topic: 'Systems',
    description: 'Learn the most widely used Western numerology system.',
    durationMinutes: 10,
    experienceLevel: 'beginner',
    order: 2,
    content: `# Pythagorean Numerology

The Pythagorean system assigns numbers 1–9 to the Latin alphabet in repeating cycles.

## Letter Chart

| Letters | Value |
|---------|-------|
| A, J, S | 1 |
| B, K, T | 2 |
| C, L, U | 3 |
| D, M, V | 4 |
| E, N, W | 5 |
| F, O, X | 6 |
| G, P, Y | 7 |
| H, Q, Z | 8 |
| I, R | 9 |

## Key Numbers

- **Life Path** — From birth date
- **Expression** — From full birth name
- **Soul Urge** — From vowels
- **Personality** — From consonants

## Reduction Rules

Digits are summed and reduced to a single digit (1–9), except **Master Numbers** 11, 22, and 33 which are often preserved.`,
    quiz: createQuiz('pythagorean', [
      {
        id: 'p1',
        question: 'In Pythagorean numerology, what value does the letter A have?',
        options: ['1', '3', '7', '9'],
        correctIndex: 0,
        explanation: 'A is the first letter and maps to 1 in the Pythagorean chart.',
      },
      {
        id: 'p2',
        question: 'Which numbers are considered Master Numbers?',
        options: ['10, 20, 30', '11, 22, 33', '7, 8, 9', '1, 5, 9'],
        correctIndex: 1,
        explanation: 'Master Numbers 11, 22, and 33 carry amplified energy in most traditions.',
      },
    ]),
  },
  {
    id: 'chaldean',
    title: 'Chaldean Numerology',
    topic: 'Systems',
    description: 'Discover the ancient Chaldean system and how it differs.',
    durationMinutes: 10,
    experienceLevel: 'intermediate',
    order: 3,
    content: `# Chaldean Numerology

Chaldean numerology uses different letter values and is based on sound vibrations rather than alphabetical position.

## Key Differences

1. **No number 9** in the letter chart
2. **Different assignments** — e.g., A=1 but I=1, J=1, Q=1, Y=1
3. **Birth name emphasis** — Uses the name you were given at birth
4. **Compound numbers** — Numbers 10–52 have individual meanings before reduction

## When to Use

Many practitioners use Pythagorean for general readings and Chaldean for name analysis. Numera supports both systems in settings.`,
    quiz: createQuiz('chaldean', [
      {
        id: 'c1',
        question: 'Which number is NOT used in the Chaldean letter chart?',
        options: ['7', '8', '9', '6'],
        correctIndex: 2,
        explanation: 'The Chaldean system omits 9 from its letter-to-number mapping.',
      },
    ]),
  },
  {
    id: 'master-numbers',
    title: 'Master Numbers',
    topic: 'Core Concepts',
    description: 'Understand the power and responsibility of 11, 22, and 33.',
    durationMinutes: 7,
    experienceLevel: 'intermediate',
    order: 4,
    content: `# Master Numbers

Master Numbers — **11**, **22**, and **33** — are not reduced to single digits in most readings because they carry amplified spiritual significance.

## 11 — The Illuminator
Intuition, inspiration, spiritual insight. Many numerologists see 11 as a "channel" for higher awareness.

## 22 — The Master Builder
Practical vision combined with spiritual purpose. Turning dreams into reality on a large scale.

## 33 — The Master Teacher
Compassionate service, healing, and guidance. The rarest master number in many charts.

## Living Master Numbers

Having a Master Number doesn't mean life is "better" — it often indicates greater potential alongside greater challenges.`,
    quiz: createQuiz('master-numbers', [
      {
        id: 'm1',
        question: 'Which is NOT a Master Number?',
        options: ['11', '22', '33', '44'],
        correctIndex: 3,
        explanation: 'The three recognized Master Numbers are 11, 22, and 33.',
      },
    ]),
  },
  {
    id: 'karmic-debt',
    title: 'Karmic Debt Numbers',
    topic: 'Core Concepts',
    description: 'Learn about the lessons of numbers 13, 14, 16, and 19.',
    durationMinutes: 8,
    experienceLevel: 'intermediate',
    order: 5,
    content: `# Karmic Debt Numbers

Karmic Debt numbers — **13**, **14**, **16**, and **19** — appear during calculation before final reduction. They suggest areas of life lessons.

## The Four Karmic Debts

| Number | Lesson Theme |
|--------|-------------|
| 13 | Hard work, discipline (from lazy 1+3=4 patterns) |
| 14 | Moderation, commitment (from abuse of freedom) |
| 16 | Humility, introspection (from ego destruction) |
| 19 | Independence, self-reliance (from misuse of power) |

## Perspective

Many numerologists view karmic debt as growth opportunities, not punishment. You might consider what patterns these numbers invite you to reflect on.`,
    quiz: createQuiz('karmic-debt', [
      {
        id: 'k1',
        question: 'How many Karmic Debt numbers are traditionally recognized?',
        options: ['2', '4', '6', '9'],
        correctIndex: 1,
        explanation: 'The four Karmic Debt numbers are 13, 14, 16, and 19.',
      },
    ]),
  },
  {
    id: 'personal-cycles',
    title: 'Personal Cycles',
    topic: 'Timing',
    description: 'Personal Years, Months, and Days explained.',
    durationMinutes: 9,
    experienceLevel: 'beginner',
    order: 6,
    content: `# Personal Cycles

Your numerology chart includes timing cycles that many practitioners use for reflection.

## Personal Year
**Formula:** Birth Month + Birth Day + Current Year (digits summed)

Each Personal Year (1–9) carries themes of initiation, partnership, expression, foundation, change, nurture, introspection, achievement, and completion.

## Personal Month
**Formula:** Personal Year + Current Calendar Month

## Personal Day
**Formula:** Personal Month + Current Calendar Day

These cycles are tools for mindfulness — not predictions of specific events.`,
    quiz: createQuiz('personal-cycles', [
      {
        id: 'pc1',
        question: 'Personal Year is calculated using which elements?',
        options: ['Name only', 'Birth month, day, and current year', 'Current date only', 'Age in years'],
        correctIndex: 1,
        explanation: 'Personal Year combines your birth month, birth day, and the digits of the current year.',
      },
    ]),
  },
  {
    id: 'compatibility',
    title: 'Compatibility',
    topic: 'Relationships',
    description: 'How numerologists compare charts for relationship insight.',
    durationMinutes: 8,
    experienceLevel: 'intermediate',
    order: 7,
    content: `# Numerology Compatibility

Compatibility readings compare two people's core numbers — primarily Life Path numbers.

## What Is Compared

- Life Path harmony
- Expression number dynamics
- Soul Urge compatibility
- Personal Year alignment

## A Balanced View

Compatible numbers suggest natural ease; challenging combinations suggest growth areas. Neither is "good" or "bad" — both offer opportunities for understanding.`,
    quiz: createQuiz('compatibility', [
      {
        id: 'co1',
        question: 'Which number is most commonly compared for compatibility?',
        options: ['Birthday Number', 'Life Path', 'Balance Number', 'Personal Day'],
        correctIndex: 1,
        explanation: 'Life Path is the primary number used in most compatibility analyses.',
      },
    ]),
  },
  {
    id: 'angel-numbers',
    title: 'Angel Numbers',
    topic: 'Signs',
    description: 'Repeating numbers and their traditional meanings.',
    durationMinutes: 6,
    experienceLevel: 'beginner',
    order: 8,
    content: `# Angel Numbers

Angel numbers are repeating number sequences (111, 222, 333, etc.) that many spiritual traditions interpret as signs or messages.

## Common Sequences

- **111** — New beginnings, alignment, manifestation
- **222** — Balance, partnership, patience
- **333** — Creativity, expression, ascended guidance
- **444** — Foundation, protection, stability
- **555** — Change, transformation, freedom

## A Thoughtful Approach

Pattern recognition is natural to the human brain. Whether you view repeating numbers as spiritual signs or meaningful coincidence, they can serve as prompts for reflection.`,
    quiz: createQuiz('angel-numbers', [
      {
        id: 'a1',
        question: 'What does 222 commonly represent in angel number traditions?',
        options: ['New beginnings', 'Balance and partnership', 'Major change', 'Completion'],
        correctIndex: 1,
        explanation: '222 is traditionally associated with balance, harmony, and partnership.',
      },
    ]),
  },
  {
    id: 'repeating-numbers',
    title: 'Repeating Numbers',
    topic: 'Signs',
    description: 'Why we notice patterns and what they might mean.',
    durationMinutes: 5,
    experienceLevel: 'beginner',
    order: 9,
    content: `# Repeating Numbers

Seeing the same number repeatedly — on clocks, receipts, addresses — is a common experience.

## Psychological Perspective

Our reticular activating system filters information, making familiar patterns stand out. This is called **frequency illusion** (Baader-Meinhof phenomenon).

## Spiritual Perspective

Many traditions view repeating numbers as synchronicity — meaningful coincidence that invites contemplation.

Both perspectives can coexist. The value lies in what reflection the experience prompts for you.`,
    quiz: createQuiz('repeating-numbers', [
      {
        id: 'r1',
        question: 'What is the "frequency illusion" also known as?',
        options: ['Baader-Meinhof phenomenon', 'Doppler effect', 'Placebo effect', 'Halo effect'],
        correctIndex: 0,
        explanation: 'The Baader-Meinhof phenomenon explains why we notice patterns once they enter our awareness.',
      },
    ]),
  },
  {
    id: 'name-numbers',
    title: 'Name Numbers',
    topic: 'Core Concepts',
    description: 'Expression, Soul Urge, and Personality from your name.',
    durationMinutes: 8,
    experienceLevel: 'beginner',
    order: 10,
    content: `# Name Numbers

Your birth name carries three primary numbers in Pythagorean numerology.

## Expression (Destiny)
All letters summed — your natural talents and life direction.

## Soul Urge (Heart's Desire)
Vowels only — inner motivations and deepest desires.

## Personality
Consonants only — how others perceive you.

## Name Changes

If you've changed your name, many numerologists compare both names. Your birth name typically remains the foundation.`,
    quiz: createQuiz('name-numbers', [
      {
        id: 'n1',
        question: 'Soul Urge is calculated from which letters?',
        options: ['Consonants', 'Vowels', 'First letters only', 'Last letters only'],
        correctIndex: 1,
        explanation: 'Soul Urge uses only the vowels in your name.',
      },
    ]),
  },
  {
    id: 'birth-numbers',
    title: 'Birth Numbers',
    topic: 'Core Concepts',
    description: 'Life Path and Birthday numbers from your birth date.',
    durationMinutes: 7,
    experienceLevel: 'beginner',
    order: 11,
    content: `# Birth Numbers

Your birth date reveals two fundamental numbers.

## Life Path Number
The sum of all digits in your birth date, reduced. Considered the most significant number — your life's overarching theme.

## Birthday Number
The day of the month you were born, reduced. Represents a special gift or talent you carry.

## Example

Born September 14, 1992:
- Life Path: 9+1+4+1+9+9+2 = 35 → 3+5 = **8**
- Birthday: 14 → 1+4 = **5**`,
    quiz: createQuiz('birth-numbers', [
      {
        id: 'b1',
        question: 'Which birth date number is considered most significant?',
        options: ['Birthday Number', 'Life Path Number', 'Personal Day', 'Balance Number'],
        correctIndex: 1,
        explanation: 'Life Path is widely considered the most important number in a chart.',
      },
    ]),
  },
  {
    id: 'myths',
    title: 'Numerology Myths',
    topic: 'Foundations',
    description: 'Common misconceptions debunked with clarity.',
    durationMinutes: 6,
    experienceLevel: 'beginner',
    order: 12,
    content: `# Numerology Myths

Let's address common misconceptions with clarity.

## Myth 1: "Numerology predicts the future"
**Reality:** Numerology describes tendencies and themes for reflection, not fixed outcomes.

## Myth 2: "Some numbers are lucky or unlucky"
**Reality:** Every number has strengths and challenges. Context matters more than the number itself.

## Myth 3: "You must use your current name"
**Reality:** Most traditions prioritize the birth name, though name changes can add layers.

## Myth 4: "Master Numbers are always better"
**Reality:** Master Numbers carry amplified energy — both potential and challenge.

## Myth 5: "Numerology is scientifically proven"
**Reality:** It's a spiritual and self-reflection practice. Enjoy it as one tool among many for personal growth.`,
    quiz: createQuiz('myths', [
      {
        id: 'my1',
        question: 'What is numerology primarily used for?',
        options: ['Scientific prediction', 'Self-reflection and exploration', 'Medical diagnosis', 'Legal decisions'],
        correctIndex: 1,
        explanation: 'Numerology is a tool for self-reflection and personal exploration.',
      },
    ]),
  },
];
