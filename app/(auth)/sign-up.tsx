import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Input, ScreenHeader } from '@/shared/components';
import { SPACING } from '@/shared/constants/theme';
import { signUpWithEmail } from '@/shared/services/firebase';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signUpWithEmail(data.email, data.password);
      router.replace('/(onboarding)/profile');
    } catch {
      Alert.alert('Sign Up Failed', 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Create Account" subtitle="Begin your numerology journey" />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" value={value} onChangeText={onChange} onBlur={onBlur}
            keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Password" value={value} onChangeText={onChange} onBlur={onBlur}
            secureTextEntry error={errors.password?.message} />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Confirm Password" value={value} onChangeText={onChange} onBlur={onBlur}
            secureTextEntry error={errors.confirmPassword?.message} />
        )}
      />

      <View style={{ marginTop: SPACING.lg }}>
        <Button title="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </ScreenContainer>
  );
}
