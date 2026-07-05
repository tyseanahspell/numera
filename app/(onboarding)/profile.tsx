import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Input, ScreenHeader, ProgressBar } from '@/shared/components';
import { SPACING } from '@/shared/constants/theme';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  fullBirthName: z.string().min(2, 'Full birth name is required'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD'),
  birthTime: z.string().optional(),
  birthLocation: z.string().optional(),
});

export type OnboardingProfile = z.infer<typeof schema>;

// Shared state via module — persisted on complete
export let onboardingData: Partial<OnboardingProfile & { experienceLevel?: string; goals?: string[] }> = {};

export default function ProfileScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<OnboardingProfile>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: onboardingData.firstName ?? '',
      fullBirthName: onboardingData.fullBirthName ?? '',
      birthDate: onboardingData.birthDate ?? '',
      birthTime: onboardingData.birthTime ?? '',
      birthLocation: onboardingData.birthLocation ?? '',
    },
  });

  const onSubmit = (data: OnboardingProfile) => {
    onboardingData = { ...onboardingData, ...data };
    router.push('/(onboarding)/experience');
  };

  return (
    <ScreenContainer>
      <ProgressBar progress={25} label="Step 1 of 4" />
      <ScreenHeader
        title="Your Profile"
        subtitle="We'll use this to calculate your personal numerology chart"
      />

      <Controller control={control} name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="First Name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.firstName?.message} />
        )} />
      <Controller control={control} name="fullBirthName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Full Birth Name" value={value} onChangeText={onChange} onBlur={onBlur}
            hint="As it appears on your birth certificate" error={errors.fullBirthName?.message} />
        )} />
      <Controller control={control} name="birthDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Birth Date" value={value} onChangeText={onChange} onBlur={onBlur}
            placeholder="YYYY-MM-DD" error={errors.birthDate?.message} />
        )} />
      <Controller control={control} name="birthTime"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Birth Time (optional)" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="HH:MM" />
        )} />
      <Controller control={control} name="birthLocation"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Birth Location (optional)" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="City, Country" />
        )} />

      <View style={{ marginTop: SPACING.lg }}>
        <Button title="Continue" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenContainer>
  );
}
