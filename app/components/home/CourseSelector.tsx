import React from "react";
import { ScrollView, Text, Pressable, View } from "react-native";
import { CATEGORIES } from "../../constants/courses";
import { useCourseStore } from "../../lib/course-store";
import { useApi } from "../../hooks/useApi";
import { api } from "../../lib/api";

export function CourseSelector() {
  const { activeCategory, setCategory } = useCourseStore();
  const { data: dynamicCoursesRes } = useApi(() => api.getCourses().catch(() => null), []);
  const dynamicCourses = dynamicCoursesRes?.success ? dynamicCoursesRes.data : null;
  const courseList = dynamicCourses || CATEGORIES;

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
        {courseList.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full border active:opacity-75 ${
                isActive
                  ? "bg-primary border-primary"
                  : "bg-white border-border"
              }`}
              style={
                isActive
                  ? {
                      shadowColor: cat.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 4,
                    }
                  : undefined
              }
            >
              <Text
                className={`font-bold text-[13px] ${
                  isActive ? "text-white" : "text-muted-foreground"
                }`}
                style={isActive ? { color: "#ffffff" } : undefined}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
