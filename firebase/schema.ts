/**
 * Firestore Database Schema for Numera
 *
 * Collections:
 *
 * users/{userId}
 *   - profile: BirthProfile fields
 *   - numerology: cached NumerologyProfile
 *   - isPremium: boolean
 *   - isGuest: boolean
 *   - createdAt, updatedAt: timestamps
 *
 * users/{userId}/reports/{reportId}
 *   - NumerologyReport fields
 *
 * users/{userId}/journal/{entryId}
 *   - JournalEntry fields
 *
 * users/{userId}/conversations/{conversationId}
 *   - Conversation fields (messages subcollection optional for large chats)
 *
 * users/{userId}/progress/{lessonId}
 *   - LessonProgress fields
 *
 * users/{userId}/achievements/{achievementId}
 *   - Achievement with unlockedAt
 *
 * users/{userId}/bookmarks/{bookmarkId}
 *   - Bookmark fields
 *
 * users/{userId}/settings
 *   - AppSettings (single document)
 *
 * users/{userId}/ai_memory
 *   - AIMemory (single document)
 *
 * lessons/{lessonId}  (global, read-only)
 *   - Lesson content and quiz
 *
 * daily_insights/{date}  (optional global cache)
 *   - Template daily content
 */

export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  JOURNAL: 'journal',
  CONVERSATIONS: 'conversations',
  PROGRESS: 'progress',
  ACHIEVEMENTS: 'achievements',
  BOOKMARKS: 'bookmarks',
  SETTINGS: 'settings',
  AI_MEMORY: 'ai_memory',
  LESSONS: 'lessons',
  DAILY_INSIGHTS: 'daily_insights',
} as const;

export interface FirestoreUser {
  id: string;
  email?: string;
  firstName: string;
  fullBirthName: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: string;
  experienceLevel: string;
  goals: string[];
  isGuest: boolean;
  isPremium: boolean;
  numerology: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
