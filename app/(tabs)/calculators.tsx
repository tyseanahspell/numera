import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Card, ScreenHeader } from '@/shared/components';
import { SPACING } from '@/shared/constants/theme';
import { CALCULATOR_TYPES } from '@/shared/constants';

export default function CalculatorsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Calculators"
        subtitle="Step-by-step calculations for every core number"
      />

      {CALCULATOR_TYPES.map((calc) => (
        <Card
          key={calc.id}
          title={calc.title}
          subtitle={calc.description}
          onPress={() => router.push(`/calculator/${calc.id}` as never)}
          style={{ marginBottom: SPACING.sm }}
        />
      ))}
    </ScreenContainer>
  );
}
