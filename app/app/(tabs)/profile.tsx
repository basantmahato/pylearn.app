import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useProgressStore } from "@/lib/progress-store";
import { AVATAR_OPTIONS, useUserStore } from "@/lib/storage";
import { useCourseStore } from "@/lib/course-store";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { CourseSelector } from "@/components/home/CourseSelector";

const AVATAR_ICONS: Record<string, string> = {
  fox: "firefox",
  cat: "cat",
  dog: "dog",
  panda: "panda",
  penguin: "penguin",
  rabbit: "rabbit",
};

function StatCard({
  icon,
  label,
  value,
  color = "#005ab5",
}: {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View className="bg-surface-container-low rounded-2xl p-4 flex-1 items-center border border-outline-variant/10">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <Text className="text-2xl font-black text-on-surface">{value}</Text>
      <Text className="text-xs text-on-surface-variant mt-1">{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const name = useUserStore((state) => state.userName);
  const avatar = useUserStore((state) => state.userAvatar);
  const setUserName = useUserStore((state) => state.setUserName);
  const setUserAvatar = useUserStore((state) => state.setUserAvatar);
  const { activeCategory } = useCourseStore();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const previewAvatar = isEditing ? selectedAvatar : avatar;
  const avatarOption = AVATAR_OPTIONS.find((a) => a.id === previewAvatar);

  const {
    getOverallProgress,
    getTotalChaptersCompleted,
    getTotalQuizzesTaken,
    getAverageQuizScore,
    getStreak,
    getLongestStreak,
    isStreakAtRisk,
    getQuizHistory,
    getBookmarkedChapters,
    getBookmarkedSamplePapers,
    getSamplePaperHistory,
  } = useProgressStore();

  // Fetch live chapters and papers for accurate total and bookmark metadata
  const { data: chapters } = useApi(() => api.getChapters(activeCategory), [activeCategory]);
  const { data: papers } = useApi(() => api.getSamplePapers(activeCategory), [activeCategory]);
  
  const totalCh = chapters?.length || 11;

  const progress = getOverallProgress(activeCategory, totalCh);
  const completed = getTotalChaptersCompleted(activeCategory);
  const quizzesTaken = getTotalQuizzesTaken(activeCategory);
  const avgScore = getAverageQuizScore(activeCategory);
  const streak = getStreak();
  const longestStreak = getLongestStreak();
  const streakAtRisk = isStreakAtRisk();
  const bookmarkedIds = getBookmarkedChapters(activeCategory);

  // Get chapter details from bookmarked IDs using live list
  const bookmarkedChapters = bookmarkedIds
    .map((id) => chapters?.find((c) => c.chapterId === id))
    .filter(Boolean);

  const bookmarkedPaperIds = getBookmarkedSamplePapers(activeCategory);
  const bookmarkedPapers = bookmarkedPaperIds
    .map((id) => papers?.find((p) => p.paperId === id))
    .filter(Boolean);

  const recentQuizzes = getQuizHistory(activeCategory);
  const recentPapers = getSamplePaperHistory(activeCategory);

  const quizActivities = recentQuizzes.map((q) => ({
    type: "quiz" as const,
    id: `quiz_${q.chapterId}_${q.setId}_${q.date}`,
    title: `Chapter ${q.chapterId} Quiz - Set ${q.setId.slice(1)}`,
    subtitle: `${q.score}/${q.total} (${q.percentage}%)`,
    date: new Date(q.date),
    passed: q.passed,
  }));

  const paperActivities = recentPapers.map((p) => {
    const paperObj = papers?.find((x) => x.paperId === p.paperId);
    return {
      type: "paper" as const,
      id: `paper_${p.paperId}_${p.date}`,
      title: paperObj?.title || `Sample Paper ${p.paperId}`,
      subtitle: `Completed practice`,
      date: new Date(p.date),
      passed: true,
    };
  });

  const combinedActivities = [...quizActivities, ...paperActivities]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const handleStartEditing = () => {
    setEditName(name || "");
    setSelectedAvatar(avatar);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editName.trim() === "") return;
    try {
      const Haptics = require("expo-haptics");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setUserName(editName.trim());
    if (selectedAvatar) {
      setUserAvatar(selectedAvatar);
    }
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerClassName="pb-32 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: avatarOption?.backgroundColor || "#f5f3ff",
            }}
          >
            <MaterialCommunityIcons
              name={((previewAvatar && AVATAR_ICONS[previewAvatar]) ? (AVATAR_ICONS[previewAvatar] as any) : "account")}
              size={48}
              color={avatarOption?.color || "#8b5cf6"}
            />
          </View>

          {isEditing && (
            <View className="mb-6 w-full items-center animate-in fade-in duration-200">
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Choose Avatar
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerClassName="gap-3 px-4 py-1"
              >
                {AVATAR_OPTIONS.map((option) => {
                  const isSelected = selectedAvatar === option.id;
                  const iconName = AVATAR_ICONS[option.id] || "account";
                  return (
                    <Pressable
                      key={option.id}
                      onPress={async () => {
                        try {
                          const Haptics = require("expo-haptics");
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        } catch {}
                        setSelectedAvatar(option.id);
                      }}
                      className={`w-14 h-14 rounded-full items-center justify-center border-2 ${
                        isSelected ? "border-primary" : "border-transparent"
                      }`}
                      style={{ backgroundColor: option.backgroundColor }}
                    >
                      <MaterialCommunityIcons
                        name={iconName as any}
                        size={26}
                        color={option.color}
                      />
                      {isSelected && (
                        <View className="absolute -right-0.5 -bottom-0.5 h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <MaterialCommunityIcons name="check" size={12} color="white" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {isEditing ? (
            <View className="w-full max-w-xs items-center gap-2 mb-2 animate-in fade-in duration-200">
              <TextInput
                className="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant/30 text-center font-bold text-xl text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                value={editName}
                onChangeText={setEditName}
                placeholder="Your Name"
                maxLength={20}
                autoFocus
              />
            </View>
          ) : (
            <Text className="text-2xl font-black text-on-surface">{name || "Learner"}</Text>
          )}

          <Text className="text-on-surface-variant mt-1">Python Student</Text>

          {isEditing ? (
            <View className="flex-row gap-3 mt-5">
              <Pressable
                onPress={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-surface-container-high rounded-full active:scale-95"
              >
                <Text className="text-sm font-bold text-on-surface-variant">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={editName.trim() === ""}
                className={`flex-row items-center gap-1.5 px-6 py-2.5 rounded-full active:scale-95 shadow-sm ${
                  editName.trim() === "" ? "bg-primary/50" : "bg-primary"
                }`}
              >
                <MaterialCommunityIcons name="check" size={14} color="white" />
                <Text className="text-sm font-bold text-white" style={{ color: '#ffffff' }}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleStartEditing}
              className="flex-row items-center gap-1.5 mt-4 px-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-full active:scale-95"
            >
              <MaterialCommunityIcons name="pencil" size={14} color="#005ab5" />
              <Text className="text-sm font-bold text-primary">Edit Profile</Text>
            </Pressable>
          )}
        </View>

        <CourseSelector />

        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon="book-open-variant"
            label="Completed"
            value={`${completed}/${totalCh}`}
            color="#005ab5"
          />
          <StatCard
            icon="chart-line"
            label="Progress"
            value={`${progress}%`}
            color="#10b981"
          />
        </View>

        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon="help-circle"
            label="Quizzes"
            value={quizzesTaken}
            color="#f59e0b"
          />
          <StatCard
            icon="trophy"
            label="Avg Score"
            value={`${avgScore}%`}
            color="#8b5cf6"
          />
        </View>

        {/* Streak Section */}
        <View
          className={`rounded-2xl p-6 mb-6 ${
            streakAtRisk ? "bg-error/10 border border-error/20" : "bg-primary/5 border border-primary/10"
          }`}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color={streakAtRisk ? "#ba1a1a" : "#005ab5"}
              />
              <Text className="text-lg font-bold text-on-surface">
                {streakAtRisk ? "Streak at Risk!" : "Current Streak"}
              </Text>
            </View>
            <Text className="text-3xl font-black text-on-surface">{streak}</Text>
          </View>
          <Text className="text-on-surface-variant text-sm">
            {streakAtRisk
              ? "You missed yesterday! Complete a chapter or quiz today to start a new streak."
              : `Longest streak: ${longestStreak} days. Keep it up!`}
          </Text>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-on-surface mb-4">Recent Activity</Text>
          {combinedActivities.length === 0 ? (
            <View className="bg-surface-container-low rounded-2xl p-6 items-center">
              <MaterialCommunityIcons name="history" size={32} color="#717785" />
              <Text className="text-on-surface-variant mt-2 text-center">
                No activity logged yet. Start learning to see your history!
              </Text>
            </View>
          ) : (
            combinedActivities.map((activity) => (
              <View
                key={activity.id}
                className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center justify-between border border-outline-variant/10"
              >
                <View className="flex-row items-center gap-3 flex-1 mr-2">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      activity.type === "quiz"
                        ? activity.passed ? "bg-primary/10" : "bg-error/10"
                        : "bg-[#005ab515]"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name={
                        activity.type === "quiz"
                          ? activity.passed ? "check" : "close"
                          : "file-document-outline"
                      }
                      size={20}
                      color={
                        activity.type === "quiz"
                          ? activity.passed ? "#005ab5" : "#ba1a1a"
                          : "#005ab5"
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-on-surface" numberOfLines={1}>
                      {activity.title}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      {activity.date.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-on-surface">{activity.subtitle}</Text>
                  <Text className="text-xs text-on-surface-variant uppercase tracking-widest text-[9px] font-black opacity-60">
                    {activity.type}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Bookmarked Chapters */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-on-surface mb-4">
            Bookmarked Chapters
          </Text>
          {bookmarkedChapters.length === 0 ? (
            <View className="bg-surface-container-low rounded-2xl p-6 items-center">
              <MaterialCommunityIcons name="bookmark-outline" size={32} color="#717785" />
              <Text className="text-on-surface-variant mt-2 text-center">
                No bookmarks yet. Save chapters while reading to access them quickly!
              </Text>
            </View>
          ) : (
            bookmarkedChapters.map((chapter) => (
              <Pressable
                key={chapter!.chapterId}
                onPress={() => router.push(`/chapter/${chapter!.chapterId}`)}
                className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
              >
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="bookmark" size={20} color="#005ab5" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-on-surface" numberOfLines={1}>
                    Chapter {chapter!.chapterId}: {chapter!.title}
                  </Text>
                  <Text className="text-xs text-on-surface-variant">
                    Tap to continue reading
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#717785" />
              </Pressable>
            ))
          )}
        </View>

        {/* Bookmarked Sample Papers */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-on-surface mb-4">
            Bookmarked Sample Papers
          </Text>
          {bookmarkedPapers.length === 0 ? (
            <View className="bg-surface-container-low rounded-2xl p-6 items-center">
              <MaterialCommunityIcons name="bookmark-outline" size={32} color="#717785" />
              <Text className="text-on-surface-variant mt-2 text-center">
                No bookmarked papers yet. Save papers while reading to access them quickly!
              </Text>
            </View>
          ) : (
            bookmarkedPapers.map((paper) => (
              <Pressable
                key={paper!.paperId}
                onPress={() => router.push(`/sample/${paper!.paperId}`)}
                className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
              >
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="bookmark" size={20} color="#005ab5" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-on-surface" numberOfLines={1}>
                    {paper!.title}
                  </Text>
                  <Text className="text-xs text-on-surface-variant">
                    {paper!.difficulty} • {paper!.totalMarks} Marks
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#717785" />
              </Pressable>
            ))
          )}
        </View>

        {/* Settings & Legal */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-on-surface mb-4">Settings & Community</Text>
          
          <Pressable
            onPress={() => router.push("/privacy-policy")}
            className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <MaterialCommunityIcons name="shield-check" size={20} color="#005ab5" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-on-surface">Privacy Policy</Text>
              <Text className="text-xs text-on-surface-variant">
                How we handle your data
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#717785" />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://instagram.com/pylearn.app")}
            className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
          >
            <View className="w-10 h-10 rounded-full bg-pink-500/10 items-center justify-center mr-3">
              <MaterialCommunityIcons name="instagram" size={20} color="#d62976" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-on-surface">Instagram</Text>
              <Text className="text-xs text-on-surface-variant">
                Follow us for Python tips & updates
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={18} color="#717785" />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://t.me/pylearnapp")}
            className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#0088cc15' }}>
              <FontAwesome name="telegram" size={20} color="#0088cc" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-on-surface">Telegram</Text>
              <Text className="text-xs text-on-surface-variant">
                Get free study material & PDF notes
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={18} color="#717785" />
          </Pressable>

          {/* <Pressable
            onPress={() => Linking.openURL("https://twitter.com")}
            className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#1da1f215' }}>
              <MaterialCommunityIcons name="twitter" size={20} color="#1da1f2" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-on-surface">Twitter (X)</Text>
              <Text className="text-xs text-on-surface-variant">
                Follow us for regular CBSE announcements
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={18} color="#717785" />
          </Pressable> */}

          <Pressable
            onPress={() => Linking.openURL("https://pylearn.app")}
            className="bg-surface-container-low rounded-xl p-4 mb-3 flex-row items-center border border-outline-variant/10 active:scale-[0.98]"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#005ab515' }}>
              <MaterialCommunityIcons name="earth" size={20} color="#005ab5" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-on-surface">Official Website</Text>
              <Text className="text-xs text-on-surface-variant">
                Visit our web learning platform
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={18} color="#717785" />
          </Pressable>
        </View>

        {/* App Version Footer */}
        <View className="items-center py-6">
          <Text className="text-xs text-on-surface-variant/60">
            PyLearn v1.0.0
          </Text>
          <Text className="text-xs text-on-surface-variant/40 mt-1">
            Made with love for Students
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
