import {
  KARMIC_DEBT_NUMBERS,
  MASTER_NUMBERS,
  type CalculationStep,
  type KarmicDebtNumber,
  type NumberResult,
} from '../types';

/** Pythagorean letter-to-number mapping (A=1 … I=9, J=1 … R=9, S=1 … Z=8) */
export const PYTHAGOREAN_CHART: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

/** Chaldean letter values (no 9; different assignments) */
export const CHALDEAN_CHART: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

export function isMasterNumber(n: number): boolean {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}

export function isKarmicDebt(n: number): n is KarmicDebtNumber {
  return (KARMIC_DEBT_NUMBERS as readonly number[]).includes(n);
}

/**
 * Reduces a number to a single digit or master number.
 * Master numbers (11, 22, 33) are preserved unless forceReduce is true.
 */
export function reduceNumber(
  num: number,
  options: { preserveMaster?: boolean; steps?: CalculationStep[]; labelPrefix?: string } = {}
): { value: number; steps: CalculationStep[]; karmicDebt?: KarmicDebtNumber } {
  const { preserveMaster = true, steps = [], labelPrefix = 'Reduce' } = options;
  let current = Math.abs(num);
  const localSteps = [...steps];

  if (isKarmicDebt(current)) {
    localSteps.push({
      label: 'Karmic Debt detected',
      expression: `${current}`,
      result: current,
      note: `${current} is a Karmic Debt number before final reduction`,
    });
  }

  while (current > 9 && !(preserveMaster && isMasterNumber(current))) {
    const digits = String(current).split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    localSteps.push({
      label: labelPrefix,
      expression: digits.join(' + '),
      result: sum,
    });
    current = sum;

    if (isKarmicDebt(current)) {
      localSteps.push({
        label: 'Karmic Debt detected',
        expression: `${current}`,
        result: current,
        note: `${current} is a Karmic Debt number`,
      });
    }
  }

  const karmicDebt = localSteps.find((s) =>
    typeof s.result === 'number' && isKarmicDebt(s.result)
  )?.result as KarmicDebtNumber | undefined;

  return { value: current, steps: localSteps, karmicDebt };
}

export function parseBirthDate(isoDate: string): { month: number; day: number; year: number } {
  const [year, month, day] = isoDate.split('-').map(Number);
  return { month, day, year };
}

export function getLetterValue(
  letter: string,
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): number {
  const chart = system === 'pythagorean' ? PYTHAGOREAN_CHART : CHALDEAN_CHART;
  return chart[letter.toUpperCase()] ?? 0;
}

export function isVowel(letter: string, position: number, name: string): boolean {
  const upper = letter.toUpperCase();
  // Y is a vowel when it sounds like one (simplified: vowel if not followed by vowel or at end)
  if (upper === 'Y') {
    const next = name[position + 1]?.toUpperCase();
    return !next || !VOWELS.has(next);
  }
  return VOWELS.has(upper);
}

export function sumNameLetters(
  name: string,
  filter: 'all' | 'vowels' | 'consonants' = 'all',
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): { sum: number; steps: CalculationStep[] } {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  const steps: CalculationStep[] = [];
  const values: number[] = [];
  const letters: string[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const isV = isVowel(char, i, cleaned);
    if (filter === 'vowels' && !isV) continue;
    if (filter === 'consonants' && isV) continue;
    const val = getLetterValue(char, system);
    values.push(val);
    letters.push(char);
  }

  const sum = values.reduce((a, b) => a + b, 0);
  steps.push({
    label: filter === 'all' ? 'Letter values' : `${filter} values`,
    expression: letters.map((l, i) => `${l}=${values[i]}`).join(', '),
    result: sum,
  });

  return { sum, steps };
}

export function createNumberResult(
  rawSum: number,
  initialSteps: CalculationStep[],
  labelPrefix = 'Reduce'
): NumberResult {
  const { value, steps, karmicDebt } = reduceNumber(rawSum, {
    steps: initialSteps,
    labelPrefix,
  });
  return {
    value,
    isMasterNumber: isMasterNumber(value),
    karmicDebt,
    steps,
    rawSum,
  };
}

/** Life Path: sum all digits of birth date, reduce */
export function calculateLifePath(birthDate: string): NumberResult {
  const { month, day, year } = parseBirthDate(birthDate);
  const digits = `${month}${day}${year}`.split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);

  const steps: CalculationStep[] = [
    {
      label: 'Birth date digits',
      expression: `${month}/${day}/${year} → ${digits.join(' + ')}`,
      result: sum,
    },
  ];

  return createNumberResult(sum, steps, 'Life Path reduction');
}

/** Expression (Destiny): sum all letters in full birth name */
export function calculateExpression(
  fullName: string,
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): NumberResult {
  const { sum, steps } = sumNameLetters(fullName, 'all', system);
  return createNumberResult(sum, steps, 'Expression reduction');
}

/** Soul Urge (Heart's Desire): vowels only */
export function calculateSoulUrge(
  fullName: string,
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): NumberResult {
  const { sum, steps } = sumNameLetters(fullName, 'vowels', system);
  return createNumberResult(sum, steps, 'Soul Urge reduction');
}

