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
    <View className="mb-10 flex-row justify-between items-end">
      <View className="space-y-1">
        <Text className="text-4xl font-extrabold tracking-tight text-on-surface">Hey, {userName}</Text>
      </View>
      <View className="bg-surface-container-lowest shadow-sm rounded-2xl px-4 py-2 flex-row items-center gap-2 border border-surface-container-high">
        <MaterialCommunityIcons name="fire" size={20} color="#f97316" />
        <Text className="font-bold text-on-surface">{streak} Day Streak</Text>
      </View>
    </View>
  );
}
