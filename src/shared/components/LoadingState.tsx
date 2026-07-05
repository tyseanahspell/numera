import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen }: LoadingStateProps) {
  return (
    <View
      style={{
        flex: fullScreen ? 1 : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: fullScreen ? COLORS.navy900 : 'transparent',
      }}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={COLORS.gold} />
      <Text style={{ color: COLORS.textMuted, marginTop: 16 }}>{message}</Text>
    </View>
  );
}
