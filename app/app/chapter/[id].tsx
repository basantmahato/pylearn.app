import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getActiveAdUnitId, RemoteAdConfig } from "@/lib/ads-config";
import { apiClient } from "@/lib/api";

// Only import if native module is available
import { Platform } from "react-native";
let InterstitialAd: any = null;
let AdEventType: any = null;

if (Platform.OS !== "web") {
  try {
    const ads = require("react-native-google-mobile-ads");
    InterstitialAd = ads.InterstitialAd;
    AdEventType = ads.AdEventType;
  } catch {
    // Native module unavailable
  }
} else {
  // Fallback stubs for web
  InterstitialAd = null;
  AdEventType = null;
}

import { CodeBlock, ListBlock, ParagraphBlock } from "@/components/chapter/ContentBlocks";
import { PracticeSection } from "@/components/chapter/PracticeSection";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { useProgressStore } from "@/lib/progress-store";
import { useCourseStore } from "@/lib/course-store";
import { AdBanner } from "@/components/home/AdBanner";

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [adShown, setAdShown] = useState(false);
  const [adLoadingState, setAdLoadingState] = useState(false);

  // Fetch the configuration
  const { data: adsConfig } = useApi<RemoteAdConfig | null>(
    () => apiClient.get("/ads/config").then((res) => res.data).catch(() => null),
    []
  );

  const chapterId = id as string;

  useEffect(() => {
    // If config loaded and ads are enabled, and we have the native class, load it
    if (adsConfig && adsConfig.adsEnabled && !adShown && InterstitialAd) {
      setAdLoadingState(true);
      const adUnitId = getActiveAdUnitId("interstitialId", adsConfig, !__DEV__);

      try {
        const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        const unsubscribeLoaded = interstitial.addAdEventListener(
          AdEventType.LOADED,
          () => {
            setAdLoadingState(false);
            interstitial.show().catch((e: any) => {
              console.warn("Failed to trigger interstitial.show():", e);
              setAdShown(true);
            });
          }
        );

        const unsubscribeClosed = interstitial.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            setAdShown(true);
          }
        );

        const unsubscribeError = interstitial.addAdEventListener(
          AdEventType.ERROR,
          (error: any) => {
            console.warn("Interstitial Ad error:", error);
            setAdLoadingState(false);
            setAdShown(true);
          }
        );

        interstitial.load();

        return () => {
          try {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
          } catch (e) {
            // Ignore cleanup errors
          }
        };
      } catch (err) {
        console.warn("Failed to setup interstitial ad:", err);
        setAdLoadingState(false);
        setAdShown(true);
      }
    } else if (adsConfig) {
      // If config is loaded but ads are disabled, instantly show content
      setAdShown(true);
    }
  }, [adsConfig]);
  const {
    updateChapterProgress,
    markChapterComplete,
    checkIn,
    getChapterProgress,
    toggleBookmark,
    isBookmarked,
  } = useProgressStore();
  const { activeCategory } = useCourseStore();
  const progress = getChapterProgress(chapterId, activeCategory);
  const bookmarked = isBookmarked(chapterId, activeCategory);

  // ── Fetch chapter meta + notes in parallel ────────────────────────────────

  const { data: chapters, loading: loadingCh } = useApi(
    () => api.getChapters(activeCategory),
    [activeCategory]
  );
  const { data: noteBlocks, loading: loadingNotes, error } = useApi(
    () => api.getNotesByChapter(chapterId, activeCategory),
    [chapterId, activeCategory]
  );

  const chapterMeta = useMemo(
    () => chapters?.find((ch) => ch.chapterId === chapterId) ?? null,
    [chapters, chapterId]
  );

  const loading = loadingCh || loadingNotes;

  // Sorted note blocks
  const content = useMemo(
    () => [...(noteBlocks ?? [])].sort((a, b) => a.order - b.order),
    [noteBlocks]
  );

  // ── Scroll Progress ───────────────────────────────────────────────────────

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const height = event.nativeEvent.contentSize.height;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;
      if (height > 0) {
        const scrollProgress = Math.min(
          100,
          Math.round((y / (height - layoutHeight)) * 100)
        );
        const newProgress = Math.max(progress, scrollProgress);
        if (newProgress > progress) updateChapterProgress(chapterId, newProgress, activeCategory);
        if (scrollProgress >= 90) {
          markChapterComplete(chapterId, activeCategory);
          checkIn();
        }
      }
    },
    [chapterId, progress, updateChapterProgress, markChapterComplete, checkIn]
  );

  // ── Pre-Study Loading Screen while Interstitial Ad is Loading ───────────────
  if (adLoadingState) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <StatusBar style="dark" />
        <View className="items-center gap-6">
          <View className="p-4 bg-primary/10 rounded-full animate-bounce">
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color="#005ab5" />
          </View>
          <View className="items-center gap-2">
            <Text className="text-2xl font-black text-on-surface tracking-tight">Preparing Study Notes</Text>
            <Text className="text-on-surface-variant text-center max-w-xs text-sm">
              Please wait a moment while we load your learning modules...
            </Text>
          </View>
          <ActivityIndicator size="large" color="#005ab5" className="mt-4" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading || !adShown) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#005ab5" />
        <Text className="mt-4 text-on-surface-variant">Loading chapter…</Text>
      </SafeAreaView>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────────

  if (error || !chapterMeta) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-10">
        <MaterialCommunityIcons
          name={"alert-circle-outline" as any}
          size={64}
          color="#717785"
        />
        <Text className="text-xl font-bold text-on-surface mt-6 text-center">
          Chapter Content Not Found
        </Text>
        <Text className="text-on-surface-variant text-center mt-2 mb-8">
          {error ?? "The requested module is currently unavailable."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-8 py-3 rounded-2xl shadow-md active:scale-95"
        >
          <Text className="text-white font-bold text-base">Return to Dashboard</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <StatusBar style="dark" />

      {/* Navigation Header */}
      <View
        className="px-4 md:px-6 pb-4 flex-row items-center border-b border-outline-variant/10 bg-background/95 z-50 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-full bg-surface-container active:scale-90"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1d1e20" />
        </Pressable>
        <View className="ml-4 flex-1">
          <Text
            className="text-sm font-bold text-outline-fixed uppercase tracking-[0.2em]"
            numberOfLines={1}
          >
            CH{chapterMeta.order} • PyLearn Revision
          </Text>
          <Text className="text-base font-bold text-on-surface" numberOfLines={1}>
            {chapterMeta.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => toggleBookmark(chapterId, activeCategory)}
            className="w-10 h-10 rounded-full bg-surface-container items-center justify-center active:scale-90"
          >
            <MaterialCommunityIcons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={bookmarked ? "#005ab5" : "#717785"}
            />
          </Pressable>
          <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
            <MaterialCommunityIcons name="chart-line" size={16} color="#005ab5" />
            <Text className="ml-1.5 text-sm font-bold text-primary">{progress}%</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerClassName="pt-12 pb-32 max-w-4xl self-center w-full px-4 md:px-6"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={500}
      >
        {/* Chapter Hero */}
        <View className="mb-16">
          <View className="bg-primary/10 px-4 py-2 rounded-xl mb-6 self-start">
            <Text className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
              Module {chapterMeta.order}
            </Text>
          </View>
          <Text className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-[1.05]">
            {chapterMeta.title}
          </Text>
          {chapterMeta.summary?.short_summary && (
            <Text className="text-on-surface-variant mt-4 text-base leading-7">
              {chapterMeta.summary.short_summary}
            </Text>
          )}
          <View className="h-1.5 w-24 bg-primary-container rounded-full mt-8" />
        </View>

        {/* Content Blocks */}
        <View>
          {content.length === 0 ? (
            <View className="items-center py-16 opacity-50">
              <MaterialCommunityIcons name={"text-box-outline" as any} size={48} color="#717785" />
              <Text className="mt-4 text-on-surface-variant text-center">
                No notes available for this chapter yet.
              </Text>
            </View>
          ) : (
            content.map((block) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <ParagraphBlock
                      key={block._id}
                      heading={block.heading}
                      text={block.text ?? ""}
                    />
                  );
                case "bullet_list":
                  return (
                    <ListBlock
                      key={block._id}
                      heading={block.heading}
                      items={block.items ?? []}
                    />
                  );
                case "code":
                  return (
                    <CodeBlock
                      key={block._id}
                      heading={block.heading}
                      code={block.code ?? ""}
                      language={block.language ?? "python"}
                    />
                  );
                default:
                  return null;
              }
            })
          )}
        </View>

        {/* Dynamic banner ad placed between notes reading content and practice tests */}
        <AdBanner />

        {/* Practice Section */}
        {chapterMeta.practice && chapterMeta.practice.length > 0 && (
          <PracticeSection practice={chapterMeta.practice} />
        )}

        {/* Flash Summary */}
        {chapterMeta.summary?.detailed_summary && (
          <View className="bg-surface-container-low rounded-[40px] p-10 border border-outline-variant/20 shadow-inner mt-8">
            <View className="flex-row items-center gap-3 mb-6">
              <MaterialCommunityIcons name="notebook-outline" size={28} color="#005ab5" />
              <Text className="text-2xl font-black text-on-surface tracking-tight uppercase">
                Flash Summary
              </Text>
            </View>
            <Text className="text-lg leading-7 text-on-surface-variant font-medium text-justify">
              {chapterMeta.summary.detailed_summary}
            </Text>

            {chapterMeta.summary.exam_focus && chapterMeta.summary.exam_focus.length > 0 && (
              <View className="mt-10 border-t border-outline-variant/10 pt-8">
                <Text className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">
                  Core Exam Focus
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {chapterMeta.summary.exam_focus.map((item, idx) => (
                    <View key={idx} className="bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                      <Text className="text-primary font-bold text-xs">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
