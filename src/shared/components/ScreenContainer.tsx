import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  noGradient?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  noGradient,
}: ScreenContainerProps) {
  const content = (
    <View style={{ flex: 1, padding: padded ? SPACING.md : 0 }}>{children}</View>
  );

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: SPACING.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  if (noGradient) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.navy900 }}>
        <StatusBar barStyle="light-content" />
        {body}
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={[COLORS.navy900, COLORS.navy800, COLORS.navy900]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {body}
      </SafeAreaView>
    </LinearGradient>
  );
}
