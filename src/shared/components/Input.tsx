import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { useSettingsStore } from '../store';
import { getAccessibleFontSize } from '../utils/accessibility';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, style, ...props }: InputProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);
  const highContrast = useSettingsStore((s) => s.settings.highContrast);

  return (
    <View style={{ marginBottom: SPACING.md }}>
      {label && (
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: getAccessibleFontSize(14, fontScale),
            marginBottom: SPACING.xs,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={COLORS.textMuted}
        style={[
          {
            backgroundColor: highContrast ? '#111' : COLORS.surface,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: error ? COLORS.error : highContrast ? '#FFF' : COLORS.navy700,
            paddingHorizontal: SPACING.md,
            paddingVertical: 14,
            color: COLORS.white,
            fontSize: getAccessibleFontSize(16, fontScale),
          },
          style,
        ]}
        accessibilityLabel={label}
        {...props}
      />
      {error && (
        <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
      {hint && !error && (
        <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{hint}</Text>
      )}
    </View>
  );
}
