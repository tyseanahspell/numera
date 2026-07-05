import type { ExperienceLevel, UserGoal } from '../types';

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'New to numerology' },
  { value: 'intermediate', label: 'Intermediate', description: 'Know the basics' },
  { value: 'advanced', label: 'Advanced', description: 'Deep practitioner' },
];

export const USER_GOALS: { value: UserGoal; label: string; icon: string }[] = [
  { value: 'learn', label: 'Learn Numerology', icon: 'book' },
  { value: 'self_discovery', label: 'Self Discovery', icon: 'compass' },
  { value: 'relationships', label: 'Relationships', icon: 'heart' },
  { value: 'career', label: 'Career', icon: 'briefcase' },
  { value: 'spiritual_growth', label: 'Spiritual Growth', icon: 'star' },
];

export const AI_SUGGESTED_PROMPTS = [
  'Explain my Life Path',
  'How compatible am I with my partner?',
  'Teach me numerology',
  "What does today's Personal Day mean?",
  'Explain Master Numbers',
  'Why do I keep seeing repeating numbers?',
  'Help me understand my chart',
  'What should I focus on this month?',
  'Give me journal prompts',
  "Explain this like I'm 10 years old",
  'Challenge my understanding',
  'Quiz me',
] as const;

export const CALCULATOR_TYPES = [
  { id: 'life_path', title: 'Life Path', description: 'Your core life journey number' },
  { id: 'expression', title: 'Expression', description: 'Talents from your full birth name' },
  { id: 'soul_urge', title: 'Soul Urge', description: 'Inner desires from vowels' },
  { id: 'personality', title: 'Personality', description: 'Outer self from consonants' },
  { id: 'birthday', title: 'Birthday', description: 'Special gifts of your birth day' },
  { id: 'maturity', title: 'Maturity', description: 'Life Path + Expression combined' },
  { id: 'personal_year', title: 'Personal Year', description: 'Energy of the current year' },
  { id: 'personal_month', title: 'Personal Month', description: 'Energy of the current month' },
  { id: 'personal_day', title: 'Personal Day', description: "Today's personal vibration" },
  { id: 'challenges', title: 'Challenge Numbers', description: 'Life lessons to overcome' },
  { id: 'pinnacles', title: 'Pinnacle Numbers', description: 'Peak opportunity periods' },
  { id: 'balance', title: 'Balance Number', description: 'Energy from your initials' },
  { id: 'karmic_debt', title: 'Karmic Debt', description: 'Numbers 13, 14, 16, 19' },
  { id: 'master_numbers', title: 'Master Numbers', description: 'The power of 11, 22, 33' },
] as const;

export const ACHIEVEMENTS_LIST = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '📖' },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🏆' },
  { id: 'week_streak', title: 'Weekly Reflection', description: '7-day journal streak', icon: '🔥' },
  { id: 'chart_complete', title: 'Chart Explorer', description: 'View your full numerology chart', icon: '✨' },
  { id: 'coach_chat', title: 'Curious Mind', description: 'Have your first AI Coach conversation', icon: '💬' },
  { id: 'compatibility', title: 'Harmony Seeker', description: 'Run a compatibility report', icon: '💫' },
] as const;
