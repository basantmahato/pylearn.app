export type Category = "class11" | "class12" | "bca" | "btech";

export interface CategoryMeta {
  key: Category;
  label: string;
  description: string;
  color: string;
  lightColor: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "class11",
    label: "Class 11",
    description: "Computer Science (Python)",
    color: "#8b5cf6", // Purple
    lightColor: "#f5f3ff",
  },
  {
    key: "class12",
    label: "Class 12",
    description: "Computer Science boards",
    color: "#005ab5", // Primary Blue
    lightColor: "#e8f0ff",
  },
  {
    key: "bca",
    label: "BCA",
    description: "Degree Foundation",
    color: "#10b981", // Accent Green
    lightColor: "#ecfdf5",
  },
  {
    key: "btech",
    label: "B.Tech",
    description: "CS / IT Engineering",
    color: "#f59e0b", // Accent Warm
    lightColor: "#fffbeb",
  },
];
