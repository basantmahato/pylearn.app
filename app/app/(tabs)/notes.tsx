import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchHero } from "@/components/notes/SearchHero";
import { TopicDiscovery } from "@/components/notes/TopicDiscovery";
import { UnitSection } from "@/components/notes/UnitSection";
import { Header } from "@/components/ui/Header";
import { TOPICS } from "@/constants/chapters";
import { useApi } from "@/hooks/useApi";
import { api, type ApiChapter } from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Group backend chapters into display units matching the CBSE syllabus */
function buildUnits(chapters: ApiChapter[]) {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const unitMap: Record<string, { id: string; title: string; chapterIds: string[]; columns: 2 | 3 }> = {
    unit1: { id: "unit1", title: "Unit 1: Computational Thinking & Programming", chapterIds: ["1","2","3","4","5"], columns: 2 },
    unit2: { id: "unit2", title: "Unit 2: Computer Networks", chapterIds: ["6","7"], columns: 2 },
    unit3: { id: "unit3", title: "Unit 3: Database Management", chapterIds: ["8","9","10"], columns: 3 },
    unit4: { id: "unit4", title: "Unit 4: Boolean Logic", chapterIds: ["11"], columns: 2 },
  };

  return Object.values(unitMap).map((unit) => ({
    id: unit.id,
    title: unit.title,
    columns: unit.columns,
    chapters: sorted
      .filter((ch) => unit.chapterIds.includes(ch.chapterId))
      .map((ch) => ({
        id: ch.chapterId,
        title: ch.title,
        icon: "menu-book" as const,
      })),
  })).filter((u) => u.chapters.length > 0);
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const { data: chapters, loading, error, refetch } = useApi(api.getChapters);

  const units = useMemo(() => buildUnits(chapters ?? []), [chapters]);

  const activeTopicKeywords = useMemo(() => {
    if (!activeTopic) return [];
    return TOPICS.find((t) => t.label === activeTopic)?.keywords || [];
  }, [activeTopic]);

  const filteredUnits = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const hasSearch = query.length > 0;
    const hasTopic = activeTopicKeywords.length > 0;

    if (!hasSearch && !hasTopic) return units;

    return units
      .map((unit) => {
        const unitMatchesSearch = hasSearch && unit.title.toLowerCase().includes(query);

        const matchingChapters = unit.chapters.filter((ch) => {
          const t = ch.title.toLowerCase();
          const matchesSearch = !hasSearch || t.includes(query);
          const matchesTopic =
            !hasTopic || activeTopicKeywords.some((kw) => t.includes(kw.toLowerCase()));
          return matchesSearch && matchesTopic;
        });

        const chaptersToShow =
          unitMatchesSearch && !hasTopic ? unit.chapters : matchingChapters;

        return { ...unit, chapters: chaptersToShow };
      })
      .filter((u) => u.chapters.length > 0);
  }, [units, searchQuery, activeTopicKeywords]);

  const handleTopicPress = useCallback(
    (label: string) => {
      if (activeTopic === label) {
        setActiveTopic(null);
        setSearchQuery("");
      } else {
        setActiveTopic(label);
        setSearchQuery(label);
      }
    },
    [activeTopic]
  );

  const clearFilters = () => {
    setActiveTopic(null);
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="dark" />
      <Header showSearch={false} />

      <ScrollView contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="max-w-5xl self-center w-full px-4 md:px-6 pt-8 md:pt-12">

          <SearchHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* ── Loading ── */}
          {loading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#005ab5" />
              <Text className="mt-4 text-on-surface-variant text-sm">Loading chapters…</Text>
            </View>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <View className="items-center justify-center py-16 px-6">
              <MaterialCommunityIcons name={"cloud-off-outline" as any} size={56} color="#717785" />
              <Text className="text-lg font-bold text-on-surface mt-4 text-center">
                Could not load chapters
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

          {/* ── Content ── */}
          {!loading && !error && (
            <>
              <View className="gap-y-12 md:gap-y-20">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <UnitSection
                      key={unit.id}
                      id={unit.id}
                      title={unit.title}
                      chapters={unit.chapters}
                      columns={unit.columns}
                    />
                  ))
                ) : (
                  <View className="items-center justify-center py-20 opacity-40">
                    <MaterialCommunityIcons name={"text-search" as any} size={64} color="#717785" />
                    <Text className="text-xl font-bold mt-4 text-on-surface">No results found</Text>
                    <Text className="text-on-surface-variant text-center mt-2 px-8">
                      Try searching for another syllabus chapter or concept.
                    </Text>
                  </View>
                )}
              </View>

              <TopicDiscovery onTopicPress={handleTopicPress} activeTopic={activeTopic} />

              {activeTopic && (
                <View className="flex-row items-center gap-2 mb-4">
                  <Text className="text-sm text-on-surface-variant">
                    Filtering by:{" "}
                    <Text className="font-bold text-primary">{activeTopic}</Text>
                  </Text>
                  <Pressable onPress={clearFilters} className="p-1">
                    <MaterialCommunityIcons name="close-circle" size={18} color="#717785" />
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