/** Personality: consonants only */
export function calculatePersonality(
  fullName: string,
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): NumberResult {
  const { sum, steps } = sumNameLetters(fullName, 'consonants', system);
  return createNumberResult(sum, steps, 'Personality reduction');
}

/** Birthday Number: day of birth reduced */
export function calculateBirthday(birthDate: string): NumberResult {
  const { day } = parseBirthDate(birthDate);
  const steps: CalculationStep[] = [
    { label: 'Birth day', expression: `Day ${day}`, result: day },
  ];
  return createNumberResult(day, steps, 'Birthday reduction');
}

/** Maturity: Life Path + Expression, reduced */
export function calculateMaturity(lifePath: number, expression: number): NumberResult {
  const sum = lifePath + expression;
  const steps: CalculationStep[] = [
    {
      label: 'Combine Life Path and Expression',
      expression: `${lifePath} + ${expression}`,
      result: sum,
    },
  ];
  return createNumberResult(sum, steps, 'Maturity reduction');
}

/** Personal Year: birth month + birth day + current year digits */
export function calculatePersonalYear(birthDate: string, referenceDate = new Date()): NumberResult {
  const { month, day } = parseBirthDate(birthDate);
  const year = referenceDate.getFullYear();
  const yearDigits = String(year).split('').map(Number);
  const sum = month + day + yearDigits.reduce((a, b) => a + b, 0);

  const steps: CalculationStep[] = [
    {
      label: 'Personal Year formula',
      expression: `${month} + ${day} + ${yearDigits.join(' + ')}`,
      result: sum,
      note: `For calendar year ${year}`,
    },
  ];

  return createNumberResult(sum, steps, 'Personal Year reduction');
}

/** Personal Month: Personal Year + current calendar month */
export function calculatePersonalMonth(
  birthDate: string,
  referenceDate = new Date()
): NumberResult {
  const personalYear = calculatePersonalYear(birthDate, referenceDate);
  const month = referenceDate.getMonth() + 1;
  const sum = personalYear.value + month;

  const steps: CalculationStep[] = [
    ...personalYear.steps,
    {
      label: 'Add current month',
      expression: `${personalYear.value} + ${month}`,
      result: sum,
    },
  ];

  return createNumberResult(sum, steps, 'Personal Month reduction');
}

/** Personal Day: Personal Month + current calendar day */
export function calculatePersonalDay(
  birthDate: string,
  referenceDate = new Date()
): NumberResult {
  const personalMonth = calculatePersonalMonth(birthDate, referenceDate);
  const day = referenceDate.getDate();
  const sum = personalMonth.value + day;

  const steps: CalculationStep[] = [
    ...personalMonth.steps,
    {
      label: 'Add current day',
      expression: `${personalMonth.value} + ${day}`,
      result: sum,
    },
  ];

  return createNumberResult(sum, steps, 'Personal Day reduction');
}

/** Four Challenge numbers from birth date */
export function calculateChallenges(birthDate: string): NumberResult[] {
  const { month, day, year } = parseBirthDate(birthDate);
  const reduce = (n: number) => reduceNumber(n, { preserveMaster: false }).value;

  const m = reduce(month);
  const d = reduce(day);
  const y = reduce(
    String(year)
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0)
  );

  const challenges = [
    { label: 'First Challenge', expr: `|${m} - ${d}|`, val: Math.abs(m - d) },
    { label: 'Second Challenge', expr: `|${d} - ${y}|`, val: Math.abs(d - y) },
    { label: 'Third Challenge', expr: `|${Math.abs(m - d)} - ${Math.abs(d - y)}|`, val: Math.abs(Math.abs(m - d) - Math.abs(d - y)) },
    { label: 'Fourth Challenge', expr: `|${m} - ${y}|`, val: Math.abs(m - y) },
  ];

  return challenges.map((c) =>
    createNumberResult(c.val, [{ label: c.label, expression: c.expr, result: c.val }], 'Challenge reduction')
  );
}

/** Four Pinnacle periods from birth date */
export function calculatePinnacles(birthDate: string): NumberResult[] {
  const { month, day, year } = parseBirthDate(birthDate);
  const reduce = (n: number) => reduceNumber(n, { preserveMaster: true }).value;

  const m = reduce(month);
  const d = reduce(day);
  const y = reduce(
    String(year)
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0)
  );

  const pinnacles = [
    { label: 'First Pinnacle', expr: `${m} + ${d}`, val: m + d },
    { label: 'Second Pinnacle', expr: `${d} + ${y}`, val: d + y },
    { label: 'Third Pinnacle', expr: `${m + d} + ${d + y}`, val: m + d + d + y },
    { label: 'Fourth Pinnacle', expr: `${m} + ${y}`, val: m + y },
  ];

  return pinnacles.map((p) =>
    createNumberResult(p.val, [{ label: p.label, expression: p.expr, result: p.val }], 'Pinnacle reduction')
  );
}

