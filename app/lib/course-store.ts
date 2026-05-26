import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../constants/courses";

interface CourseState {
  activeCategory: Category;
  setCategory: (cat: Category) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      activeCategory: "class12", // Default to Class 12
      setCategory: (cat: Category) => set({ activeCategory: cat }),
    }),
    {
      name: "pylearn-course-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
