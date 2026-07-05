import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, NumberBadge, DisclaimerBanner, ProgressBar } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAuthStore } from '@/shared/store';
import { onboardingData } from './profile';
import type { ExperienceLevel, UserGoal } from '@/shared/types';
import { hapticSuccess } from '@/shared/utils/haptics';

export default function CompleteScreen() {
  const router = useRouter();
  const createGuestProfile = useAuthStore((s) => s.createGuestProfile);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user && onboardingData.firstName && onboardingData.fullBirthName && onboardingData.birthDate) {
      createGuestProfile({
        firstName: onboardingData.firstName,
        fullBirthName: onboardingData.fullBirthName,
        birthDate: onboardingData.birthDate,
        birthTime: onboardingData.birthTime,
        birthLocation: onboardingData.birthLocation,
        experienceLevel: (onboardingData.experienceLevel as ExperienceLevel) ?? 'beginner',
        goals: (onboardingData.goals as UserGoal[]) ?? ['learn'],
      });
      setOnboardingComplete(true);
      hapticSuccess();
    }
  }, []);

  const lifePath = user?.numerology.lifePath.value;

  return (
    <ScreenContainer>
      <ProgressBar progress={100} label="Complete!" />

      <View style={{ alignItems: 'center', marginTop: SPACING.xxl, marginBottom: SPACING.xl }}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>✨</Text>
        <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '700', textAlign: 'center' }}>
          Welcome, {user?.firstName ?? onboardingData.firstName}!
        </Text>
        <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 8, paddingHorizontal: SPACING.md }}>
          Your numerology chart has been calculated. Many numerologists would say your journey begins here.
        </Text>
        {lifePath && (
          <View style={{ marginTop: SPACING.xl }}>
            <NumberBadge value={lifePath} label="Life Path Number" size="lg" isMaster={[11, 22, 33].includes(lifePath)} />
          </View>
        )}
      </View>

      <DisclaimerBanner />
      <View style={{ marginTop: SPACING.xl }}>
        <Button title="Explore Numera" onPress={() => router.replace('/(tabs)/home')} />
      </View>
    </ScreenContainer>
  );
}
