import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { updatePremiumStatus } from './firebase';

const extra = Constants.expoConfig?.extra ?? {};

const ENTITLEMENT_ID = 'premium';

export async function initRevenueCat(userId: string) {
  const apiKey =
    Platform.OS === 'ios' ? extra.revenueCatAppleKey : extra.revenueCatGoogleKey;

  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  Purchases.configure({ apiKey, appUserID: userId });
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch {
    return [];
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'userCancelled' in e && (e as { userCancelled: boolean }).userCancelled) {
      return false;
    }
    throw e;
  }
}

export async function restorePurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
}

export function isPremiumActive(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
}

export async function syncPremiumStatus(userId: string) {
  try {
    const info = await Purchases.getCustomerInfo();
    const isPremium = isPremiumActive(info);
    await updatePremiumStatus(userId, isPremium);
    return isPremium;
  } catch {
    return false;
  }
}

export const PREMIUM_FEATURES = {
  unlimitedReports: true,
  compatibility: true,
  advancedCharts: true,
  dailyForecasts: true,
  journalExport: true,
  pdfReports: true,
  themes: true,
  widgets: true,
  noAds: true,
} as const;
