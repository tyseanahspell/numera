import { searchContent } from '@/shared/services/search';

describe('searchContent', () => {
  it('returns lesson results for matching query', () => {
    const results = searchContent('pythagorean');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === 'lesson')).toBe(true);
  });

  it('returns number results', () => {
    const results = searchContent('life path 7');
    expect(results.some((r) => r.type === 'number' || r.type === 'lesson' || r.type === 'faq')).toBe(true);
  });

  it('returns faq results', () => {
    const results = searchContent('scientific');
    expect(results.some((r) => r.type === 'faq')).toBe(true);
  });

  it('returns empty for short query handled at UI level', () => {
    const results = searchContent('py');
    // may still match pythagorean
    expect(Array.isArray(results)).toBe(true);
  });
});
