import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function Header() {
  return (
    <View className="flex-row items-center justify-between px-6 h-16 w-full bg-white/80 border-b border-slate-100">
      <View className="flex-row items-center gap-3">
        <MaterialCommunityIcons name={"terminal" as any} size={24} color="#1d4ed8" />
        <Text className="text-xl font-extrabold text-slate-900 tracking-tight">PyLearn 12</Text>
      </View>
      
      <View className="flex-row items-center gap-4">
        <Pressable className="p-2 rounded-full active:bg-blue-50/50">
          <MaterialCommunityIcons name="magnify" size={24} color="#64748b" />
        </Pressable>
        <View className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
          <MaterialCommunityIcons name="account" size={22} color="#64748b" />
        </View>
      </View>
    </View>
  );
}
