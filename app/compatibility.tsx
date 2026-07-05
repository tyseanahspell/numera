import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Input, ScreenHeader, Card, ProgressBar } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { calculateCompatibility } from '@/shared/utils/numerology';
import { useAuthStore } from '@/shared/store';
import type { CompatibilityResult } from '@/shared/types';

const schema = z.object({
  nameA: z.string().min(1),
  birthDateA: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nameB: z.string().min(1),
  birthDateB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type FormData = z.infer<typeof schema>;

export default function CompatibilityScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameA: user?.fullBirthName ?? '',
      birthDateA: user?.birthDate ?? '',
      nameB: '',
      birthDateB: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (!user?.isPremium) {
      router.push('/premium');
      return;
    }
    setResult(calculateCompatibility(
      { name: data.nameA, birthDate: data.birthDateA },
      { name: data.nameB, birthDate: data.birthDateB }
    ));
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <View style={{ marginBottom: SPACING.sm }}>
      <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{label}</Text>
      <ProgressBar progress={score} />
    </View>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Compatibility" subtitle="Compare two numerology charts" />

      {!user?.isPremium && (
        <Card title="Premium Feature" subtitle="Upgrade to compare compatibility" style={{ marginBottom: SPACING.md }} />
      )}

      <Controller control={control} name="nameA"
        render={({ field: { onChange, value } }) => (
          <Input label="Your Name" value={value} onChangeText={onChange} />
        )} />
      <Controller control={control} name="birthDateA"
        render={({ field: { onChange, value } }) => (
          <Input label="Your Birth Date" value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" />
        )} />
      <Controller control={control} name="nameB"
        render={({ field: { onChange, value } }) => (
          <Input label="Partner's Name" value={value} onChangeText={onChange} />
        )} />
      <Controller control={control} name="birthDateB"
        render={({ field: { onChange, value } }) => (
          <Input label="Partner's Birth Date" value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" />
        )} />

      <Button title="Calculate Compatibility" onPress={handleSubmit(onSubmit)} />

      {result && (
        <View style={{ marginTop: SPACING.xl }}>
          <Card title={`Overall: ${result.overallScore}%`} glow>
            <Text style={{ color: COLORS.textMuted, marginBottom: SPACING.md }}>
              {result.personA.name} (Life Path {result.personA.lifePath}) & {result.personB.name} (Life Path {result.personB.lifePath})
            </Text>
            <ScoreBar label="Communication" score={result.communication} />
            <ScoreBar label="Romance" score={result.romance} />
            <ScoreBar label="Friendship" score={result.friendship} />
            <ScoreBar label="Business" score={result.business} />
          </Card>

          <Card title="Strengths" style={{ marginTop: SPACING.md }}>
            {result.strengths.map((s) => (
              <Text key={s} style={{ color: COLORS.white, marginBottom: 4 }}>• {s}</Text>
            ))}
          </Card>

          <Card title="Challenges" style={{ marginTop: SPACING.md }}>
            {result.challenges.map((c) => (
              <Text key={c} style={{ color: COLORS.textMuted, marginBottom: 4 }}>• {c}</Text>
            ))}
          </Card>
        </View>
      )}
    </ScreenContainer>
  );
}
