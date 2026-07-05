import React from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, ScreenHeader, Card, DisclaimerBanner } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useSettingsStore, useAuthStore } from '@/shared/store';
import { signOut, deleteUserAccount } from '@/shared/services/firebase';
import { restorePurchases } from '@/shared/services/revenuecat';
import { scheduleDailyNotification } from '@/shared/services/notifications';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const handleNotifications = async (enabled: boolean) => {
    updateSettings({
      notifications: { ...settings.notifications, dailyInsight: enabled },
    });
    if (enabled) await scheduleDailyNotification({ ...settings.notifications, dailyInsight: true });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.replace('/(auth)/welcome');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (user) await deleteUserAccount(user.id);
            await signOut();
            setUser(null);
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleRestore = async () => {
    const restored = await restorePurchases();
    Alert.alert(restored ? 'Restored!' : 'No Purchases', restored ? 'Premium features unlocked.' : 'No active subscriptions found.');
  };

  const SettingRow = ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.navy700,
      }}
    >
      <Text style={{ color: COLORS.white }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.navy700, true: COLORS.goldDark }}
        thumbColor={value ? COLORS.gold : COLORS.textMuted}
      />
    </View>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Settings" subtitle="Customize your experience" />

      <Card title="Appearance" style={{ marginBottom: SPACING.md }}>
        <SettingRow label="Dark Mode" value={settings.darkMode} onValueChange={(v) => updateSettings({ darkMode: v })} />
        <SettingRow label="High Contrast" value={settings.highContrast} onValueChange={(v) => updateSettings({ highContrast: v })} />
        <SettingRow label="Reduced Motion" value={settings.reducedMotion} onValueChange={(v) => updateSettings({ reducedMotion: v })} />
      </Card>

      <Card title="Notifications" style={{ marginBottom: SPACING.md }}>
        <SettingRow label="Daily Insight" value={settings.notifications.dailyInsight} onValueChange={handleNotifications} />
        <SettingRow
          label="Journal Prompts"
          value={settings.notifications.journalPrompt}
          onValueChange={(v) => updateSettings({ notifications: { ...settings.notifications, journalPrompt: v } })}
        />
      </Card>

      <Card title="Numerology System" style={{ marginBottom: SPACING.md }}>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          <Button
            title="Pythagorean"
            size="sm"
            variant={settings.numerologySystem === 'pythagorean' ? 'primary' : 'outline'}
            onPress={() => updateSettings({ numerologySystem: 'pythagorean' })}
          />
          <Button
            title="Chaldean"
            size="sm"
            variant={settings.numerologySystem === 'chaldean' ? 'primary' : 'outline'}
            onPress={() => updateSettings({ numerologySystem: 'chaldean' })}
          />
        </View>
      </Card>

      <Card title="Account" style={{ marginBottom: SPACING.md }}>
        <Text style={{ color: COLORS.textMuted, marginBottom: SPACING.sm }}>
          {user?.email ?? 'Guest Account'}
        </Text>
        <Button title="Restore Purchases" variant="outline" onPress={handleRestore} />
        <View style={{ marginTop: SPACING.sm }}>
          <Button title="Sign Out" variant="secondary" onPress={handleSignOut} />
        </View>
        <View style={{ marginTop: SPACING.sm }}>
          <Button title="Delete Account" variant="ghost" onPress={handleDeleteAccount} />
        </View>
      </Card>

      <DisclaimerBanner />
    </ScreenContainer>
  );
}
