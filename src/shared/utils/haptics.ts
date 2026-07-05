import * as Haptics from 'expo-haptics';
import type { AppSettings } from '../types';

export async function hapticLight(settings?: AppSettings) {
  if (settings?.reducedMotion) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function hapticMedium(settings?: AppSettings) {
  if (settings?.reducedMotion) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function hapticSuccess(settings?: AppSettings) {
  if (settings?.reducedMotion) return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function hapticSelection(settings?: AppSettings) {
  if (settings?.reducedMotion) return;
  await Haptics.selectionAsync();
}
