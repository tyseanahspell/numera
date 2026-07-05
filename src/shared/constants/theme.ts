export const COLORS = {
  navy900: '#0A0E1A',
  navy800: '#0F1A2E',
  navy700: '#1A2B4A',
  navy600: '#2B4270',
  black: '#050810',
  gold: '#C9A84C',
  goldLight: '#E4C970',
  goldDark: '#A88A3A',
  white: '#FFFFFF',
  textMuted: '#9EADC9',
  surface: '#12182A',
  surfaceElevated: '#1A2238',
  error: '#E74C3C',
  success: '#2ECC71',
} as const;

export const GRADIENTS = {
  primary: ['#0A0E1A', '#1A2B4A', '#0F1A2E'] as const,
  gold: ['#C9A84C', '#E4C970', '#A88A3A'] as const,
  card: ['#12182A', '#1A2238'] as const,
  hero: ['#0A0E1A', '#1A2B4A', '#2B4270'] as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
