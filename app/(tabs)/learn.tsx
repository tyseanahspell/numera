import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Card, ScreenHeader, ProgressBar } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { LESSONS_DATA } from '@/features/learn/data/lessons';
import { useAppDataStore } from '@/shared/store';
import { ACHIEVEMENTS_LIST } from '@/shared/constants';

export default function LearnScreen() {
  const router = useRouter();
  const lessonProgress = useAppDataStore((s) => s.lessonProgress);
  const achievements = useAppDataStore((s) => s.achievements);

  const completed = lessonProgress.filter((p) => p.completed).length;

  return (
    <ScreenContainer>
      <ScreenHeader title="Learn" subtitle="Master numerology at your own pace" />

      <Card title="Your Progress" style={{ marginBottom: SPACING.lg }}>
        <ProgressBar progress={(completed / LESSONS_DATA.length) * 100} label={`${completed}/${LESSONS_DATA.length} lessons`} />
      </Card>

      <Text style={{ color: COLORS.white, fontWeight: '600', marginBottom: SPACING.sm }}>Lessons</Text>
      {LESSONS_DATA.map((lesson) => {
        const progress = lessonProgress.find((p) => p.lessonId === lesson.id);
        return (
          <Card
            key={lesson.id}
            title={lesson.title}
            subtitle={`${lesson.topic} · ${lesson.durationMinutes} min · ${lesson.experienceLevel}`}
            onPress={() => router.push(`/lesson/${lesson.id}` as never)}
            style={{ marginBottom: SPACING.sm }}
            footer={
              progress?.completed ? (
                <Text style={{ color: COLORS.gold, fontSize: 12 }}>
                  ✓ Completed {progress.quizScore !== undefined ? `· Quiz: ${progress.quizScore}%` : ''}
                </Text>
              ) : undefined
            }
          />
        );
      })}

      <Text style={{ color: COLORS.white, fontWeight: '600', marginTop: SPACING.lg, marginBottom: SPACING.sm }}>
        Achievements
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
        {ACHIEVEMENTS_LIST.map((a) => {
          const unlocked = achievements.find((ua) => ua.id === a.id);
          return (
            <View
              key={a.id}
              style={{
                backgroundColor: unlocked ? COLORS.navy700 : COLORS.surface,
                borderRadius: 12,
                padding: SPACING.sm,
                width: '47%',
                opacity: unlocked ? 1 : 0.5,
                borderWidth: 1,
                borderColor: unlocked ? COLORS.gold : COLORS.navy700,
              }}
            >
              <Text style={{ fontSize: 24 }}>{a.icon}</Text>
              <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 13 }}>{a.title}</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 11 }}>{a.description}</Text>
            </View>
          );
        })}
      </View>
    </ScreenContainer>
  );
}
