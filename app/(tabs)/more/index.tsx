import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Card, ScreenHeader } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAuthStore } from '@/shared/store';

const MENU_ITEMS = [
  { label: 'Journal', icon: 'create-outline', route: '/(tabs)/more/journal', description: 'Reflect and track patterns' },
  { label: 'Reports', icon: 'document-text-outline', route: '/(tabs)/more/reports', description: 'Your numerology reports' },
  { label: 'Settings', icon: 'settings-outline', route: '/(tabs)/more/settings', description: 'Preferences and privacy' },
  { label: 'Compatibility', icon: 'heart-outline', route: '/compatibility', description: 'Compare two charts', premium: true },
  { label: 'Premium', icon: 'diamond-outline', route: '/premium', description: 'Unlock all features' },
  { label: 'Search', icon: 'search-outline', route: '/search', description: 'Find lessons and meanings' },
] as const;

export default function MoreScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return (
    <ScreenContainer>
      <ScreenHeader title="More" subtitle="Explore all features" />

      <Card title="Your Profile" style={{ marginBottom: SPACING.lg }}>
        <Text style={{ color: COLORS.white, fontWeight: '600' }}>{user?.fullBirthName}</Text>
        <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>Born {user?.birthDate}</Text>
        <Text style={{ color: COLORS.gold, marginTop: 4 }}>
          {user?.isPremium ? '✦ Premium Member' : 'Free Plan'}
        </Text>
      </Card>

      {MENU_ITEMS.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => router.push(item.route as never)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 1,
            borderColor: COLORS.navy700,
          }}
        >
          <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={COLORS.gold} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: COLORS.white, fontWeight: '600' }}>{item.label}</Text>
              {'premium' in item && item.premium && !user?.isPremium && (
                <Text style={{ color: COLORS.gold, fontSize: 10 }}>PREMIUM</Text>
              )}
            </View>
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
