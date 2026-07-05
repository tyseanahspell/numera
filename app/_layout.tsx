import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/shared/components';
import { AppQueryProvider } from '@/shared/services/api/queryClient';
import { useAuthStore, useAppDataStore } from '@/shared/store';
import { subscribeToAuth } from '@/shared/services/firebase';

export default function RootLayout() {
  const setLoading = useAuthStore((s) => s.setLoading);
  const refreshDaily = useAppDataStore((s) => s.refreshDailyInsight);

  useEffect(() => {
    const unsub = subscribeToAuth(() => {
      setLoading(false);
    });
    // Fallback if Firebase auth is not configured
    const timer = setTimeout(() => setLoading(false), 1500);
    refreshDaily();
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppQueryProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0A0E1A' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="calculator/[type]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="report/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="lesson/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="compatibility" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="premium" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </AppQueryProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
