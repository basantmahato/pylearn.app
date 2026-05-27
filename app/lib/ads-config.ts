// Dynamic AdMob Configuration

export interface RemoteAdConfig {
  adsEnabled: boolean;
  androidAppId: string;
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
  rewardedInterstitialId: string;
  appOpenId: string;
}

// Google standard test Ad unit IDs (Android only)
// https://developers.google.com/admob/android/test-ads
export const FALLBACK_ADS_CONFIG: RemoteAdConfig = {
  adsEnabled: false,
  androidAppId: "ca-app-pub-3940256099942544~3347511713",
  bannerId: "ca-app-pub-3940256099942544/6300978111",
  interstitialId: "ca-app-pub-3940256099942544/1033173712",
  rewardedId: "ca-app-pub-3940256099942544/5224354917",
  rewardedInterstitialId: "ca-app-pub-3940256099942544/5354046379",
  appOpenId: "ca-app-pub-3940256099942544/9257395921",
};

// Helper to determine the target Ad Unit ID based on dynamic config, format, and environment
export function getActiveAdUnitId(
  type: "bannerId" | "interstitialId" | "rewardedId" | "rewardedInterstitialId" | "appOpenId",
  config: RemoteAdConfig | null,
  isProduction = false
): string {
  // If config is not loaded yet, return standard safe Google test IDs
  if (!config) {
    return FALLBACK_ADS_CONFIG[type];
  }

  // Serve production keys from database only in production build environment
  if (isProduction) {
    return config[type] || FALLBACK_ADS_CONFIG[type];
  }

  // Default to standard Google test IDs in development to protect AdMob accounts
  return FALLBACK_ADS_CONFIG[type];
}
