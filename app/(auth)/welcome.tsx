import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, DisclaimerBanner } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { signInAsGuest } from '@/shared/services/firebase';
import { useAuthStore } from '@/shared/store';

export default function WelcomeScreen() {
  const router = useRouter();
  const setLoading = useAuthStore((s) => s.setLoading);

  const handleGuest = async () => {
    setLoading(true);
    try {
      await signInAsGuest();
      router.replace('/(onboarding)/profile');
    } catch {
      router.replace('/(onboarding)/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll={false} padded={false}>
      <LinearGradient
        colors={['#0A0E1A', '#1A2B4A', '#2B4270', '#0A0E1A']}
        style={{ flex: 1, justifyContent: 'center', padding: SPACING.xl }}
      >
        <View style={{ alignItems: 'center', marginBottom: SPACING.xxl }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: COLORS.navy700,
              borderWidth: 2,
              borderColor: COLORS.gold,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SPACING.lg,
              shadowColor: COLORS.gold,
              shadowOpacity: 0.4,
              shadowRadius: 20,
            }}
          >
            <Text style={{ fontSize: 48, color: COLORS.gold }}>✦</Text>
          </View>
          <Text style={{ fontSize: 42, fontWeight: '700', color: COLORS.white, letterSpacing: 2 }}>
            Numera
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 16, marginTop: 8, textAlign: 'center' }}>
            Discover the wisdom of numbers through education, reflection, and personalized insight.
          </Text>
        </View>

        <View style={{ gap: SPACING.sm }}>
          <Button title="Continue with Apple" onPress={() => router.push('/(auth)/sign-in')} />
          <Button title="Continue with Google" variant="secondary" onPress={() => router.push('/(auth)/sign-in')} />
          <Button title="Sign in with Email" variant="outline" onPress={() => router.push('/(auth)/sign-in')} />
          <Button title="Continue as Guest" variant="ghost" onPress={handleGuest} />
        </View>

        <View style={{ marginTop: SPACING.xl }}>
          <DisclaimerBanner compact />
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
}
