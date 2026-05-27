import React from "react";
import { Text, View } from "react-native";
import { useApi } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";
import { getActiveAdUnitId, RemoteAdConfig } from "@/lib/ads-config";

// Only import if native module is available (requires custom dev build)
let BannerAd: any;
let BannerAdSize: any;

try {
  const ads = require("react-native-google-mobile-ads");
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
} catch {
  // Module not available in Expo Go
}

export function AdBanner() {
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
    <View className="mt-12 w-full bg-surface-container rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30">
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}