/** Balance Number: sum of initials reduced */
export function calculateBalance(fullName: string): NumberResult {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.map((p) => p[0]?.toUpperCase()).filter(Boolean) as string[];
  const values = initials.map((l) => getLetterValue(l));
  const sum = values.reduce((a, b) => a + b, 0);

  const steps: CalculationStep[] = [
    {
      label: 'Initial letter values',
      expression: initials.map((l, i) => `${l}=${values[i]}`).join(' + '),
      result: sum,
    },
  ];

  return createNumberResult(sum, steps, 'Balance reduction');
}

/** Detect all karmic debt numbers in a profile's calculation steps */
export function detectKarmicDebts(profile: {
  lifePath: NumberResult;
  expression: NumberResult;
  soulUrge: NumberResult;
  personality: NumberResult;
}): KarmicDebtNumber[] {
  const debts = new Set<KarmicDebtNumber>();
  const results = [profile.lifePath, profile.expression, profile.soulUrge, profile.personality];

  for (const r of results) {
    if (r.karmicDebt) debts.add(r.karmicDebt);
    for (const step of r.steps) {
      if (typeof step.result === 'number' && isKarmicDebt(step.result)) {
        debts.add(step.result);
      }
    }
  }

  return Array.from(debts);
}

/** Detect master numbers present in profile */
export function detectMasterNumbers(profile: {
  lifePath: NumberResult;
  expression: NumberResult;
  soulUrge: NumberResult;
  personality: NumberResult;
  maturity: NumberResult;
}): (11 | 22 | 33)[] {
  const masters = new Set<11 | 22 | 33>();
  const results = [
    profile.lifePath,
    profile.expression,
    profile.soulUrge,
    profile.personality,
    profile.maturity,
  ];

  for (const r of results) {
    if (isMasterNumber(r.value)) {
      masters.add(r.value as 11 | 22 | 33);
    }
  }

  return Array.from(masters);
}

/** Build complete numerology profile from birth data */
export function buildNumerologyProfile(
  fullBirthName: string,
  birthDate: string,
  referenceDate = new Date(),
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
) {
  const lifePath = calculateLifePath(birthDate);
  const expression = calculateExpression(fullBirthName, system);
  const soulUrge = calculateSoulUrge(fullBirthName, system);
  const personality = calculatePersonality(fullBirthName, system);
  const birthday = calculateBirthday(birthDate);
  const maturity = calculateMaturity(lifePath.value, expression.value);
  const personalYear = calculatePersonalYear(birthDate, referenceDate);
  const personalMonth = calculatePersonalMonth(birthDate, referenceDate);
  const personalDay = calculatePersonalDay(birthDate, referenceDate);
  const challenges = calculateChallenges(birthDate);
  const pinnacles = calculatePinnacles(birthDate);
  const balance = calculateBalance(fullBirthName);

  const partial = { lifePath, expression, soulUrge, personality };
  const karmicDebts = detectKarmicDebts(partial);
  const masterNumbers = detectMasterNumbers({ ...partial, maturity });

  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthday,
    maturity,
    personalYear,
    personalMonth,
    personalDay,
    challenges,
    pinnacles,
    balance,
    karmicDebts,
    masterNumbers,
  };
}

/** Compatibility score based on life path harmony */
export function calculateCompatibility(
  personA: { name: string; birthDate: string },
  personB: { name: string; birthDate: string }
): import('../types').CompatibilityResult {
  const lpA = calculateLifePath(personA.birthDate);
  const lpB = calculateLifePath(personB.birthDate);

  const harmoniousPairs: Record<number, number[]> = {
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

  const scoreFor = (a: number, b: number) => {
    const compatible = harmoniousPairs[a]?.includes(b) ?? false;
    const diff = Math.abs(a - b);
    if (a === b) return 85;
    if (compatible) return 75 + Math.min(15, 5 - diff);
    if (diff <= 2) return 60;
    if (diff <= 4) return 45;
    return 30;
  };

  const base = scoreFor(lpA.value, lpB.value);
  const communication = Math.min(100, base + Math.floor(Math.random() * 10));
  const romance = Math.min(100, base + (lpA.value + lpB.value) % 15);
  const friendship = Math.min(100, base + 5);
  const business = Math.min(100, base - 5 + (lpA.value * lpB.value) % 10);

  return {
    overallScore: Math.round((communication + romance + friendship + business) / 4),
    communication,
    romance,
    friendship,
    business,
    strengths: [
      `Life Path ${lpA.value} and ${lpB.value} share complementary energies`,
      'Both bring unique perspectives to the relationship',
    ],
    challenges: [
      'Different pacing preferences may require patience',
      'Communication styles may need conscious alignment',
    ],
    personA: { name: personA.name, lifePath: lpA.value },
    personB: { name: personB.name, lifePath: lpB.value },
  };
}

/** Format calculation steps as human-readable explanation */
export function formatCalculationSteps(result: NumberResult): string {
  return result.steps
    .map((s, i) => {
      const note = s.note ? `\n   Note: ${s.note}` : '';
      return `Step ${i + 1}: ${s.label}\n   ${s.expression} = ${s.result}${note}`;
    })
    .join('\n\n');
}
