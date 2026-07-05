import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationPreferences } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyNotification(prefs: NotificationPreferences) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!prefs.dailyInsight) return;

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: prefs.hour,
    minute: prefs.minute,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Daily Numerology Insight ✨',
      body: 'Discover what today\'s personal number holds for you.',
      data: { screen: 'home' },
    },
    trigger,
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'Daily Insights',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
