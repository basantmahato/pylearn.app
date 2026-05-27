import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  showSearch?: boolean;
  onSearchPress?: () => void;
}

export function Header({ showSearch = false, onSearchPress }: HeaderProps) {
  return (
    <View className="w-full bg-surface/80 border-b border-on-background/5 z-50">
      <View className="max-w-5xl self-center w-full px-6 h-16 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons name="code-braces" size={24} color="#005ab5" />
          <Text className="text-xl font-extrabold text-on-surface tracking-tight">PyLearn</Text>
        </View>
        <View className="flex-row items-center gap-4">
          {showSearch && (
            <Pressable 
              onPress={onSearchPress}
              className="p-2 rounded-full active:bg-surface-container-high"
              accessibilityLabel="Search"
              accessibilityHint="Tap to search for chapters"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="magnify" size={24} color="#717785" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
