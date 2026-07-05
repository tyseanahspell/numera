import { LESSONS_DATA } from '@/features/learn/data/lessons';
import { getNumberMeaning } from '@/shared/utils/reportGenerator';
import type { SearchResult } from '@/shared/types';

const FAQ_DATA = [
  { id: 'faq-1', q: 'What is a Life Path number?', a: 'Your Life Path is calculated from your birth date and represents your core life journey theme.' },
  { id: 'faq-2', q: 'What are Master Numbers?', a: 'Master Numbers 11, 22, and 33 carry amplified spiritual significance and are not reduced.' },
  { id: 'faq-3', q: 'Is numerology scientific?', a: 'No. Numerology is a spiritual self-reflection practice for entertainment and personal exploration.' },
  { id: 'faq-4', q: 'Pythagorean vs Chaldean?', a: 'Pythagorean uses sequential 1-9 letter mapping. Chaldean uses different values based on sound vibrations.' },
];

export function searchContent(query: string): SearchResult[] {
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const lesson of LESSONS_DATA) {
    if (
      lesson.title.toLowerCase().includes(lower) ||
      lesson.description.toLowerCase().includes(lower) ||
      lesson.content.toLowerCase().includes(lower)
    ) {
      results.push({
        id: `lesson-${lesson.id}`,
        type: 'lesson',
        title: lesson.title,
        snippet: lesson.description,
        route: `/lesson/${lesson.id}`,
      });
    }
  }

  for (let i = 1; i <= 33; i++) {
    const meaning = getNumberMeaning(i);
    if (
      String(i).includes(lower) ||
      meaning.title.toLowerCase().includes(lower) ||
      meaning.essence.toLowerCase().includes(lower)
    ) {
      results.push({
        id: `number-${i}`,
        type: 'number',
        title: `Number ${i} — ${meaning.title}`,
        snippet: meaning.essence.slice(0, 100),
        route: `/calculator/life_path`,
      });
    }
  }

  for (const faq of FAQ_DATA) {
    if (faq.q.toLowerCase().includes(lower) || faq.a.toLowerCase().includes(lower)) {
      results.push({
        id: faq.id,
        type: 'faq',
        title: faq.q,
        snippet: faq.a,
        route: '/(tabs)/learn',
      });
    }
  }

  return results.slice(0, 20);
}
