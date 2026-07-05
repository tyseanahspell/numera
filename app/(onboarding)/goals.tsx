import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, ScreenHeader, ProgressBar } from '@/shared/components';
import { COLORS, SPACING, BORDER_RADIUS } from '@/shared/constants/theme';
import { USER_GOALS } from '@/shared/constants';
import type { UserGoal } from '@/shared/types';
import { onboardingData } from './profile';
import { hapticSelection } from '@/shared/utils/haptics';

export default function GoalsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserGoal[]>(
    (onboardingData.goals as UserGoal[]) ?? []
  );

  const toggle = async (goal: UserGoal) => {
    await hapticSelection();
    setSelected((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleContinue = () => {
    onboardingData.goals = selected;
    router.push('/(onboarding)/complete');
  };

  return (
    <ScreenContainer>
      <ProgressBar progress={75} label="Step 3 of 4" />
      <ScreenHeader title="Your Goals" subtitle="Select all that resonate with you" />

      <View style={{ gap: SPACING.sm }}>
        {USER_GOALS.map((goal) => {
          const active = selected.includes(goal.value);
          return (
            <Pressable
              key={goal.value}
              onPress={() => toggle(goal.value)}
              style={{
                backgroundColor: active ? COLORS.navy700 : COLORS.surface,
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.md,
                borderWidth: 1,
                borderColor: active ? COLORS.gold : COLORS.navy700,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.sm,
              }}
            >
              <Text style={{ fontSize: 20 }}>{goal.icon === 'book' ? '📖' : goal.icon === 'heart' ? '💫' : goal.icon === 'briefcase' ? '💼' : goal.icon === 'star' ? '⭐' : '🔮'}</Text>
              <Text style={{ color: COLORS.white, fontWeight: '500' }}>{goal.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: SPACING.xl }}>
        <Button title="Continue" onPress={handleContinue} disabled={selected.length === 0} />
      </View>
    </ScreenContainer>
  );
}
