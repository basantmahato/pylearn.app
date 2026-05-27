import { Pressable, Text } from "react-native";

interface TopicPillProps {
  topic: string;
}

export function TopicPill({ topic }: TopicPillProps) {
  return (
    <Pressable 
      className="bg-surface-container-high px-4 py-2 rounded-full mr-2 mb-3 active:opacity-80"
    >
      <Text className="text-sm font-semibold text-on-secondary-container">
        {topic}
      </Text>
    </Pressable>
  );
}
