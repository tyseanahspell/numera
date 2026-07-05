import { Redirect } from 'expo-router';
import { useAuthStore } from '@/shared/store';
import { LoadingState } from '@/shared/components';

export default function Index() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  if (isLoading) {
    return <LoadingState fullScreen message="Awakening your numbers..." />;
  }

  if (!isAuthenticated || !onboardingComplete) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
