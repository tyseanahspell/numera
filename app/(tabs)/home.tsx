import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import {
  Card,
  ScreenHeader,
  NumberBadge,
  DisclaimerBanner,
  ProgressBar,
} from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAuthStore, useAppDataStore } from '@/shared/store';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const dailyInsight = useAppDataStore((s) => s.dailyInsight);
  const reports = useAppDataStore((s) => s.reports);
  const lessonProgress = useAppDataStore((s) => s.lessonProgress);
  const bookmarks = useAppDataStore((s) => s.bookmarks);
  const refreshDaily = useAppDataStore((s) => s.refreshDailyInsight);

  useEffect(() => {
    refreshDaily();
  }, []);

  const completedLessons = lessonProgress.filter((p) => p.completed).length;
  const progressPct = Math.round((completedLessons / 12) * 100);

  const quickActions = [
    { label: 'AI Coach', icon: 'chatbubbles' as const, route: '/(tabs)/coach' },
    { label: 'Calculators', icon: 'calculator' as const, route: '/(tabs)/calculators' },
    { label: 'Compatibility', icon: 'heart' as const, route: '/compatibility' },
    { label: 'Journal', icon: 'journal' as const, route: '/(tabs)/more/journal' },
    { label: 'Search', icon: 'search' as const, route: '/search' },
  ];

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ScreenHeader
          title={`Hello, ${user?.firstName ?? 'Seeker'}`}
          subtitle="Your daily numerology insight awaits"
        />
        <Pressable onPress={() => router.push('/search')} accessibilityLabel="Search">
          <Ionicons name="search" size={24} color={COLORS.gold} />
        </Pressable>
      </View>

      {dailyInsight && (
        <Card title="Daily Insight" glow subtitle={dailyInsight.date} style={{ marginBottom: SPACING.md }}>
          <Text style={{ color: COLORS.white, lineHeight: 22, marginBottom: SPACING.sm }}>
            {dailyInsight.reflection}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
            <NumberBadge value={dailyInsight.personalDayNumber} label="Personal Day" size="sm" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.gold, fontSize: 13, fontWeight: '600' }}>Affirmation</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{dailyInsight.affirmation}</Text>
            </View>
          </View>
        </Card>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.lg }}>
        <NumberBadge
          value={user?.numerology.lifePath.value ?? 0}
          label="Life Path"
          isMaster={user?.numerology.lifePath.isMasterNumber}
        />
        <NumberBadge
          value={user?.numerology.personalDay.value ?? 0}
          label="Personal Day"
        />
        <NumberBadge
          value={user?.numerology.personalYear.value ?? 0}
          label="Personal Year"
        />
      </View>

      <Text style={{ color: COLORS.white, fontWeight: '600', marginBottom: SPACING.sm }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg }}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => router.push(action.route as never)}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: SPACING.md,
              width: '30%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.navy700,
            }}
          >
            <Ionicons
              name={action.icon === 'journal' ? 'create-outline' : `${action.icon}-outline` as keyof typeof Ionicons.glyphMap}
              size={24}
              color={COLORS.gold}
            />
            <Text style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4 }}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <Card title="Learning Progress" style={{ marginBottom: SPACING.md }}>
        <ProgressBar progress={progressPct} label={`${completedLessons} of 12 lessons`} />
      </Card>

      {reports.length > 0 && (
        <Card
          title="Recent Reports"
          style={{ marginBottom: SPACING.md }}
          onPress={() => router.push(`/(tabs)/more/reports` as never)}
        >
          {reports.slice(0, 2).map((r) => (
            <Text key={r.id} style={{ color: COLORS.textMuted, marginBottom: 4 }}>
              • {r.title}
            </Text>
          ))}
        </Card>
      )}

      {bookmarks.length > 0 && (
        <Card title="Bookmarks" subtitle={`${bookmarks.length} saved`} style={{ marginBottom: SPACING.md }} />
      )}

      <DisclaimerBanner compact />
    </ScreenContainer>
  );
}
