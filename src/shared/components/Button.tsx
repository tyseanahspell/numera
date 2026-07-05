import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS } from '../constants/theme';
import { useSettingsStore } from '../store';
import { getAccessibleFontSize } from '../utils/accessibility';
import { hapticLight } from '../utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
}: ButtonProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);

  const handlePress = async () => {
    await hapticLight(useSettingsStore.getState().settings);
    onPress();
  };

  const padding = size === 'sm' ? 10 : size === 'lg' ? 18 : 14;
  const fontSize = getAccessibleFontSize(size === 'sm' ? 14 : size === 'lg' ? 18 : 16, fontScale);

  if (variant === 'primary') {
    return (
      <Pressable onPress={handlePress} disabled={disabled || loading} accessibilityRole="button">
        <LinearGradient
          colors={[COLORS.gold, COLORS.goldDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: BORDER_RADIUS.md,
            paddingVertical: padding,
            paddingHorizontal: 24,
            opacity: disabled ? 0.5 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.navy900} />
          ) : (
            <>
              {icon}
              <Text style={{ color: COLORS.navy900, fontWeight: '700', fontSize }}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyles: Record<string, ViewStyle> = {
    secondary: { backgroundColor: COLORS.surfaceElevated },
    ghost: { backgroundColor: 'transparent' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.gold },
  };

  const textStyles: Record<string, TextStyle> = {
    secondary: { color: COLORS.white },
    ghost: { color: COLORS.gold },
    outline: { color: COLORS.gold },
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={[
        {
          borderRadius: BORDER_RADIUS.md,
          paddingVertical: padding,
          paddingHorizontal: 24,
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        variantStyles[variant],
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.gold} />
      ) : (
        <>
          {icon}
          <Text style={[{ fontWeight: '600', fontSize }, textStyles[variant]]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
