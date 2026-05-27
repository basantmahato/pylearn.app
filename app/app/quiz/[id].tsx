import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useApi } from "@/hooks/useApi";
import { api, type ApiQuizSet } from "@/lib/api";
import { QuizResult, useProgressStore } from "@/lib/progress-store";
import { useCourseStore } from "@/lib/course-store";
import { getActiveAdUnitId, RemoteAdConfig } from "@/lib/ads-config";
import { apiClient } from "@/lib/api";

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

export default function QuizPlayerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { saveQuizResult, getBestQuizScore } = useProgressStore();

  // Parse ID: "chapterId_setId" e.g. "1_s1"
  const [chapterId, setId] = (id as string).split("_");

  // ── Fetch quiz set from backend ───────────────────────────────────────────
  const { activeCategory } = useCourseStore();
  const { data: quizSet, loading, error } = useApi<ApiQuizSet | null>(
    () => api.getQuizSet(chapterId, setId, activeCategory),
    [chapterId, setId, activeCategory]
  );

  const priorBestScore = getBestQuizScore(chapterId, setId, activeCategory);

  // ── Quiz state ────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  // ── Ads Integration state & triggers ──────────────────────────────────────
  const [adLoaded, setAdLoaded] = useState(false);
  const interstitialRef = useRef<any>(null);

  const { data: adsConfig } = useApi<RemoteAdConfig | null>(
    () => apiClient.get("/ads/config").then((res) => res.data).catch(() => null),
    []
  );

  useEffect(() => {
    if (adsConfig && adsConfig.adsEnabled && InterstitialAd) {
      const adUnitId = getActiveAdUnitId("interstitialId", adsConfig, !__DEV__);
      try {
        const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        const unsubscribeLoaded = interstitial.addAdEventListener(
          AdEventType.LOADED,
          () => {
            setAdLoaded(true);
          }
        );

        const unsubscribeError = interstitial.addAdEventListener(
          AdEventType.ERROR,
          (err: any) => {
            console.warn("Quiz Interstitial Ad failed to load:", err);
            setAdLoaded(false);
          }
        );

        interstitial.load();
        interstitialRef.current = interstitial;

        return () => {
          unsubscribeLoaded();
          unsubscribeError();
        };
      } catch (err) {
        console.warn("Failed to create interstitial ad for quiz:", err);
      }
    }
  }, [adsConfig]);

  const showAdAndResults = (result: QuizResult) => {
    saveQuizResult(result, activeCategory);
    setFinalResult(result);

    const interstitial = interstitialRef.current;
    if (adsConfig?.adsEnabled && adLoaded && interstitial) {
      try {
        const unsubscribeClosed = interstitial.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            setShowResults(true);
            unsubscribeClosed();
          }
        );

        interstitial.show().catch((e: any) => {
          console.warn("Failed to show interstitial on quiz submission:", e);
          setShowResults(true);
        });
      } catch (err) {
        console.warn("Failed during quiz interstitial show:", err);
        setShowResults(true);
      }
    } else {
      setShowResults(true);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#005ab5" />
        <Text className="mt-4 text-on-surface-variant">Loading quiz…</Text>
      </SafeAreaView>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────────
  if (error || !quizSet) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <MaterialCommunityIcons
          name={"alert-circle-outline" as any}
          size={56}
          color="#717785"
        />
        <Text className="text-xl font-bold text-on-surface mt-4 text-center">
          Quiz Not Found
        </Text>
        <Text className="text-on-surface-variant text-center mt-2 text-sm">
          {error ?? "This quiz set doesn't exist or hasn't been added yet."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-primary px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const questions = quizSet.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progressPct = ((currentIndex + 1) / totalQuestions) * 100;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOptionPress = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    if (selectedOption === currentQuestion.answer) setScore((s) => s + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore = score + (selectedOption === currentQuestion.answer ? 1 : 0);
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      const passed = percentage >= 70;
      const result: QuizResult = {
        chapterId,
        setId,
        score: finalScore,
        total: totalQuestions,
        percentage,
        date: new Date().toISOString(),
        passed,
      };
      showAdAndResults(result);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setFinalResult(null);

    // Reload ad for next attempt
    setAdLoaded(false);
    if (interstitialRef.current) {
      try {
        interstitialRef.current.load();
      } catch (err) {
        console.warn("Failed to reload interstitial ad:", err);
      }
    }
  };

  // ── Results Screen ────────────────────────────────────────────────────────
  if (showResults && finalResult) {
    const { percentage, passed } = finalResult;
    const displayedBestScore = Math.max(priorBestScore ?? 0, percentage);

    return (
      <SafeAreaView className="flex-1 bg-background p-6 items-center justify-center">
        <StatusBar style="dark" />
        <Animated.View entering={FadeInDown.duration(600)} className="items-center w-full max-w-md self-center">
          <View
            className={`w-32 h-32 rounded-full items-center justify-center mb-8 ${
              passed ? "bg-primary/10" : "bg-error/10"
            }`}
          >
            <MaterialCommunityIcons
              name={passed ? "trophy" : "alert-circle"}
              size={64}
              color={passed ? "#005ab5" : "#ba1a1a"}
            />
          </View>

          <Text className="text-4xl font-black text-on-surface tracking-tighter text-center">
            {passed ? "Great Job!" : "Keep Learning"}
          </Text>

          <View className="bg-surface-container-low rounded-xl px-4 py-2 mt-4">
            <Text className="text-sm text-on-surface-variant text-center">
              Best Score: {displayedBestScore}%
            </Text>
          </View>

          <View className="bg-surface-container-low w-full rounded-3xl p-8 mt-8 border border-outline-variant/10">
            <View className="flex-row justify-between mb-4">
              <Text className="text-on-surface-variant font-medium">Score</Text>
              <Text className="text-on-surface font-bold">
                {finalResult.score} / {finalResult.total}
              </Text>
            </View>
            <View className="flex-row justify-between mb-6">
              <Text className="text-on-surface-variant font-medium">Accuracy</Text>
              <Text className="text-on-surface font-bold">{percentage}%</Text>
            </View>
            <View className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <View
                className={`h-full rounded-full ${passed ? "bg-primary" : "bg-error"}`}
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mt-12 w-full">
            <Pressable
              onPress={handleRetry}
              className="flex-1 bg-surface-container-high py-5 rounded-2xl border border-outline-variant/20 active:opacity-80"
            >
              <Text className="text-on-surface font-bold text-center">Retry</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/(tabs)/quiz")}
              className="flex-1 bg-primary py-5 rounded-2xl active:opacity-80 shadow-sm"
            >
              <Text className="text-white font-bold text-center" style={{ color: "#ffffff" }}>
                Finish
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Quiz Player ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header & Progress */}
      <View className="px-4 md:px-6 py-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialCommunityIcons name="close" size={24} color="#111c2d" />
        </Pressable>
        <View className="flex-1 h-2 bg-surface-container-highest mx-4 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </View>
        <Text className="text-xs font-bold text-on-surface-variant w-12 text-right">
          {currentIndex + 1}/{totalQuestions}
        </Text>
      </View>

      {/* Set name badge */}
      <View className="px-4 md:px-6 mb-2">
        <Text className="text-xs font-black text-primary uppercase tracking-widest">
          {quizSet.setName}
          {quizSet.difficulty ? ` · ${quizSet.difficulty}` : ""}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-4 md:px-6 py-8 flex-grow max-w-2xl self-center w-full">
        <Animated.View key={currentIndex} entering={FadeIn.duration(400)}>
          {/* Question */}
          <Text className="text-2xl font-bold text-on-surface leading-8 mb-10">
            {currentQuestion.question}
          </Text>

          {/* Options */}
          <View className="gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = isAnswered && index === currentQuestion.answer;
              const isWrong =
                isAnswered && isSelected && index !== currentQuestion.answer;

              return (
                <Pressable
                  key={index}
                  onPress={() => handleOptionPress(index)}
                  disabled={isAnswered}
                  className={`p-5 rounded-2xl border-2 min-h-[72px] justify-center
                    ${isSelected ? "border-primary bg-primary/5" : "border-outline-variant/20 bg-surface-container-low"}
                    ${isCorrect ? "border-primary bg-primary/10" : ""}
                    ${isWrong ? "border-error bg-error/5" : ""}
                  `}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mr-4 border
                        ${isSelected ? "bg-primary border-primary" : "border-outline-variant/40"}
                        ${isCorrect ? "bg-primary border-primary" : ""}
                        ${isWrong ? "bg-error border-error" : ""}
                      `}
                    >
                      {isAnswered && (isCorrect || isWrong) ? (
                        <MaterialCommunityIcons
                          name={isCorrect ? "check" : "close"}
                          size={16}
                          color="white"
                        />
                      ) : (
                        <Text
                          className={`text-sm font-bold ${
                            isSelected ? "text-white" : "text-on-surface-variant"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </Text>
                      )}
                    </View>
                    <Text className="text-base flex-1 text-on-surface">{option}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Explanation */}
          {isAnswered && currentQuestion.explanation && (
            <Animated.View
              entering={FadeInDown.duration(400)}
              className="mt-8 p-6 rounded-2xl bg-surface-container-high border-l-4 border-primary"
            >
              <Text className="text-xs font-black text-primary uppercase tracking-widest mb-1">
                Insight
              </Text>
              <Text className="text-on-surface-variant leading-5">
                {currentQuestion.explanation}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Action Footer */}
      <View
        className="px-4 md:px-6 pt-4 border-t border-outline-variant/10"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {!isAnswered ? (
          <Pressable
            disabled={selectedOption === null}
            onPress={handleCheck}
            className={`w-full py-5 rounded-2xl items-center justify-center shadow-sm ${
              selectedOption === null
                ? "bg-surface-container-highest opacity-50"
                : "bg-primary"
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                selectedOption === null ? "text-on-surface-variant" : "text-white"
              }`}
              style={selectedOption === null ? {} : { color: "#ffffff" }}
            >
              Check Answer
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleNext}
            className="w-full py-5 rounded-2xl bg-inverse-surface items-center justify-center shadow-lg"
          >
            <Text className="text-white font-black text-lg" style={{ color: "#ffffff" }}>
              {currentIndex < totalQuestions - 1 ? "Next Question" : "View Results"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
