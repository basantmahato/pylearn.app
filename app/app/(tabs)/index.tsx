import { StatusBar } from "expo-status-bar";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { BentoCard } from "@/components/home/BentoCard";
import { CourseSelector } from "@/components/home/CourseSelector";
import { Greeting } from "@/components/home/Greeting";
import { ProgressHero } from "@/components/home/ProgressHero";
import { BENTO_CARDS } from "@/constants/home";
import { useProgressStore } from "@/lib/progress-store";
import { useCourseStore } from "@/lib/course-store";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";


function DynamicBentoCard({ card }: { card: typeof BENTO_CARDS[0] }) {
  const { activeCategory } = useCourseStore();
  // Fetch live counts for accurate percentages
  const { data: chapters } = useApi(() => api.getChapters(activeCategory), [activeCategory]);
  const { data: papers } = useApi(() => api.getSamplePapers(activeCategory), [activeCategory]);
  
  const totalCh = chapters?.length || 11;
  const totalPap = papers?.length || 20;

  const overallProgress = useProgressStore((s) => s.getOverallProgress(activeCategory, totalCh));
  const averageQuizScore = useProgressStore((s) => s.getAverageQuizScore(activeCategory));
  const totalQuizzesTaken = useProgressStore((s) => s.getTotalQuizzesTaken(activeCategory));
  const samplePapersProgress = useProgressStore((s) => s.getSamplePapersProgress(activeCategory));
  const overallAppProgress = useProgressStore((s) => s.getOverallAppProgress(activeCategory, totalCh, totalPap));

  let progress = card.progress;
  let tag = card.tag;

  if (card.title === "Notes") {
    progress = overallProgress;
    tag = `${progress}% Read`;
  } else if (card.title === "Quiz") {
    progress = totalQuizzesTaken > 0 ? averageQuizScore : 0;
    tag = `${progress}% Score`;
  } else if (card.title === "Sample Papers") {
    progress = samplePapersProgress;
    tag = `${progress}% Done`;
  } else if (card.title === "Profile") {
    progress = overallAppProgress;
    tag = `${progress}% Done`;
  }

  return <BentoCard {...card} progress={progress} tag={tag} />;
}

export default function HomeScreen() {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit PyLearn?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Yes", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerClassName="pb-32 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Course Selection */}
        <CourseSelector />

        {/* Greeting & Streak */}
        <Greeting />

        {/* Hero Progress Section */}
        <ProgressHero />



        {/* Action Bento Grid */}
        <View className="flex-row flex-wrap gap-4">
          {BENTO_CARDS.map((card, index) => (
            <DynamicBentoCard key={index} card={card} />
          ))}
        </View>

        {/* Extra padding at bottom */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
