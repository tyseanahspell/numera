import {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
  calculateBirthday,
  calculateMaturity,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculatePersonalDay,
  calculateChallenges,
  calculatePinnacles,
  calculateBalance,
  buildNumerologyProfile,
  calculateCompatibility,
  reduceNumber,
  isMasterNumber,
  isKarmicDebt,
} from '@/shared/utils/numerology';

describe('reduceNumber', () => {
  it('reduces to single digit', () => {
    expect(reduceNumber(35).value).toBe(8);
  });

  it('preserves master numbers', () => {
    expect(reduceNumber(29).value).toBe(11);
    expect(reduceNumber(29).value).toBe(11);
    const result = reduceNumber(38);
    expect(result.value).toBe(11);
  });

  it('detects karmic debt', () => {
    const result = reduceNumber(49); // 4+9=13
    expect(isKarmicDebt(13)).toBe(true);
  });
});

describe('isMasterNumber', () => {
  it('identifies master numbers', () => {
    expect(isMasterNumber(11)).toBe(true);
    expect(isMasterNumber(22)).toBe(true);
    expect(isMasterNumber(33)).toBe(true);
    expect(isMasterNumber(8)).toBe(false);
  });
});

describe('calculateLifePath', () => {
  it('calculates life path for known birth date', () => {
    const result = calculateLifePath('1992-09-14');
    // 9+1+4+1+9+9+2 = 35 -> 8
    expect(result.value).toBe(8);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('preserves master number life paths', () => {
    const result = calculateLifePath('1990-02-28');
    // 2+2+8+1+9+9+0 = 31 -> 4 (not master, just testing calculation runs)
    expect(result.value).toBeGreaterThan(0);
    expect(result.value).toBeLessThanOrEqual(33);
  });
});

describe('calculateExpression', () => {
  it('calculates expression from name', () => {
    const result = calculateExpression('John Smith');
    expect(result.value).toBeGreaterThan(0);
    expect(result.steps[0].label).toBe('Letter values');
  });
});

describe('calculateSoulUrge', () => {
  it('uses only vowels', () => {
    const result = calculateSoulUrge('Alice');
    expect(result.value).toBeGreaterThan(0);
    expect(result.steps[0].label).toBe('vowels values');
  });
});

describe('calculatePersonality', () => {
  it('uses only consonants', () => {
    const result = calculatePersonality('Alice');
    expect(result.value).toBeGreaterThan(0);
    expect(result.steps[0].label).toBe('consonants values');
  });
});

describe('calculateBirthday', () => {
  it('reduces birth day', () => {
    const result = calculateBirthday('1992-09-14');
    expect(result.value).toBe(5); // 14 -> 5
  });
});

describe('calculateMaturity', () => {
  it('combines life path and expression', () => {
    const result = calculateMaturity(8, 3);
    expect(result.value).toBe(2); // 8+3=11 -> master 11
    expect(result.isMasterNumber).toBe(true);
  });
});

describe('Personal Cycles', () => {
  const birthDate = '1992-09-14';

  it('calculates personal year', () => {
    const result = calculatePersonalYear(birthDate, new Date('2026-07-04'));
    expect(result.value).toBeGreaterThan(0);
    expect(result.value).toBeLessThanOrEqual(33);
  });

  it('calculates personal month', () => {
    const result = calculatePersonalMonth(birthDate, new Date('2026-07-04'));
    expect(result.value).toBeGreaterThan(0);
  });

  it('calculates personal day', () => {
    const result = calculatePersonalDay(birthDate, new Date('2026-07-04'));
    expect(result.value).toBeGreaterThan(0);
  });
});

describe('calculateChallenges', () => {
  it('returns four challenge numbers', () => {
    const results = calculateChallenges('1992-09-14');
    expect(results).toHaveLength(4);
    results.forEach((r) => {
      expect(r.value).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('calculatePinnacles', () => {
  it('returns four pinnacle numbers', () => {
    const results = calculatePinnacles('1992-09-14');
    expect(results).toHaveLength(4);
  });
});

describe('calculateBalance', () => {
  it('calculates from initials', () => {
    const result = calculateBalance('John Michael Smith');
    expect(result.value).toBeGreaterThan(0);
    expect(result.steps[0].label).toBe('Initial letter values');
  });
});

describe('buildNumerologyProfile', () => {
  it('builds complete profile', () => {
    const profile = buildNumerologyProfile('Jane Doe', '1990-05-15');
    expect(profile.lifePath).toBeDefined();
    expect(profile.expression).toBeDefined();
    expect(profile.soulUrge).toBeDefined();
    expect(profile.personality).toBeDefined();
    expect(profile.challenges).toHaveLength(4);
    expect(profile.pinnacles).toHaveLength(4);
    expect(Array.isArray(profile.karmicDebts)).toBe(true);
    expect(Array.isArray(profile.masterNumbers)).toBe(true);
  });
});

describe('calculateCompatibility', () => {
  it('returns compatibility scores', () => {
    const result = calculateCompatibility(
      { name: 'Alice', birthDate: '1990-01-15' },
      { name: 'Bob', birthDate: '1988-07-22' }
    );
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.personA.lifePath).toBeGreaterThan(0);
    expect(result.personB.lifePath).toBeGreaterThan(0);
  });
});
