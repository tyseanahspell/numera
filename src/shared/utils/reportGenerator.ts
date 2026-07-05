import type { NumberResult, NumerologyReport } from '../types';

const NUMBER_MEANINGS: Record<number, { title: string; essence: string; strengths: string[]; weaknesses: string[] }> = {
  1: {
    title: 'The Leader',
    essence: 'Independence, initiative, and pioneering spirit. Many numerologists interpret 1 as the energy of new beginnings and self-reliance.',
    strengths: ['Leadership', 'Determination', 'Originality', 'Courage'],
    weaknesses: ['Stubbornness', 'Impatience', 'Domineering tendencies'],
  },
  2: {
    title: 'The Peacemaker',
    essence: 'Cooperation, sensitivity, and diplomacy. This number often represents harmony and partnership.',
    strengths: ['Empathy', 'Patience', 'Cooperation', 'Intuition'],
    weaknesses: ['Indecision', 'Oversensitivity', 'Dependency'],
  },
  3: {
    title: 'The Communicator',
    essence: 'Creativity, expression, and joy. Many traditions associate 3 with artistic talent and social connection.',
    strengths: ['Creativity', 'Optimism', 'Charm', 'Self-expression'],
    weaknesses: ['Scattered focus', 'Superficiality', 'Mood swings'],
  },
  4: {
    title: 'The Builder',
    essence: 'Stability, discipline, and practical foundations. This number often represents structure and hard work.',
    strengths: ['Reliability', 'Organization', 'Discipline', 'Loyalty'],
    weaknesses: ['Rigidity', 'Workaholism', 'Resistance to change'],
  },
  5: {
    title: 'The Freedom Seeker',
    essence: 'Change, adventure, and versatility. Many numerologists see 5 as the energy of experience and adaptability.',
    strengths: ['Adaptability', 'Curiosity', 'Resourcefulness', 'Magnetism'],
    weaknesses: ['Restlessness', 'Impulsiveness', 'Inconsistency'],
  },
  6: {
    title: 'The Nurturer',
    essence: 'Responsibility, love, and service. This number often represents home, family, and healing.',
    strengths: ['Compassion', 'Responsibility', 'Healing ability', 'Artistic sense'],
    weaknesses: ['Self-sacrifice', 'Worry', 'Perfectionism'],
  },
  7: {
    title: 'The Seeker',
    essence: 'Introspection, wisdom, and spiritual depth. Many traditions associate 7 with analysis and inner knowledge.',
    strengths: ['Analytical mind', 'Intuition', 'Wisdom', 'Independence'],
    weaknesses: ['Isolation', 'Skepticism', 'Aloofness'],
  },
  8: {
    title: 'The Powerhouse',
    essence: 'Ambition, material mastery, and authority. This number often represents achievement and karmic balance.',
    strengths: ['Ambition', 'Business acumen', 'Authority', 'Resilience'],
    weaknesses: ['Work obsession', 'Materialism', 'Control issues'],
  },
  9: {
    title: 'The Humanitarian',
    essence: 'Completion, compassion, and universal love. Many numerologists interpret 9 as wisdom through experience.',
    strengths: ['Compassion', 'Generosity', 'Idealism', 'Artistic talent'],
    weaknesses: ['Emotional intensity', 'Letting go', 'Scattered giving'],
  },
  11: {
    title: 'The Illuminator',
    essence: 'Master Number of intuition and inspiration. Many numerologists see 11 as heightened spiritual awareness.',
    strengths: ['Intuition', 'Inspiration', 'Vision', 'Charisma'],
    weaknesses: ['Nervous tension', 'Impracticality', 'Self-doubt'],
  },
  22: {
    title: 'The Master Builder',
    essence: 'Master Number of practical vision. This number often represents turning dreams into tangible reality.',
    strengths: ['Vision', 'Practical idealism', 'Leadership', 'Manifestation'],
    weaknesses: ['Overwhelm', 'Self-pressure', 'Inner conflict'],
  },
  33: {
    title: 'The Master Teacher',
    essence: 'Master Number of compassionate service. Many traditions associate 33 with healing and guidance.',
    strengths: ['Healing', 'Teaching', 'Selflessness', 'Creativity'],
    weaknesses: ['Martyrdom', 'Emotional burden', 'High expectations'],
  },
};

const LUCKY_COLORS: Record<number, string[]> = {
  1: ['Red', 'Gold', 'Orange'],
  2: ['Silver', 'Cream', 'Light Green'],
  3: ['Yellow', 'Pink', 'Purple'],
  4: ['Brown', 'Green', 'Navy'],
  5: ['Turquoise', 'Silver', 'Grey'],
  6: ['Blue', 'Rose', 'Indigo'],
  7: ['Purple', 'Sea Green', 'White'],
  8: ['Black', 'Dark Blue', 'Gold'],
  9: ['Crimson', 'Gold', 'Burgundy'],
  11: ['White', 'Silver', 'Violet'],
  22: ['Coral', 'Gold', 'Cream'],
  33: ['Azure', 'Gold', 'Rose'],
};

