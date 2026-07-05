import React, { useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Input, ScreenHeader, DisclaimerBanner } from '@/shared/components';
import { SPACING } from '@/shared/constants/theme';
import { signInWithEmail } from '@/shared/services/firebase';
import { useAuthStore } from '@/shared/store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert('Sign In Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Sign In', 'Available on iOS devices only.');
      return;
    }
    try {
      await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      router.replace('/(onboarding)/profile');
    } catch {
      // user cancelled
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Welcome Back" subtitle="Sign in to continue your journey" />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <View style={{ gap: SPACING.sm, marginTop: SPACING.md }}>
        <Button title="Sign In" onPress={handleSubmit(onSubmit)} loading={loading} />
        {Platform.OS === 'ios' && (
          <Button title="Sign in with Apple" variant="secondary" onPress={handleApple} />
        )}
        <Button title="Create Account" variant="ghost" onPress={() => router.push('/(auth)/sign-up')} />
      </View>

      <View style={{ marginTop: SPACING.xl }}>
        <DisclaimerBanner compact />
      </View>
    </ScreenContainer>
  );
}
