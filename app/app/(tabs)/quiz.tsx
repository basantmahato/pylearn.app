import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { useApi } from "@/hooks/useApi";
import { api, type ApiChapter, type ApiQuizSet } from "@/lib/api";
import { useCourseStore } from "@/lib/course-store";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#005ab5",
  medium: "#b35e00",
  hard: "#ba1a1a",
};

// Map chapterId → unit label
const UNIT_MAP: Record<string, string> = {
  "1": "Unit 1", "2": "Unit 1", "3": "Unit 1", "4": "Unit 1", "5": "Unit 1",
  "6": "Unit 2", "7": "Unit 2",
  "8": "Unit 3", "9": "Unit 3", "10": "Unit 3",
  "11": "Unit 4",
};

export default function QuizScreen() {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const { activeCategory } = useCourseStore();

  const { data: chapters, loading: loadingCh, error: errorCh, refetch: refetchCh } =
    useApi(() => api.getChapters(activeCategory), [activeCategory]);

  /** Fetch all quiz sets for the selected chapter on demand */
  const { data: sets, loading: loadingSets } = useApi(
    () =>
      selectedChapter
        ? api.getQuizzesByChapter(selectedChapter, activeCategory)
        : Promise.resolve([] as ApiQuizSet[]),
    [selectedChapter, activeCategory]
  );

  const handleSetPress = (chapterId: string, setId: string) => {
    router.push(`/quiz/${chapterId}_${setId}` as any);
  };

  // Group chapters into units
  const units = useMemo(() => {
    if (!chapters) return [];
    const sorted = [...chapters].sort((a, b) => a.order - b.order);
    const unitGroups: Record<string, { label: string; chapters: ApiChapter[] }> = {};

    if (activeCategory === "class12") {
      sorted.forEach((ch) => {
        const normId = ch.chapterId.replace(/^([a-z0-9]+-)?ch/, "");
        const label = UNIT_MAP[normId] ?? "Other";
        if (!unitGroups[label]) unitGroups[label] = { label, chapters: [] };
        unitGroups[label].chapters.push(ch);
      });
    } else {
      // For other categories, group all under "Modules"
      unitGroups["main"] = { label: "Course Modules", chapters: sorted };
    }

    return Object.entries(unitGroups).map(([key, val]) => ({ id: key, ...val }));
  }, [chapters, activeCategory]);

  const isError = !loadingCh && errorCh;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerClassName="pb-32 px-4 md:px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="mb-10">
          <Text className="text-4xl font-black text-on-surface tracking-tighter">Smart Quiz</Text>
          <Text className="text-on-surface-variant text-base mt-2">
            Select a chapter and test your Python mastery.
          </Text>
        </View>

        {/* Loading */}
        {loadingCh && (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#005ab5" />
            <Text className="mt-4 text-on-surface-variant text-sm">Loading quizzes…</Text>
          </View>
        )}

        {/* Error */}
        {isError && (
          <View className="items-center justify-center py-16 px-6">
            <MaterialCommunityIcons name={"cloud-off-outline" as any} size={56} color="#717785" />
            <Text className="text-lg font-bold text-on-surface mt-4 text-center">
              Could not load quizzes
            </Text>
            <Text className="text-on-surface-variant text-center mt-2 text-sm">{errorCh}</Text>
            <Pressable
              onPress={refetchCh}
              className="mt-6 bg-primary px-8 py-3 rounded-2xl active:opacity-80"
            >
              <Text className="text-white font-bold" style={{ color: '#ffffff' }}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Unit-based Quiz Hub */}
        {!loadingCh && !errorCh && (
          <>
            {units.map((unit) => (
              <View key={unit.id} className="mb-12">
                {/* Unit Divider */}
                <View className="flex-row items-center gap-3 mb-6">
                  <View className="h-0.5 flex-1 bg-outline-variant/20" />
                  <Text className="text-xs font-black text-outline uppercase tracking-[0.3em]">
                    {unit.label}
                  </Text>
                  <View className="h-0.5 w-8 bg-outline-variant/20" />
                </View>

                <View className="flex-row flex-wrap gap-4">
                  {unit.chapters.map((chapter) => {
                    const isOpen = selectedChapter === chapter.chapterId;
                    return (
                      <View
                        key={chapter.chapterId}
                        className="w-full md:w-[48%]"
                      >
                        <Pressable
                          onPress={() =>
                            setSelectedChapter(isOpen ? null : chapter.chapterId)
                          }
                          className="bg-surface-container-low p-5 rounded-[28px] border border-outline-variant/10 active:scale-[0.98]"
                        >
                          <View className="flex-row items-center justify-between mb-1">
                            <Text
                              className="text-base font-bold text-on-surface flex-1 mr-2"
                              numberOfLines={2}
                            >
                              {chapter.title}
                            </Text>
                            <MaterialCommunityIcons
                              name={isOpen ? "chevron-up" : "chevron-down"}
                              size={20}
                              color="#717785"
                            />
                          </View>
                          <Text className="text-xs text-on-surface-variant opacity-60">
                            Chapter {chapter.chapterId}
                          </Text>

                          {/* Expandable quiz sets */}
                          {isOpen && (
                            <View className="mt-5">
                              {loadingSets ? (
                                <ActivityIndicator size="small" color="#005ab5" />
                              ) : !sets || sets.length === 0 ? (
                                <Text className="text-xs text-on-surface-variant opacity-60 text-center py-4">
                                  No quiz sets available yet
                                </Text>
                              ) : (
                                <View className="flex-row flex-wrap gap-2">
                                  {sets.map((set) => {
                                    const diff = (set.difficulty ?? "medium").toLowerCase();
                                    const color = DIFFICULTY_COLORS[diff] ?? "#005ab5";
                                    return (
                                      <Pressable
                                        key={set._id}
                                        onPress={() =>
                                          handleSetPress(chapter.chapterId, set.setId)
                                        }
                                        className="py-3 px-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 active:opacity-80"
                                        style={{ minWidth: "45%" }}
                                      >
                                        <Text
                                          className="text-[10px] font-black uppercase tracking-widest text-center"
                                          style={{ color }}
                                        >
                                          {set.setName}
                                        </Text>
                                        <Text className="text-[10px] text-on-surface-variant text-center mt-0.5">
                                          {set.questions.length} Qs
                                        </Text>
                                      </Pressable>
                                    );
                                  })}
                                </View>
                              )}
                            </View>
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Daily Challenge CTA */}
            <View className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 items-center">
              <MaterialCommunityIcons name="trophy-outline" size={32} color="#005ab5" />
              <Text className="text-xl font-bold text-on-surface mt-4">Daily Challenge</Text>
              <Text className="text-on-surface-variant text-center mt-2">
                Complete one set from every unit to maintain your streak!
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