const LUCKY_DAYS: Record<number, string[]> = {
  1: ['Sunday', 'Monday'],
  2: ['Monday', 'Friday'],
  3: ['Thursday', 'Friday'],
  4: ['Saturday', 'Sunday'],
  5: ['Wednesday', 'Friday'],
  6: ['Friday', 'Thursday'],
  7: ['Monday', 'Sunday'],
  8: ['Saturday', 'Sunday'],
  9: ['Tuesday', 'Thursday'],
  11: ['Monday', 'Thursday'],
  22: ['Saturday', 'Sunday'],
  33: ['Friday', 'Saturday'],
};

const COMPATIBLE: Record<number, number[]> = {
  1: [1, 3, 5, 7],
  2: [2, 4, 6, 8],
  3: [1, 3, 5, 9],
  4: [2, 4, 8],
  5: [1, 3, 5, 7],
  6: [2, 4, 6, 9],
  7: [1, 5, 7],
  8: [2, 4, 8],
  9: [3, 6, 9],
  11: [2, 4, 6, 11],
  22: [4, 6, 8, 22],
  33: [6, 9, 33],
};

export function getNumberMeaning(num: number) {
  return NUMBER_MEANINGS[num] ?? NUMBER_MEANINGS[reduceToSingle(num)];
}

function reduceToSingle(n: number): number {
  while (n > 9 && ![11, 22, 33].includes(n)) {
    n = String(n)
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return n;
}

export function generateReport(
  userId: string,
  numberFocus: number,
  type: NumerologyReport['type'] = 'life_path'
): NumerologyReport {
  const meaning = getNumberMeaning(numberFocus);

  return {
    id: `report_${Date.now()}`,
    userId,
    type,
    title: `${meaning.title} — Number ${numberFocus}`,
    numberFocus,
    summary: `Your ${type.replace('_', ' ')} centers on the energy of ${numberFocus}. ${meaning.essence}`,
    meaning: meaning.essence,
    strengths: meaning.strengths,
    weaknesses: meaning.weaknesses,
    career: `Many numerologists suggest that ${numberFocus} energy may align with roles requiring ${meaning.strengths[0].toLowerCase()} and ${meaning.strengths[1].toLowerCase()}. You might consider paths that allow authentic self-expression while honoring practical needs.`,
    relationships: `In relationships, ${numberFocus} often brings ${meaning.strengths[0].toLowerCase()} qualities. You might reflect on how your natural tendencies support connection and where flexibility could deepen bonds.`,
    money: `Financial patterns associated with ${numberFocus} often reflect themes of ${meaning.strengths[2]?.toLowerCase() ?? 'balance'}. Consider numerology as one lens among many when making financial decisions.`,
    spirituality: `Spiritually, ${numberFocus} can be an opportunity to reflect on ${meaning.essence.split('.')[0].toLowerCase()}. Many practitioners use this number as a meditation focus.`,
    growthOpportunities: [
      `Develop awareness around ${meaning.weaknesses[0].toLowerCase()}`,
      `Lean into your natural ${meaning.strengths[0].toLowerCase()}`,
      'Practice self-reflection without judgment',
    ],
    luckyColors: LUCKY_COLORS[numberFocus] ?? LUCKY_COLORS[reduceToSingle(numberFocus)],
    luckyDays: LUCKY_DAYS[numberFocus] ?? LUCKY_DAYS[reduceToSingle(numberFocus)],
    compatibleNumbers: COMPATIBLE[numberFocus] ?? COMPATIBLE[reduceToSingle(numberFocus)],
    journalPrompts: [
      `How does the energy of ${numberFocus} show up in my daily life?`,
      `Where do I feel most aligned with my ${meaning.title} nature?`,
      `What would it look like to embrace my growth edge today?`,
    ],
    createdAt: new Date().toISOString(),
  };
}

export function generateDailyInsight(
  personalDay: NumberResult,
  lifePath: number
): import('../types').DailyInsight {
  const meaning = getNumberMeaning(personalDay.value);
  const today = new Date().toISOString().split('T')[0];

  return {
    date: today,
    personalDayNumber: personalDay.value,
    reflection: `Today carries the energy of Personal Day ${personalDay.value} — ${meaning.title}. Many numerologists interpret this as a day to focus on ${meaning.strengths[0].toLowerCase()} and ${meaning.strengths[1].toLowerCase()}.`,
    affirmation: `I embrace the ${meaning.title} energy within me and move through today with intention.`,
    journalPrompt: `How does Personal Day ${personalDay.value} resonate with my Life Path ${lifePath}? What patterns do I notice?`,
    coachingInsight: `As a Life Path ${lifePath}, you might consider how today's ${personalDay.value} energy invites you to ${meaning.strengths[0].toLowerCase()}. This is an opportunity to reflect, not a prediction.`,
    mindfulnessExercise: 'Take three deep breaths. With each exhale, release one expectation. With each inhale, invite curiosity.',
    suggestedLessonId: 'personal-cycles',
    suggestedPrompt: `What does today's Personal Day ${personalDay.value} mean for me?`,
  };
}

export function formatStepsForDisplay(result: NumberResult): string {
  return result.steps
    .map((s, i) => `**Step ${i + 1}: ${s.label}**\n${s.expression} = **${s.result}**${s.note ? `\n_${s.note}_` : ''}`)
    .join('\n\n');
}
