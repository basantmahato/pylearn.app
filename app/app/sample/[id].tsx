import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { CodeQuestion } from "@/components/samples/CodeQuestion";
import { ErrorQuestion } from "@/components/samples/ErrorQuestion";
import { MCQQuestion } from "@/components/samples/MCQQuestion";
import { SectionAccordion } from "@/components/samples/SectionAccordion";
import { ShortAnswerQuestion } from "@/components/samples/ShortAnswerQuestion";
import { useApi } from "@/hooks/useApi";
import { api, apiClient, type ApiSampleSection } from "@/lib/api";
import { useCourseStore } from "@/lib/course-store";
import { AdBanner } from "@/components/home/AdBanner";
import { getActiveAdUnitId, RemoteAdConfig } from "@/lib/ads-config";

// Only import if native module is available
let InterstitialAd: any;
let AdEventType: any;

try {
  const ads = require("react-native-google-mobile-ads");
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
} catch {
  // Not available in non-native environments
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Easy:   { bg: "#e8f5e9", text: "#2e7d32" },
  Medium: { bg: "#fff3e0", text: "#ef6c00" },
  Hard:   { bg: "#ffebee", text: "#c62828" },
};

export default function PaperDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const paperId = id as string;
  const { activeCategory } = useCourseStore();

  const { data: paper, loading, error } = useApi(
    () => api.getSamplePaperById(paperId, activeCategory),
    [paperId, activeCategory]
  );

  const [expandedSection, setExpandedSection] = useState<string | null>("A");
  const [showingAnswers, setShowingAnswers] = useState<Set<string>>(new Set());

  // ── Ads Integration state & triggers ──────────────────────────────────────
  const [adShown, setAdShown] = useState(false);
  const [adLoadingState, setAdLoadingState] = useState(false);

  // Fetch the configuration
  const { data: adsConfig } = useApi<RemoteAdConfig | null>(
    () => apiClient.get("/ads/config").then((res) => res.data).catch(() => null),
    []
  );

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
            unsubscribeLoaded();
            unsubscribeClosed();
          }
        );

        const unsubscribeError = interstitial.addAdEventListener(
          AdEventType.ERROR,
          (error: any) => {
            console.warn("Interstitial Ad error:", error);
            setAdLoadingState(false);
            setAdShown(true);
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
          }
        );

        interstitial.load();

        return () => {
          unsubscribeLoaded();
          unsubscribeClosed();
          unsubscribeError();
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

  const toggleSection = (sectionId: string) =>
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));

  const toggleAnswer = (questionId: string) =>
    setShowingAnswers((prev) => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });

  // ── Pre-Study Loading Screen while Interstitial Ad is Loading ───────────────
  if (adLoadingState) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <StatusBar style="dark" />
        <View className="items-center gap-6">
          <View className="p-4 bg-primary/10 rounded-full animate-bounce">
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#005ab5" />
          </View>
          <View className="items-center gap-2">
            <Text className="text-2xl font-black text-on-surface tracking-tight">Preparing Sample Paper</Text>
            <Text className="text-on-surface-variant text-center max-w-xs text-sm">
              Please wait a moment while we load your test questions...
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
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#005ab5" />
        <Text className="mt-4 text-on-surface-variant">Loading paper…</Text>
      </SafeAreaView>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────────
  if (error || !paper) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-10">
        <StatusBar style="dark" />
        <MaterialCommunityIcons name="file-search-outline" size={64} color="#717785" />
        <Text className="text-xl font-bold text-on-surface mt-4 text-center">
          Paper Not Found
        </Text>
        <Text className="text-on-surface-variant text-center mt-2 mb-8 text-sm">
          {error ?? "This paper doesn't exist or hasn't been seeded yet."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── Question Renderer ─────────────────────────────────────────────────────
  const renderQuestions = (section: ApiSampleSection) =>
    (section.questions ?? []).map((q, index) => {
      const sid = section.sectionId;
      if (sid === "A") {
        return (
          <MCQQuestion
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options ?? []}
            answer={q.answer as number}
            index={index}
            showAnswer={showingAnswers.has(q.id)}
          />
        );
      }
      if (sid === "B") {
        return (
          <ShortAnswerQuestion
            key={q.id}
            id={q.id}
            question={q.question}
            marks={q.marks ?? 2}
            keywords={q.keywords ?? []}
            index={index}
            showAnswer={showingAnswers.has(q.id)}
            onToggleAnswer={() => toggleAnswer(q.id)}
          />
        );
      }
      if (sid === "C") {
        return (
          <CodeQuestion
            key={q.id}
            id={q.id}
            question={q.question}
            marks={q.marks ?? 4}
            hints={q.hints ?? []}
            index={index}
            showHints={showingAnswers.has(q.id)}
            onToggleHints={() => toggleAnswer(q.id)}
          />
        );
      }
      if (sid === "D") {
        return (
          <ErrorQuestion
            key={q.id}
            id={q.id}
            question={q.question}
            marks={q.marks ?? 3}
            answer={String(q.answer ?? "")}
            explanation={q.explanation ?? ""}
            index={index}
            showSolution={showingAnswers.has(q.id)}
            onToggleSolution={() => toggleAnswer(q.id)}
          />
        );
      }
      // Generic fallback for any other section
      return (
        <View key={q.id} className="bg-surface-container-low rounded-2xl p-5 mb-3 border border-outline-variant/10">
          <Text className="font-bold text-on-surface mb-1">
            Q{index + 1}. {q.question}
            {q.marks ? (
              <Text className="font-normal text-on-surface-variant text-sm"> [{q.marks}M]</Text>
            ) : null}
          </Text>
        </View>
      );
    });

  // ── Render ────────────────────────────────────────────────────────────────
  const diffColors = DIFFICULTY_COLORS[paper.difficulty ?? "Medium"] ?? DIFFICULTY_COLORS.Medium;

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
            {paper.paperId} • PyLearn Sample
          </Text>
          <Text className="text-base font-bold text-on-surface" numberOfLines={1}>
            {paper.title}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>

        {/* Paper Info Card */}
        <View className="px-4 md:px-6 py-4">
          <View className="bg-primary/5 p-6 rounded-[32px] border border-primary/10">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="bg-primary/10 p-2 rounded-xl">
                <MaterialCommunityIcons name="file-document-outline" size={24} color="#005ab5" />
              </View>
              <Text className="text-xs font-black text-primary uppercase tracking-[0.3em] flex-1">
                Sample Paper
              </Text>
              {paper.difficulty && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: diffColors.bg }}
                >
                  <Text className="text-xs font-bold" style={{ color: diffColors.text }}>
                    {paper.difficulty}
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-2xl font-black text-on-surface tracking-tighter mb-2">
              {paper.title}
            </Text>
            {paper.subtitle && (
              <Text className="text-on-surface-variant text-base mb-4">{paper.subtitle}</Text>
            )}

            <View className="flex-row flex-wrap gap-6">
              {paper.duration && (
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#717785" />
                  <Text className="text-on-surface-variant">{paper.duration}</Text>
                </View>
              )}
              {paper.totalMarks && (
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="trophy-outline" size={18} color="#717785" />
                  <Text className="text-on-surface-variant">{paper.totalMarks} Marks</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View className="px-4 md:px-6 mb-6">
          <View className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
            <Text className="text-on-surface font-bold mb-3">Instructions:</Text>
            <View className="gap-2">
              {[
                "All questions are compulsory",
                "Section A: Choose the correct option",
                "Section B: Write short answers",
                "Section C: Write complete Python programs",
                "Section D: Find errors and predict outputs",
              ].map((line, i) => (
                <Text key={i} className="text-on-surface-variant text-sm">
                  • {line}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Sections */}
        <View className="px-4 md:px-6">
          {(paper.sections ?? []).map((section) => (
            <SectionAccordion
              key={section.sectionId}
              sectionId={section.sectionId}
              title={section.title}
              marks={section.marks ?? 0}
              questionCount={(section.questions ?? []).length}
              isExpanded={expandedSection === section.sectionId}
              onToggle={() => toggleSection(section.sectionId)}
            >
              {renderQuestions(section)}
            </SectionAccordion>
          ))}
        </View>

        {/* Ad Placement */}
        <View className="px-4 md:px-6">
          <AdBanner />
        </View>

        {/* Footer */}
        <View
          className="mx-4 md:mx-6 bg-surface-container-high p-6 rounded-[32px] border border-outline-variant/10 items-center mt-8"
          style={{ marginBottom: insets.bottom + 20 }}
        >
          <MaterialCommunityIcons name="school-outline" size={32} color="#005ab5" />
          <Text className="text-xl font-bold text-on-surface mt-4">Practice Makes Perfect</Text>
          <Text className="text-on-surface-variant text-center mt-2">
            Review all sections and practice writing code by hand to prepare for your exam.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
