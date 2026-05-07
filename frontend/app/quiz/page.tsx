/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuizClient from "./QuizClient";
import { fetchChapters, fetchQuizzes, type Chapter, type QuizSet } from "../../lib/api";

export const metadata: Metadata = {
  title: "Quiz — PyLearn | Practice Python MCQs",
  description:
    "Attempt 100+ chapter-wise Python MCQ quizzes for CBSE Class 12 Computer Science with instant feedback and explanations.",
};

export default async function QuizPage() {
  let chapters: Chapter[] = [];
  let quizSets: QuizSet[] = [];
  let error = "";

  try {
    [chapters, quizSets] = await Promise.all([fetchChapters(), fetchQuizzes()]);
  } catch {
    error = "Could not connect to the backend. Please make sure the server is running.";
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "88px", minHeight: "100vh" }}>
        <QuizClient chapters={chapters} quizSets={quizSets} error={error} />
      </main>
      <Footer />
    </>
  );
}
