import { useProgressStore } from "@/lib/progress-store";
import { useUserStore } from "@/lib/storage";
import { useCourseStore } from "@/lib/course-store";
import { CATEGORIES } from "@/constants/courses";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, View } from "react-native";

export function Greeting() {
  const userName = useUserStore((state) => state.userName) || "Learner";
  const { activeCategory } = useCourseStore();
  const { getStreak, checkIn } = useProgressStore();
  const streak = getStreak();

  const activeCourse = CATEGORIES.find(c => c.key === activeCategory);

  useEffect(() => {
    // Check in for streak when greeting loads
    checkIn();
  }, [checkIn]);

  return (
    <View className="mb-10 flex-row justify-between items-end gap-2">
      <View className="flex-1">
        <Text 
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface"
          numberOfLines={2}
        >
          Hey, {userName}
        </Text>
      </View>
      <View className="bg-surface-container-lowest shadow-sm rounded-xl px-3 py-1.5 flex-row items-center gap-1.5 border border-surface-container-high shrink-0">
        <MaterialCommunityIcons name="fire" size={18} color="#f97316" />
        <Text className="font-bold text-sm text-on-surface">{streak} Day Streak</Text>
      </View>
    </View>
  );
}
