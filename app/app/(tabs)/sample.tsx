import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaperList } from "@/components/samples/PaperList";
import { Header } from "@/components/ui/Header";
import { useApi } from "@/hooks/useApi";
import { api, type ApiSamplePaper } from "@/lib/api";

const DIFFICULTY_FILTERS = ["All", "Easy", "Medium", "Hard"] as const;
type DiffFilter = (typeof DIFFICULTY_FILTERS)[number];

// Adapter: shape ApiSamplePaper into what PaperList expects
function adaptPaper(p: ApiSamplePaper) {
  return {
    id: p.paperId,
    title: p.title,
    subtitle: p.subtitle ?? "",
    difficulty: (p.difficulty ?? "Medium") as "Easy" | "Medium" | "Hard",
    duration: p.duration ?? "3 hrs",
    totalMarks: p.totalMarks ?? 70,
    sections: (p.sections ?? []).map((s) => ({
      sectionId: s.sectionId,
      title: s.title,
      marks: s.marks ?? 0,
      questions: (s.questions ?? []) as any[],
    })),
  };
}

export default function SampleScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DiffFilter>("All");

  const { data: papers, loading, error, refetch } = useApi(api.getSamplePapers);

  const adapted = useMemo(() => (papers ?? []).map(adaptPaper), [papers]);

  const handlePaperPress = (paperId: string) => {
    router.push(`/sample/${paperId}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="dark" />
      <Header showSearch={false} />

      <ScrollView contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="max-w-5xl self-center w-full px-4 md:px-6 pt-8 md:pt-12">

          {/* Title */}
          <View className="mb-8">
            <Text className="text-4xl font-black text-on-surface tracking-tighter">
              Sample Papers
            </Text>
            <Text className="text-on-surface-variant text-base mt-2">
              Practice with comprehensive Python assessments
            </Text>
          </View>

          {/* Stats Card */}
          <View className="bg-primary/5 p-6 rounded-[32px] border border-primary/10 mb-8">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 p-3 rounded-xl">
                <MaterialCommunityIcons
                  name="file-document-multiple"
                  size={24}
                  color="#005ab5"
                />
              </View>
              <View>
                <Text className="text-2xl font-black text-on-surface">
                  {loading ? "…" : adapted.length}
                </Text>
                <Text className="text-sm text-on-surface-variant">Total Papers</Text>
              </View>
            </View>
          </View>

          {/* Search */}
          <View className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 mb-4">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="magnify" size={20} color="#717785" />
              <TextInput
                className="flex-1 text-on-surface text-base"
                placeholder="Search papers..."
                placeholderTextColor="#717785"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <MaterialCommunityIcons name="close" size={20} color="#717785" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Difficulty Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-1 mb-6"
          >
            {DIFFICULTY_FILTERS.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setDifficultyFilter(filter)}
                className={`px-5 py-2.5 rounded-full border ${
                  difficultyFilter === filter
                    ? "bg-primary border-primary"
                    : "bg-surface-container-low border-outline-variant/20"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    difficultyFilter === filter ? "text-white" : "text-on-surface-variant"
                  }`}
                  style={difficultyFilter === filter ? { color: "#ffffff" } : {}}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Loading */}
          {loading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#005ab5" />
              <Text className="mt-4 text-on-surface-variant text-sm">Loading papers…</Text>
            </View>
          )}

          {/* Error */}
          {!loading && error && (
            <View className="items-center justify-center py-16 px-6">
              <MaterialCommunityIcons
                name={"cloud-off-outline" as any}
                size={56}
                color="#717785"
              />
              <Text className="text-lg font-bold text-on-surface mt-4 text-center">
                Could not load papers
              </Text>
              <Text className="text-on-surface-variant text-center mt-2 text-sm">{error}</Text>
              <Pressable
                onPress={refetch}
                className="mt-6 bg-primary px-8 py-3 rounded-2xl active:opacity-80"
              >
                <Text className="text-white font-bold">Retry</Text>
              </Pressable>
            </View>
          )}

          {/* Paper List */}
          {!loading && !error && (
            <>
              <PaperList
                papers={adapted}
                onPaperPress={handlePaperPress}
                searchQuery={searchQuery}
                difficultyFilter={difficultyFilter}
              />

              {/* Footer */}
              <View className="bg-surface-container-high p-6 rounded-[32px] border border-outline-variant/10 items-center mt-8">
                <MaterialCommunityIcons name="school-outline" size={32} color="#005ab5" />
                <Text className="text-xl font-bold text-on-surface mt-4">Practice Makes Perfect</Text>
                <Text className="text-on-surface-variant text-center mt-2">
                  Complete papers to track your progress and prepare for exams
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
