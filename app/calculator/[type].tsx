import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import {
  ScreenHeader,
  CalculationSteps,
  NumberBadge,
  Button,
  Card,
} from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { useAuthStore } from '@/shared/store';
import { useSettingsStore } from '@/shared/store';
import {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
  calculateBirthday,
  calculateMaturity,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculatePersonalDay,
  calculateChallenges,
  calculatePinnacles,
  calculateBalance,
  buildNumerologyProfile,
} from '@/shared/utils/numerology';
import { getNumberMeaning } from '@/shared/utils/reportGenerator';
import { buildCalculationContext } from '@/shared/services/ai/coach';
import { useAICoach } from '@/features/coach/hooks/useAICoach';

const CALCULATOR_MAP: Record<string, string> = {
  life_path: 'Life Path Number',
  expression: 'Expression Number',
  soul_urge: 'Soul Urge Number',
  personality: 'Personality Number',
  birthday: 'Birthday Number',
  maturity: 'Maturity Number',
  personal_year: 'Personal Year',
  personal_month: 'Personal Month',
  personal_day: 'Personal Day',
  challenges: 'Challenge Numbers',
  pinnacles: 'Pinnacle Numbers',
  balance: 'Balance Number',
  karmic_debt: 'Karmic Debt Numbers',
  master_numbers: 'Master Numbers',
};

export default function CalculatorScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const system = useSettingsStore((s) => s.settings.numerologySystem);
  const { startConversation, sendMessage } = useAICoach();

  const results = useMemo(() => {
    if (!user) return null;
    const { fullBirthName, birthDate } = user;
    const profile = buildNumerologyProfile(fullBirthName, birthDate, new Date(), system);

    switch (type) {
      case 'life_path': return { single: profile.lifePath };
      case 'expression': return { single: profile.expression };
      case 'soul_urge': return { single: profile.soulUrge };
      case 'personality': return { single: profile.personality };
      case 'birthday': return { single: profile.birthday };
      case 'maturity': return { single: profile.maturity };
      case 'personal_year': return { single: profile.personalYear };
      case 'personal_month': return { single: profile.personalMonth };
      case 'personal_day': return { single: profile.personalDay };
      case 'challenges': return { multiple: profile.challenges };
      case 'pinnacles': return { multiple: profile.pinnacles };
      case 'balance': return { single: profile.balance };
      case 'karmic_debt':
        return {
          info: profile.karmicDebts.length
            ? profile.karmicDebts.map((d) => `Karmic Debt ${d}`).join(', ')
            : 'No Karmic Debt numbers detected in your core chart.',
        };
      case 'master_numbers':
        return {
          info: profile.masterNumbers.length
            ? profile.masterNumbers.map((m) => `Master Number ${m}`).join(', ')
            : 'No Master Numbers in your core chart.',
        };
      default: return null;
    }
  }, [user, type, system]);

  const title = CALCULATOR_MAP[type ?? ''] ?? 'Calculator';

  const handleAskAI = async () => {
    if (!results || !user) return;
    const calcResult = 'single' in results && results.single ? results.single : null;
    if (!calcResult) return;

    const convId = startConversation(`Explain my ${title}`);
    router.push('/(tabs)/coach');
    await sendMessage(`How did you calculate my ${title}?`, {
      conversationId: convId,
      context: {
        calculationExplanation: buildCalculationContext(title, calcResult),
      },
    });
  };

  if (!user || !results) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Calculator" subtitle="Complete onboarding first" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={title} subtitle={`${system} system · ${user.fullBirthName}`} />

      {'single' in results && results.single && (
        <>
          <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
            <NumberBadge
              value={results.single.value}
              size="lg"
              isMaster={results.single.isMasterNumber}
            />
          </View>
          <Card title="Meaning" style={{ marginBottom: SPACING.md }}>
            <Text style={{ color: COLORS.textMuted, lineHeight: 22 }}>
              {getNumberMeaning(results.single.value).essence}
            </Text>
          </Card>
          <Text style={{ color: COLORS.white, fontWeight: '600', marginBottom: SPACING.sm }}>
            Step-by-Step Calculation
          </Text>
          <CalculationSteps result={results.single} />
          <View style={{ marginTop: SPACING.lg }}>
            <Button title="Ask AI About This" onPress={handleAskAI} />
          </View>
        </>
      )}

      {'multiple' in results && results.multiple && (
        <>
          {results.multiple.map((r, i) => (
            <View key={i} style={{ marginBottom: SPACING.lg }}>
              <Text style={{ color: COLORS.gold, fontWeight: '600', marginBottom: SPACING.sm }}>
                {r.steps[0]?.label ?? `Number ${i + 1}`}
              </Text>
              <CalculationSteps result={r} />
            </View>
          ))}
        </>
      )}

      {'info' in results && (
        <Card title="Result">
          <Text style={{ color: COLORS.white, lineHeight: 22 }}>{results.info}</Text>
        </Card>
      )}
    </ScreenContainer>
  );
}
