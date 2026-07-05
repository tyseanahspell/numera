import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, ScreenHeader, ProgressBar } from '@/shared/components';
import { COLORS, SPACING, BORDER_RADIUS } from '@/shared/constants/theme';
import { EXPERIENCE_LEVELS } from '@/shared/constants';
import type { ExperienceLevel } from '@/shared/types';
import { onboardingData } from './profile';
import { hapticSelection } from '@/shared/utils/haptics';

export default function ExperienceScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<ExperienceLevel | null>(
    (onboardingData.experienceLevel as ExperienceLevel) ?? null
  );

  const handleContinue = () => {
    if (!selected) return;
    onboardingData.experienceLevel = selected;
    router.push('/(onboarding)/goals');
  };

  return (
    <ScreenContainer>
      <ProgressBar progress={50} label="Step 2 of 4" />
      <ScreenHeader
        title="Your Experience"
        subtitle="This helps your AI Coach tailor explanations to you"
      />

      <View style={{ gap: SPACING.sm }}>
        {EXPERIENCE_LEVELS.map((level) => {
          const active = selected === level.value;
          return (
            <Pressable
              key={level.value}
              onPress={async () => {
                await hapticSelection();
                setSelected(level.value);
              }}
              style={{
                backgroundColor: active ? COLORS.navy700 : COLORS.surface,
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.md,
                borderWidth: 1,
                borderColor: active ? COLORS.gold : COLORS.navy700,
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 16 }}>{level.label}</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>{level.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: SPACING.xl }}>
        <Button title="Continue" onPress={handleContinue} disabled={!selected} />
      </View>
    </ScreenContainer>
  );
}
