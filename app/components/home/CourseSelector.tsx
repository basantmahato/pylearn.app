import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CATEGORIES } from "../../constants/courses";
import { useCourseStore } from "../../lib/course-store";

export function CourseSelector() {
  const { activeCategory, setCategory } = useCourseStore();

  return (
    <View className="mb-8">
      <Text className="text-[11px] font-black text-muted-foreground tracking-[0.12em] uppercase mb-3 px-1">
        Choose Your Course
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2.5 pr-6"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              activeOpacity={0.7}
              className={`px-5 py-2.5 rounded-full border transition-all ${
                isActive
                  ? "bg-primary border-primary shadow-lg shadow-primary/20"
                  : "bg-white border-border"
              }`}
            >
              <Text
                className={`font-bold text-[13px] ${
                  isActive ? "text-white" : "text-muted-foreground"
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
