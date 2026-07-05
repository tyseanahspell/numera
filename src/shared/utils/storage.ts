import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@numera/';

export async function storageGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}

export async function storageRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(`${PREFIX}${key}`);
}

export const StorageKeys = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  AUTH_TOKEN: 'auth_token',
  SETTINGS: 'settings',
  CONVERSATIONS: 'conversations',
  AI_MEMORY: 'ai_memory',
  BOOKMARKS: 'bookmarks',
  JOURNAL: 'journal',
  REPORTS: 'reports',
  LESSON_PROGRESS: 'lesson_progress',
  ACHIEVEMENTS: 'achievements',
  DAILY_INSIGHT: 'daily_insight',
  GUEST_ID: 'guest_id',
} as const;
