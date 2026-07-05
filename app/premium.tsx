import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Card, ScreenHeader } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { getOfferings, purchasePackage, restorePurchases } from '@/shared/services/revenuecat';
import type { PurchasesPackage } from 'react-native-purchases';
import { useAuthStore } from '@/shared/store';

const FEATURES = [
  'Unlimited reports',
  'Compatibility analysis',
  'Advanced charts',
  'Daily forecasts',
  'Journal exports',
  'PDF reports',
  'Custom themes',
  'Home screen widgets',
  'Ad-free experience',
];

export default function PremiumScreen() {
  const router = useRouter();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOfferings().then(setPackages);
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setLoading(true);
    try {
      const success = await purchasePackage(pkg);
      if (success) {
        updateProfile({ isPremium: true });
        Alert.alert('Welcome to Premium!', 'All features are now unlocked.');
        router.back();
      }
    } catch {
      Alert.alert('Purchase Failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    const restored = await restorePurchases();
    if (restored) {
      updateProfile({ isPremium: true });
      Alert.alert('Restored!', 'Premium features unlocked.');
    } else {
      Alert.alert('No Purchases', 'No active subscription found.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Numera Premium" subtitle="Unlock the full numerology experience" />

      <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
        <Text style={{ fontSize: 48 }}>✦</Text>
        <Text style={{ color: COLORS.gold, fontSize: 18, fontWeight: '600', marginTop: 8 }}>
          Elevate Your Journey
        </Text>
      </View>

      <Card title="Premium Includes" style={{ marginBottom: SPACING.lg }}>
        {FEATURES.map((f) => (
          <Text key={f} style={{ color: COLORS.white, marginBottom: 6 }}>✦ {f}</Text>
        ))}
      </Card>

      {packages.length > 0 ? (
        packages.map((pkg) => (
          <View key={pkg.identifier} style={{ marginBottom: SPACING.sm }}>
            <Button
              title={`${pkg.product.title} — ${pkg.product.priceString}`}
              onPress={() => handlePurchase(pkg)}
              loading={loading}
            />
          </View>
        ))
      ) : (
        <Card title="Monthly" subtitle="$9.99/month" style={{ marginBottom: SPACING.sm }}>
          <Button title="Subscribe" onPress={() => Alert.alert('Demo', 'Configure RevenueCat to enable purchases.')} />
        </Card>
      )}

      <Button title="Restore Purchases" variant="ghost" onPress={handleRestore} />
    </ScreenContainer>
  );
}
