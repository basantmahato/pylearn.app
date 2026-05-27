import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { useProgressStore } from "@/lib/progress-store";
import { useCourseStore } from "@/lib/course-store";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

export function ProgressHero() {
  const router = useRouter();
  const { activeCategory } = useCourseStore();
  const { getOverallProgress, getTotalChaptersCompleted, getChapterProgress } = useProgressStore();
  const completed = getTotalChaptersCompleted(activeCategory);

  // Fetch live chapter list from backend
  const { data: chapters } = useApi(() => api.getChapters(activeCategory), [activeCategory]);
  const totalChapters = chapters?.length ?? 11; // fallback while loading

  // Compute progress based on live total
  const progress = getOverallProgress(activeCategory, totalChapters);

  // Find first uncompleted chapter from live list
  const sortedChapters = (chapters ?? []).slice().sort((a, b) => a.order - b.order);
  const firstUncompleted = sortedChapters.find((c) => getChapterProgress(c.chapterId, activeCategory) < 100);
  const targetChapterId = firstUncompleted?.chapterId ?? "1";
  
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="bg-primary-container rounded-3xl p-6 shadow-xl shadow-primary/20 mb-8 flex-row items-center justify-between gap-4">
      <View className="flex-1 justify-between min-h-[140px] py-1">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-on-primary-container mb-2">Overall Progress</Text>
          <Text className="text-on-primary-container/80 text-sm">
            You have completed {completed} of {totalChapters} chapters.
          </Text>
        </View>
        <Pressable
          onPress={() => router.push(`/chapter/${targetChapterId}`)}
          className="bg-surface-container-lowest self-start px-6 py-3 rounded-full shadow-lg active:scale-95"
        >
          <Text className="text-primary font-bold text-sm">Continue Learning</Text>
        </Pressable>
      </View>

      {/* Circular Progress SVG */}
      <View className="items-center justify-center">
        <Svg width="140" height="140" viewBox="0 0 192 192">
          <Circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#000000"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity="0.1"
          />
          <Circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 96 96)"
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-2xl font-black text-white" allowFontScaling={false} style={{ color: '#ffffff' }}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
}
