import type { AppSettings } from '../types';

export function getAccessibleFontSize(base: number, scale: number): number {
  return Math.round(base * Math.max(0.85, Math.min(1.5, scale)));
}

export function shouldReduceMotion(settings: AppSettings): boolean {
  return settings.reducedMotion;
}

export function getContrastColors(highContrast: boolean) {
  if (highContrast) {
    return {
      background: '#000000',
      surface: '#0A0A0A',
      text: '#FFFFFF',
      textMuted: '#E0E0E0',
      accent: '#FFD700',
      border: '#FFFFFF',
    };
  }
  return {
    background: '#0A0E1A',
    surface: '#12182A',
    text: '#FFFFFF',
    textMuted: '#9EADC9',
    accent: '#C9A84C',
    border: '#1A2B4A',
  };
}
