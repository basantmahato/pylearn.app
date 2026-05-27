import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORIES, Category } from '@/constants/courses';
import { useCourseStore } from '@/lib/course-store';
import { setOnboardingComplete } from '@/lib/storage';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';

const CATEGORY_ICONS: Record<Category, string> = {
  class11: "school-outline",
  class12: "school",
  bca: "database",
  btech: "laptop",
  aiml: "brain",
};

export default function OnboardingCourseScreen() {
  const { activeCategory, setCategory } = useCourseStore();
  const [selected, setSelected] = useState(activeCategory);
  const insets = useSafeAreaInsets();

  const { data: dynamicCoursesRes } = useApi(() => api.getCourses().catch(() => null), []);
  const dynamicCourses = dynamicCoursesRes?.success ? dynamicCoursesRes.data : null;
  const courseList = dynamicCourses || CATEGORIES;

  const handleSelect = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(id as any);
  };

  const handleFinish = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCategory(selected);
    setOnboardingComplete();
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-primary">Step 3 of 3</Text>
          <View className="flex-row gap-1">
            <View className="h-2 w-8 rounded-full bg-primary" />
            <View className="h-2 w-8 rounded-full bg-primary" />
            <View className="h-2 w-8 rounded-full bg-primary" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-10" showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View className="mb-8 h-20 w-20 items-center justify-center rounded-3xl bg-surface-container">
          <MaterialCommunityIcons name="school" size={48} color="#005ab5" />
        </View>

        {/* Title */}
        <Text className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface">
          Select your{'\n'}course
        </Text>
        <Text className="mb-8 text-base text-on-surface-variant">
          You can always switch courses later from the home screen
        </Text>

        {/* Category List */}
        <View className="gap-4">
          {courseList.map((cat) => {
            const isSelected = selected === cat.key;
            const iconName = CATEGORY_ICONS[cat.key as Category] || "school";
            return (
              <Pressable
                key={cat.key}
                onPress={() => handleSelect(cat.key)}
                className={`flex-row items-center p-5 rounded-[28px] border-2 ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-outline-variant/10 bg-surface-container-low'
                }`}
                style={
                  isSelected
                    ? {
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : undefined
                }
              >
                <View className={`h-12 w-12 items-center justify-center rounded-2xl ${
                  isSelected ? 'bg-primary' : 'bg-surface-container-high'
                }`}>
                  <MaterialCommunityIcons 
                    name={iconName as any} 
                    size={24} 
                    color={isSelected ? 'white' : '#717785'} 
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className={`text-lg font-bold ${
                    isSelected ? 'text-primary' : 'text-on-surface'
                  }`}>
                    {cat.label}
                  </Text>
                  <Text className="text-sm text-on-surface-variant opacity-70">
                    {cat.description}
                  </Text>
                </View>
                {isSelected && (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <MaterialCommunityIcons name="check" size={16} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 pt-4 border-t border-outline-variant/5 bg-background" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleFinish}
          className="rounded-2xl py-4 bg-primary shadow-lg active:scale-[0.98]"
        >
          <Text className="text-center text-lg font-bold text-white" style={{ color: '#ffffff' }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
