import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuizClient from "./QuizClient";
import { fetchChapters, fetchQuizzes, type Chapter, type QuizSet, fetchCourses, type ApiCourse } from "../../lib/api";

export const metadata: Metadata = {
  title: "Quiz — PyLearn | Practice Python MCQs for Class 11, 12, BCA, B.Tech & AI/ML",
  description:
    "Chapter-wise Python MCQ quizzes for Class 11, Class 12, BCA, B.Tech and AI/ML with instant feedback and explanations.",
};

export default async function QuizPage() {
  let CATEGORIES: ApiCourse[] = [];
  try {
    CATEGORIES = await fetchCourses();
  } catch {
    CATEGORIES = [];
  }

  const chaptersByCategory: Record<string, Chapter[]> = {};
  const quizSetsByCategory: Record<string, QuizSet[]> = {};
  let error = "";

  try {
    const results = await Promise.all([
      ...CATEGORIES.map((cat) => fetchChapters(cat.key)),
      ...CATEGORIES.map((cat) => fetchQuizzes(cat.key)),
    ]);

    CATEGORIES.forEach((cat, i) => {
      chaptersByCategory[cat.key] = results[i] as Chapter[];
    });
    CATEGORIES.forEach((cat, i) => {
      quizSetsByCategory[cat.key] = results[CATEGORIES.length + i] as QuizSet[];
    });
  } catch {
    error = "Could not connect to the backend. Please make sure the server is running.";
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-bg">
        <QuizClient
          categories={CATEGORIES}
          chaptersByCategory={chaptersByCategory}
          quizSetsByCategory={quizSetsByCategory}
          error={error}
        />
      </main>
      <Footer />
    </>
  );
}
