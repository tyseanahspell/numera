import { useCallback, useRef } from 'react';
import Constants from 'expo-constants';
import type { AIProviderType } from '@/shared/services/ai/coach';
import {
  createAIProvider,
  buildCoachMessages,
  type CoachContext,
  type AIMessage,
} from '@/shared/services/ai/coach';
import { useAuthStore, useCoachStore, useAppDataStore } from '@/shared/store';
import type { ChatMessage, Conversation } from '@/shared/types';

const extra = Constants.expoConfig?.extra ?? {};

export function useAICoach() {
  const user = useAuthStore((s) => s.user);
  const aiMemory = useCoachStore((s) => s.aiMemory);
  const journalEntries = useAppDataStore((s) => s.journalEntries);
  const {
    conversations,
    activeConversationId,
    isStreaming,
    streamingContent,
    addConversation,
    setActiveConversation,
    addMessage,
    setStreaming,
    appendStreamToken,
    updateMemory,
  } = useCoachStore();

  const providerRef = useRef(
    createAIProvider((extra.aiProvider as AIProviderType) ?? 'openai', {
      openai: extra.openAiApiKey ?? '',
      anthropic: extra.anthropicApiKey ?? '',
      gemini: extra.geminiApiKey ?? '',
    })
  );

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const buildContext = useCallback(
    (overrides?: Partial<CoachContext>): CoachContext => ({
      profile: user
        ? {
            firstName: user.firstName,
            fullBirthName: user.fullBirthName,
            birthDate: user.birthDate,
            numerology: user.numerology,
          }
        : undefined,
      memory: aiMemory,
      learningMode: user?.experienceLevel ?? aiMemory.preferredDepth,
      journalEntries: overrides?.journalEntries,
      ...overrides,
    }),
    [user, aiMemory]
  );

  const startConversation = useCallback(
    (title: string, convContext?: Conversation['context']) => {
      const conv: Conversation = {
        id: `conv_${Date.now()}`,
        userId: user?.id ?? 'guest',
        title,
        messages: [],
        context: convContext,
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addConversation(conv);
      setActiveConversation(conv.id);
      return conv.id;
    },
    [user, addConversation, setActiveConversation]
  );

  const sendMessage = useCallback(
    async (
      content: string,
      options?: {
        conversationId?: string;
        context?: Partial<CoachContext>;
        includeJournal?: boolean;
      }
    ) => {
      let convId = options?.conversationId ?? activeConversationId;
      if (!convId) {
        convId = startConversation(content.slice(0, 40));
      }

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(convId, userMsg);

      const conv = useCoachStore.getState().conversations.find((c) => c.id === convId);
      const history: AIMessage[] =
        conv?.messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) ?? [];

      const context = buildContext({
        ...options?.context,
        journalEntries: options?.includeJournal ? journalEntries.slice(0, 10) : undefined,
      });

      const messages = buildCoachMessages(content, context, history.slice(0, -1));

      setStreaming(true, '');

      await providerRef.current.chat(messages, {
        onToken: appendStreamToken,
        onComplete: (fullText) => {
          const assistantMsg: ChatMessage = {
            id: `msg_${Date.now()}_ai`,
            role: 'assistant',
            content: fullText,
            timestamp: new Date().toISOString(),
          };
          addMessage(convId!, assistantMsg);
          setStreaming(false, '');
          updateMemory({
            frequentlyAsked: [...new Set([...aiMemory.frequentlyAsked, content])].slice(-20),
          });
        },
        onError: () => {
          const errorMsg: ChatMessage = {
            id: `msg_${Date.now()}_err`,
            role: 'assistant',
            content: 'I apologize — I had trouble responding. Please try again.',
            timestamp: new Date().toISOString(),
          };
          addMessage(convId!, errorMsg);
          setStreaming(false, '');
        },
      });
    },
    [
      activeConversationId,
      startConversation,
      addMessage,
      buildContext,
      journalEntries,
      setStreaming,
      appendStreamToken,
      updateMemory,
      aiMemory,
    ]
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    streamingContent,
    setActiveConversation,
    startConversation,
    sendMessage,
    buildContext,
  };
}
