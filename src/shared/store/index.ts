import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  UserProfile,
  AppSettings,
  Conversation,
  JournalEntry,
  NumerologyReport,
  Bookmark,
  LessonProgress,
  Achievement,
  AIMemory,
  DailyInsight,
} from '../types';
import { buildNumerologyProfile } from '../utils/numerology';
import { generateDailyInsight } from '../utils/reportGenerator';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingComplete: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  createGuestProfile: (data: Omit<UserProfile, 'id' | 'numerology' | 'createdAt' | 'updatedAt' | 'isGuest' | 'isPremium'>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      onboardingComplete: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      updateProfile: (updates) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates, updatedAt: new Date().toISOString() } });
      },
      createGuestProfile: (data) => {
        const id = `guest_${Date.now()}`;
        const numerology = buildNumerologyProfile(data.fullBirthName, data.birthDate);
        const user: UserProfile = {
          ...data,
          id,
          isGuest: true,
          isPremium: false,
          numerology,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true, onboardingComplete: true });
      },
    }),
    {
      name: 'numera-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);

interface SettingsState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  highContrast: false,
  reducedMotion: false,
  fontScale: 1,
  notifications: {
    dailyInsight: true,
    personalDay: true,
    lessonReminder: false,
    journalPrompt: true,
    hour: 8,
    minute: 0,
  },
  numerologySystem: 'pythagorean',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
    }),
    {
      name: 'numera-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface CoachState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  streamingContent: string;
  aiMemory: AIMemory;
  addConversation: (conversation: Conversation) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Conversation['messages'][0]) => void;
  setStreaming: (streaming: boolean, content?: string) => void;
  appendStreamToken: (token: string) => void;
  pinConversation: (id: string, pinned: boolean) => void;
  updateMemory: (updates: Partial<AIMemory>) => void;
}

const defaultMemory: AIMemory = {
  favoriteLearningStyle: 'beginner',
  topicsLearned: [],
  frequentlyAsked: [],
  preferredDepth: 'beginner',
  favoriteSystem: 'pythagorean',
  recentReportIds: [],
};

export const useCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      streamingContent: '',
      aiMemory: defaultMemory,
      addConversation: (conversation) =>
        set((s) => ({ conversations: [conversation, ...s.conversations] })),
      setActiveConversation: (activeConversationId) => set({ activeConversationId }),
      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
              : c
          ),
        })),
      setStreaming: (isStreaming, content = '') => set({ isStreaming, streamingContent: content }),
      appendStreamToken: (token) =>
        set((s) => ({ streamingContent: s.streamingContent + token })),
      pinConversation: (id, pinned) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, pinned } : c)),
        })),
      updateMemory: (updates) =>
        set((s) => ({ aiMemory: { ...s.aiMemory, ...updates } })),
    }),
    {
      name: 'numera-coach',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface AppDataState {
  reports: NumerologyReport[];
  journalEntries: JournalEntry[];
  bookmarks: Bookmark[];
  lessonProgress: LessonProgress[];
  achievements: Achievement[];
  dailyInsight: DailyInsight | null;
  addReport: (report: NumerologyReport) => void;
  toggleBookmark: (bookmark: Bookmark) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateLessonProgress: (progress: LessonProgress) => void;
  unlockAchievement: (achievement: Achievement) => void;
  setDailyInsight: (insight: DailyInsight) => void;
  refreshDailyInsight: () => void;
}

export const useAppDataStore = create<AppDataState>()(
  persist(
    (set, get) => ({
      reports: [],
      journalEntries: [],
      bookmarks: [],
      lessonProgress: [],
      achievements: [],
      dailyInsight: null,
      addReport: (report) => set((s) => ({ reports: [report, ...s.reports] })),
      toggleBookmark: (bookmark) =>
        set((s) => {
          const exists = s.bookmarks.find((b) => b.referenceId === bookmark.referenceId);
          if (exists) {
            return { bookmarks: s.bookmarks.filter((b) => b.referenceId !== bookmark.referenceId) };
          }
          return { bookmarks: [bookmark, ...s.bookmarks] };
        }),
      addJournalEntry: (entry) =>
        set((s) => ({ journalEntries: [entry, ...s.journalEntries] })),
      updateLessonProgress: (progress) =>
        set((s) => {
          const filtered = s.lessonProgress.filter((p) => p.lessonId !== progress.lessonId);
          return { lessonProgress: [...filtered, progress] };
        }),
      unlockAchievement: (achievement) =>
        set((s) => {
          if (s.achievements.find((a) => a.id === achievement.id)) return s;
          return { achievements: [...s.achievements, { ...achievement, unlockedAt: new Date().toISOString() }] };
        }),
      setDailyInsight: (dailyInsight) => set({ dailyInsight }),
      refreshDailyInsight: () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const insight = generateDailyInsight(
          user.numerology.personalDay,
          user.numerology.lifePath.value
        );
        set({ dailyInsight: insight });
      },
    }),
    {
      name: 'numera-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
