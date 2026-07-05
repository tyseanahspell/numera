import React from 'react';
import { View, Text, Pressable, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { useSettingsStore } from '../store';
import { getAccessibleFontSize } from '../utils/accessibility';
import { hapticLight } from '../utils/haptics';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  glow?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ title, subtitle, onPress, glow, children, footer, style, ...props }: CardProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);
  const highContrast = useSettingsStore((s) => s.settings.highContrast);

  const content = (
    <LinearGradient
      colors={highContrast ? ['#0A0A0A', '#111111'] : [COLORS.surface, COLORS.surfaceElevated]}
      style={[
        {
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.md,
          borderWidth: 1,
          borderColor: glow ? COLORS.gold : highContrast ? '#FFFFFF33' : COLORS.navy700,
          shadowColor: glow ? COLORS.gold : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glow ? 0.3 : 0,
          shadowRadius: glow ? 12 : 0,
        },
        style,
      ]}
      {...props}
    >
      {title && (
        <Text
          style={{
            color: COLORS.white,
            fontSize: getAccessibleFontSize(18, fontScale),
            fontWeight: '600',
            marginBottom: subtitle ? 4 : SPACING.sm,
          }}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: getAccessibleFontSize(14, fontScale),
            marginBottom: SPACING.sm,
          }}
        >
          {subtitle}
        </Text>
      )}
      {children}
      {footer && <View style={{ marginTop: SPACING.sm }}>{footer}</View>}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={async () => {
          await hapticLight(useSettingsStore.getState().settings);
          onPress();
        }}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
