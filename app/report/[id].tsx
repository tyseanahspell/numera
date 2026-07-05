import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Card, ScreenHeader, DisclaimerBanner } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAppDataStore, useAuthStore } from '@/shared/store';
import { useAICoach } from '@/features/coach/hooks/useAICoach';

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const report = useAppDataStore((s) => s.reports.find((r) => r.id === id));
  const user = useAuthStore((s) => s.user);
  const { startConversation, sendMessage } = useAICoach();

  if (!report) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Report not found" />
      </ScreenContainer>
    );
  }

  const handleAskAI = async () => {
    const convId = startConversation(`Ask about: ${report.title}`, { reportId: report.id });
    router.push('/(tabs)/coach');
    await sendMessage('Tell me more about this report and what it means for me.', {
      conversationId: convId,
      context: { report },
    });
  };

  const handleExport = () => {
    if (!user?.isPremium) {
      Alert.alert('Premium Feature', 'PDF export requires Numera Premium.');
      router.push('/premium');
      return;
    }
    Alert.alert('Export', 'PDF export would generate a beautiful report document.');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card title={title} style={{ marginBottom: SPACING.md }}>
      {children}
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={report.title} subtitle={new Date(report.createdAt).toLocaleDateString()} />

      <Section title="Summary">
        <Text style={{ color: COLORS.textMuted, lineHeight: 22 }}>{report.summary}</Text>
      </Section>

      <Section title="Meaning">
        <Text style={{ color: COLORS.textMuted, lineHeight: 22 }}>{report.meaning}</Text>
      </Section>

      <Section title="Strengths">
        {report.strengths.map((s) => (
          <Text key={s} style={{ color: COLORS.white, marginBottom: 4 }}>• {s}</Text>
        ))}
      </Section>

      <Section title="Growth Areas">
        {report.weaknesses.map((w) => (
          <Text key={w} style={{ color: COLORS.textMuted, marginBottom: 4 }}>• {w}</Text>
        ))}
      </Section>

      <Section title="Career">
        <Text style={{ color: COLORS.textMuted, lineHeight: 22 }}>{report.career}</Text>
      </Section>

      <Section title="Relationships">
        <Text style={{ color: COLORS.textMuted, lineHeight: 22 }}>{report.relationships}</Text>
      </Section>

      <Section title="Lucky Colors & Days">
        <Text style={{ color: COLORS.white }}>Colors: {report.luckyColors.join(', ')}</Text>
        <Text style={{ color: COLORS.white, marginTop: 4 }}>Days: {report.luckyDays.join(', ')}</Text>
      </Section>

      <Section title="Journal Prompts">
        {report.journalPrompts.map((p) => (
          <Text key={p} style={{ color: COLORS.gold, marginBottom: 8, fontStyle: 'italic' }}>"{p}"</Text>
        ))}
      </Section>

      <DisclaimerBanner />

      <View style={{ gap: SPACING.sm, marginTop: SPACING.lg }}>
        <Button title="Ask AI About This" onPress={handleAskAI} />
        <Button title="Export PDF" variant="outline" onPress={handleExport} />
        <Button title="Share" variant="secondary" onPress={() => Alert.alert('Share', 'Share image feature')} />
      </View>
    </ScreenContainer>
  );
}
