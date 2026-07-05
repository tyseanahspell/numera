import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import type { NumberResult } from '../types';
import { useSettingsStore } from '../store';
import { getAccessibleFontSize } from '../utils/accessibility';

interface NumberBadgeProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  isMaster?: boolean;
}

export function NumberBadge({ value, label, size = 'md', isMaster }: NumberBadgeProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);
  const sizes = { sm: 40, md: 56, lg: 72 };
  const dim = sizes[size];

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: COLORS.navy700,
          borderWidth: 2,
          borderColor: isMaster ? COLORS.goldLight : COLORS.gold,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: COLORS.gold,
          shadowOpacity: isMaster ? 0.4 : 0.2,
          shadowRadius: 8,
        }}
        accessibilityLabel={`${label ?? 'Number'} ${value}`}
      >
        <Text
          style={{
            color: COLORS.gold,
            fontSize: getAccessibleFontSize(size === 'lg' ? 32 : size === 'md' ? 24 : 18, fontScale),
            fontWeight: '700',
          }}
        >
          {value}
        </Text>
      </View>
      {label && (
        <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 6 }}>{label}</Text>
      )}
    </View>
  );
}

interface CalculationStepsProps {
  result: NumberResult;
}

export function CalculationSteps({ result }: CalculationStepsProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);

  return (
    <View style={{ gap: SPACING.sm }}>
      {result.steps.map((step, i) => (
        <View
          key={i}
          style={{
            backgroundColor: COLORS.navy800,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.md,
            borderLeftWidth: 3,
            borderLeftColor: COLORS.gold,
          }}
        >
          <Text style={{ color: COLORS.gold, fontWeight: '600', fontSize: getAccessibleFontSize(13, fontScale) }}>
            Step {i + 1}: {step.label}
          </Text>
          <Text style={{ color: COLORS.white, fontSize: getAccessibleFontSize(15, fontScale), marginTop: 4 }}>
            {step.expression} = {step.result}
          </Text>
          {step.note && (
            <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
              {step.note}
            </Text>
          )}
        </View>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm }}>
        <Text style={{ color: COLORS.textMuted }}>Final Result:</Text>
        <NumberBadge value={result.value} size="sm" isMaster={result.isMasterNumber} />
        {result.karmicDebt && (
          <Text style={{ color: COLORS.goldLight, fontSize: 12 }}>Karmic Debt {result.karmicDebt}</Text>
        )}
      </View>
    </View>
  );
}

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact }: DisclaimerBannerProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.navy800,
        borderRadius: BORDER_RADIUS.md,
        padding: compact ? SPACING.sm : SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.navy600,
      }}
    >
      <Text style={{ color: COLORS.textMuted, fontSize: compact ? 11 : 12, lineHeight: compact ? 16 : 18 }}>
        ✦ Numerology is a spiritual practice for entertainment and self-reflection — not scientific fact.
        It should not replace professional advice.
      </Text>
    </View>
  );
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const fontScale = useSettingsStore((s) => s.settings.fontScale);

  return (
    <View style={{ marginBottom: SPACING.lg }}>
      <Text
        style={{
          color: COLORS.white,
          fontSize: getAccessibleFontSize(28, fontScale),
          fontWeight: '700',
        }}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: COLORS.textMuted, fontSize: getAccessibleFontSize(15, fontScale), marginTop: 4 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }}>
      {label && (
        <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 4 }}>{label}</Text>
      )}
      <View
        style={{
          height: 6,
          backgroundColor: COLORS.navy700,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${clamped}%`,
            backgroundColor: COLORS.gold,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}
