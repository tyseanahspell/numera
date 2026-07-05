import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, DisclaimerBanner } from '@/shared/components';
import { COLORS, SPACING, BORDER_RADIUS } from '@/shared/constants/theme';
import { AI_SUGGESTED_PROMPTS } from '@/shared/constants';
import { useAICoach } from '@/features/coach/hooks/useAICoach';
import { useAuthStore } from '@/shared/store';
import type { ChatMessage } from '@/shared/types';

export default function CoachScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const user = useAuthStore((s) => s.user);
  const {
    activeConversation,
    isStreaming,
    streamingContent,
    sendMessage,
    startConversation,
    setActiveConversation,
    conversations,
  } = useAICoach();

  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length, streamingContent]);

  const handleSend = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || isStreaming) return;
    setInput('');
    await sendMessage(msg);
  };

  const markdownStyles = {
    body: { color: COLORS.white, fontSize: 15, lineHeight: 22 },
    heading1: { color: COLORS.gold, fontSize: 20 },
    heading2: { color: COLORS.gold, fontSize: 18 },
    strong: { color: COLORS.goldLight },
    em: { color: COLORS.textMuted },
    bullet_list: { color: COLORS.white },
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={{
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '85%',
          marginBottom: SPACING.sm,
        }}
      >
        <View
          style={{
            backgroundColor: isUser ? COLORS.navy700 : COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.md,
            borderWidth: 1,
            borderColor: isUser ? COLORS.gold : COLORS.navy700,
          }}
        >
          {isUser ? (
            <Text style={{ color: COLORS.white }}>{item.content}</Text>
          ) : (
            <Markdown style={markdownStyles}>{item.content}</Markdown>
          )}
        </View>
        {!isUser && (
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4, marginLeft: 4 }}>
            <Pressable onPress={() => Speech.speak(item.content, { rate: 0.9 })}>
              <Ionicons name="volume-medium-outline" size={16} color={COLORS.textMuted} />
            </Pressable>
            <Pressable onPress={() => {/* copy handled by OS long press */}}>
              <Ionicons name="copy-outline" size={16} color={COLORS.textMuted} />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer scroll={false} padded={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={{ padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.navy700 }}>
          <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: '700' }}>AI Coach</Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
            Your personal numerology teacher · {user?.experienceLevel ?? 'beginner'} mode
          </Text>
          {conversations.length > 0 && (
            <Pressable
              onPress={() => {
                startConversation('New Conversation');
              }}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: COLORS.gold, fontSize: 13 }}>+ New conversation</Text>
            </Pressable>
          )}
        </View>

        {messages.length === 0 ? (
          <View style={{ flex: 1, padding: SPACING.md }}>
            <Text style={{ color: COLORS.textMuted, marginBottom: SPACING.md }}>
              Ask anything about numerology. I'll teach, explain calculations, and personalize insights using your chart.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {AI_SUGGESTED_PROMPTS.slice(0, 8).map((prompt) => (
                <Pressable
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: COLORS.navy700,
                  }}
                >
                  <Text style={{ color: COLORS.gold, fontSize: 13 }}>{prompt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.sm }}
            ListFooterComponent={
              isStreaming && streamingContent ? (
                <View style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                  <View
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: BORDER_RADIUS.lg,
                      padding: SPACING.md,
                    }}
                  >
                    <Markdown style={markdownStyles}>{streamingContent}</Markdown>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        <View style={{ padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.navy700 }}>
          <DisclaimerBanner compact />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: SPACING.sm,
              marginTop: SPACING.sm,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your numerology coach..."
              placeholderTextColor={COLORS.textMuted}
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                borderRadius: BORDER_RADIUS.md,
                paddingHorizontal: SPACING.md,
                paddingVertical: 12,
                color: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.navy700,
              }}
              multiline
              maxLength={2000}
            />
            <Pressable
              onPress={() => handleSend()}
              disabled={isStreaming || !input.trim()}
              style={{
                backgroundColor: COLORS.gold,
                borderRadius: 24,
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isStreaming || !input.trim() ? 0.5 : 1,
              }}
            >
              <Ionicons name="send" size={20} color={COLORS.navy900} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
