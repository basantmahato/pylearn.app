import React from "react";
import { Text, View } from "react-native";
import { useApi } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";
import { getActiveAdUnitId, RemoteAdConfig } from "@/lib/ads-config";

// Only import if native module is available (requires custom dev build)
import { Platform } from "react-native";
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== "web") {
  try {
    const ads = require("react-native-google-mobile-ads");
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch {
    // Native module unavailable
  }
} else {
  // Provide fallback stubs for web
  BannerAd = () => null;
  BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: undefined };
}

export function AdBanner() {
  const [errorText, setErrorText] = React.useState<string | null>(null);

  const { data: config, loading } = useApi<RemoteAdConfig | null>(
    () => apiClient.get("/ads/config").then((res) => res.data).catch(() => null),
    []
  );

  // If loading or server configs have disabled ads, gracefully render nothing
  if (loading || !config || !config.adsEnabled) {
    return null;
  }

  // Automatically use safe test ads in development, production ads in release
  const adUnitId = getActiveAdUnitId("bannerId", config, !__DEV__);

  if (!BannerAd) {
    return (
      <View className="mt-12 w-full bg-surface-container rounded-2xl p-4 border-2 border-dashed border-outline-variant/30">
        <Text className="text-on-surface-variant text-center text-sm">
          Ads require custom build: npx expo run:android
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-12 w-full bg-surface-container rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 min-h-[60px] justify-center items-center">
      {errorText && (
        <Text className="text-red-500 text-xs text-center font-bold absolute p-2 z-10">
          {errorText}
        </Text>
      )}
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          console.warn("Banner failed to load:", error);
          setErrorText(`Ad Error: ${error.message}`);
        }}
      />
    </View>
  );
}
