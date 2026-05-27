import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { SearchHero } from "@/components/notes/SearchHero";
import { UnitSection } from "@/components/notes/UnitSection";
import { useApi } from "@/hooks/useApi";
import { api, type ApiChapter } from "@/lib/api";
import { useCourseStore } from "@/lib/course-store";
import { Category } from "@/constants/courses";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Group backend chapters into display units matching the syllabus */
function buildUnits(chapters: ApiChapter[], category: Category) {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  // If Class 12, use the detailed unit map
  if (category === "class12") {
    const unitMap: Record<string, { id: string; title: string; chapterIds: string[]; columns: 2 | 3 }> = {
      unit1: { id: "unit1", title: "Unit 1: Programming with Python", chapterIds: ["1","2","3","4","5"], columns: 2 },
      unit2: { id: "unit2", title: "Unit 2: Computer Networks", chapterIds: ["6","7"], columns: 2 },
      unit3: { id: "unit3", title: "Unit 3: Database Management", chapterIds: ["8","9","10"], columns: 3 },
      unit4: { id: "unit4", title: "Unit 4: Boolean Logic", chapterIds: ["11"], columns: 2 },
    };

    return Object.values(unitMap).map((unit) => ({
      id: unit.id,
      title: unit.title,
      columns: unit.columns,
      chapters: sorted
        .filter((ch) => {
          const normId = ch.chapterId.replace(/^([a-z0-9]+-)?ch/, "");
          return unit.chapterIds.includes(normId);
        })
        .map((ch) => ({
          id: ch.chapterId,
          title: ch.title,
          icon: "menu-book" as const,
        })),
    })).filter((u) => u.chapters.length > 0);
  }

  // For other categories, group into a single "Course Materials" unit for now
  return [{
    id: "main",
    title: "Course Materials",
    columns: 2 as const,
    chapters: sorted.map((ch) => ({
      id: ch.chapterId,
      title: ch.title,
      icon: "menu-book" as const,
    })),
  }].filter((u) => u.chapters.length > 0);
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { activeCategory } = useCourseStore();

  const { data: chapters, loading, error, refetch } = useApi(
    () => api.getChapters(activeCategory),
    [activeCategory]
  );

  const units = useMemo(() => buildUnits(chapters ?? [], activeCategory), [chapters, activeCategory]);

  const filteredUnits = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const hasSearch = query.length > 0;

    if (!hasSearch) return units;

    return units
      .map((unit) => {
        const unitMatchesSearch = hasSearch && unit.title.toLowerCase().includes(query);

        const matchingChapters = unit.chapters.filter((ch) => {
          const t = ch.title.toLowerCase();
          const cleanId = ch.id.replace(/[^0-9]/g, "");
          const matchesSearch =
            t.includes(query) ||
            ch.id.toLowerCase().includes(query) ||
            `chapter ${cleanId}`.includes(query) ||
            `ch ${cleanId}`.includes(query);
          return matchesSearch;
        });

        const chaptersToShow = unitMatchesSearch ? unit.chapters : matchingChapters;

        return { ...unit, chapters: chaptersToShow };
      })
      .filter((u) => u.chapters.length > 0);
  }, [units, searchQuery]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

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
                <Text className="text-white font-bold" style={{ color: '#ffffff' }}>Retry</Text>
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

              {/* Educational Quote Card */}
              <View className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 items-center mt-16">
                <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#005ab5" />
                <Text className="text-xl font-bold text-on-surface mt-4">Read, Learn & Grow</Text>
                <Text className="text-on-surface-variant text-center mt-2 leading-relaxed">
                  "The beautiful thing about learning is that no one can take it away from you." Read the notes thoroughly to build a strong foundation and ace your CBSE exams!
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
