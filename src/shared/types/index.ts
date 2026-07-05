/** Master numbers preserved during reduction */
export const MASTER_NUMBERS = [11, 22, 33] as const;

/** Karmic debt numbers that may appear before final reduction */
export const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19] as const;

export type MasterNumber = (typeof MASTER_NUMBERS)[number];
export type KarmicDebtNumber = (typeof KARMIC_DEBT_NUMBERS)[number];

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserGoal =
  | 'learn'
  | 'self_discovery'
  | 'relationships'
  | 'career'
  | 'spiritual_growth';

export type NumerologySystem = 'pythagorean' | 'chaldean';

export type MoodTag =
  | 'peaceful'
  | 'anxious'
  | 'grateful'
  | 'curious'
  | 'hopeful'
  | 'reflective'
  | 'energized'
  | 'uncertain';

export interface CalculationStep {
  label: string;
  expression: string;
  result: number | string;
  note?: string;
}

export interface NumberResult {
  value: number;
  isMasterNumber: boolean;
  karmicDebt?: KarmicDebtNumber;
  steps: CalculationStep[];
  rawSum?: number;
}

export interface BirthProfile {
  firstName: string;
  fullBirthName: string;
  birthDate: string; // ISO date YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthLocation?: string;
  experienceLevel: ExperienceLevel;
  goals: UserGoal[];
}

export interface NumerologyProfile {
  lifePath: NumberResult;
  expression: NumberResult;
  soulUrge: NumberResult;
  personality: NumberResult;
  birthday: NumberResult;
  maturity: NumberResult;
  personalYear: NumberResult;
  personalMonth: NumberResult;
  personalDay: NumberResult;
  challenges: NumberResult[];
  pinnacles: NumberResult[];
  balance: NumberResult;
  karmicDebts: KarmicDebtNumber[];
  masterNumbers: MasterNumber[];
}

export interface UserProfile extends BirthProfile {
  id: string;
  email?: string;
  isGuest: boolean;
  isPremium: boolean;
  numerology: NumerologyProfile;
  createdAt: string;
  updatedAt: string;
}

export interface DailyInsight {
  date: string;
  personalDayNumber: number;
  reflection: string;
  affirmation: string;
  journalPrompt: string;
  coachingInsight: string;
  mindfulnessExercise: string;
  suggestedLessonId?: string;
  suggestedPrompt?: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface NumerologyReport {
  id: string;
  userId: string;
  type: 'life_path' | 'full_chart' | 'personal_year' | 'compatibility' | 'daily';
  title: string;
  numberFocus: number;
  summary: string;
  meaning: string;
  strengths: string[];
  weaknesses: string[];
  career: string;
  relationships: string;
  money: string;
  spirituality: string;
  growthOpportunities: string[];
  luckyColors: string[];
  luckyDays: string[];
  compatibleNumbers: number[];
  journalPrompts: string[];
  createdAt: string;
  bookmarked?: boolean;
}

export interface CompatibilityResult {
  overallScore: number;
  communication: number;
  romance: number;
  friendship: number;
  business: number;
  strengths: string[];
  challenges: string[];
  personA: { name: string; lifePath: number };
  personB: { name: string; lifePath: number };
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  description: string;
  content: string;
  durationMinutes: number;
  experienceLevel: ExperienceLevel;
  quiz: Quiz;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: MoodTag;
  personalNumbers: number[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  type: 'lesson' | 'report' | 'number' | 'conversation';
  referenceId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  reactions?: string[];
  pinned?: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  context?: ConversationContext;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationContext {
  reportId?: string;
  numberFocus?: number;
  includeJournal?: boolean;
  learningMode?: ExperienceLevel;
}

export interface AIMemory {
  favoriteLearningStyle: ExperienceLevel;
  topicsLearned: string[];
  frequentlyAsked: string[];
  preferredDepth: ExperienceLevel;
  favoriteSystem: NumerologySystem;
  recentReportIds: string[];
}

export interface NotificationPreferences {
  dailyInsight: boolean;
  personalDay: boolean;
  lessonReminder: boolean;
  journalPrompt: boolean;
  hour: number;
  minute: number;
}

export interface AppSettings {
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontScale: number;
  notifications: NotificationPreferences;
  numerologySystem: NumerologySystem;
}

export interface SearchResult {
  id: string;
  type: 'lesson' | 'number' | 'report' | 'faq' | 'journal';
  title: string;
  snippet: string;
  route: string;
}

export interface PremiumFeatures {
  unlimitedReports: boolean;
  compatibility: boolean;
  advancedCharts: boolean;
  dailyForecasts: boolean;
  journalExport: boolean;
  pdfReports: boolean;
  themes: boolean;
  widgets: boolean;
  noAds: boolean;
}

export const FREE_TIER_LIMITS = {
  reportsPerMonth: 3,
  compatibilityChecks: 0,
  journalExports: 0,
} as const;

export const NUMEROLOGY_DISCLAIMER =
  'Numerology is a spiritual and self-reflection practice intended for entertainment and personal exploration. It is not scientific fact and should not replace professional financial, legal, relationship, or medical advice.';
