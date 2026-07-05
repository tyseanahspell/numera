import { useAuthStore } from '@/shared/store';
import { FREE_TIER_LIMITS } from '@/shared/types';

export function usePremiumGate() {
  const user = useAuthStore((s) => s.user);

  return {
    isPremium: user?.isPremium ?? false,
    canAccessCompatibility: user?.isPremium ?? false,
    canExportJournal: user?.isPremium ?? false,
    canExportPdf: user?.isPremium ?? false,
    freeReportLimit: FREE_TIER_LIMITS.reportsPerMonth,
  };
}
