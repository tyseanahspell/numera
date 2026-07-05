import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Card, ScreenHeader } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAuthStore, useAppDataStore } from '@/shared/store';
import { generateReport } from '@/shared/utils/reportGenerator';
import { FREE_TIER_LIMITS } from '@/shared/types';

export default function ReportsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { reports, addReport } = useAppDataStore();

  const handleGenerate = (type: 'life_path' | 'full_chart' | 'personal_year') => {
    if (!user) return;

    if (!user.isPremium && reports.length >= FREE_TIER_LIMITS.reportsPerMonth) {
      router.push('/premium');
      return;
    }

    const numberFocus =
      type === 'life_path'
        ? user.numerology.lifePath.value
        : type === 'personal_year'
        ? user.numerology.personalYear.value
        : user.numerology.expression.value;

    const report = generateReport(user.id, numberFocus, type);
    addReport(report);
    router.push(`/report/${report.id}` as never);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Reports" subtitle="Personalized numerology insights" />

      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg }}>
        <View style={{ flex: 1 }}>
          <Button title="Life Path" size="sm" onPress={() => handleGenerate('life_path')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Full Chart" size="sm" variant="secondary" onPress={() => handleGenerate('full_chart')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Personal Year" size="sm" variant="outline" onPress={() => handleGenerate('personal_year')} />
        </View>
      </View>

      {!user?.isPremium && (
        <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md }}>
          Free plan: {FREE_TIER_LIMITS.reportsPerMonth} reports/month. Upgrade for unlimited.
        </Text>
      )}

      {reports.length === 0 ? (
        <Card title="No reports yet" subtitle="Generate your first personalized report above" />
      ) : (
        reports.map((report) => (
          <Card
            key={report.id}
            title={report.title}
            subtitle={new Date(report.createdAt).toLocaleDateString()}
            onPress={() => router.push(`/report/${report.id}` as never)}
            style={{ marginBottom: SPACING.sm }}
          />
        ))
      )}
    </ScreenContainer>
  );
}
