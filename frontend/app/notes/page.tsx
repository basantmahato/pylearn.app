import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotesClient from "./NotesClient";
import { fetchChapters, fetchNotes, type Chapter, type NoteBlock, fetchCourses, type ApiCourse } from "../../lib/api";

export const metadata: Metadata = {
  title: "Notes — PyLearn | Python Notes for Class 11, 12, BCA, B.Tech & AI/ML",
  description:
    "Browse chapter-wise Python notes for Class 11, Class 12, BCA, B.Tech and AI/ML — structured paragraphs, bullet summaries and code examples.",
};

export default async function NotesPage() {
  let CATEGORIES: ApiCourse[] = [];
  try {
    CATEGORIES = await fetchCourses();
  } catch {
    CATEGORIES = [];
  }

  // Fetch chapters for all categories in parallel
  const chaptersByCategory: Record<string, Chapter[]> = {};
  let notes: NoteBlock[] = [];
  let error = "";

  try {
    const results = await Promise.all([
      ...CATEGORIES.map((cat) => fetchChapters(cat.key)),
      fetchNotes(),
    ]);

    CATEGORIES.forEach((cat, i) => {
      chaptersByCategory[cat.key] = results[i] as Chapter[];
    });
    notes = results[CATEGORIES.length] as NoteBlock[];
  } catch {
    error = "Could not connect to the backend. Please make sure the server is running.";
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-bg">
        <NotesClient categories={CATEGORIES} chaptersByCategory={chaptersByCategory} notes={notes} error={error} />
      </main>
      <Footer />
    </>
  );
}
