/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotesClient from "./NotesClient";
import { fetchChapters, fetchNotes, type Chapter, type NoteBlock } from "../../lib/api";

export const metadata: Metadata = {
  title: "Notes — PyLearn | CBSE Class 11 & 12 Python",
  description:
    "Browse chapter-wise Python notes for CBSE Class 11 & 12 Computer Science — structured paragraphs, bullet summaries and code examples.",
};

export default async function NotesPage() {
  let chapters11: Chapter[] = [];
  let chapters12: Chapter[] = [];
  let notes: NoteBlock[] = [];
  let error = "";

  try {
    [chapters11, chapters12, notes] = await Promise.all([
      fetchChapters(11),
      fetchChapters(12),
      fetchNotes()
    ]);
  } catch {
    error = "Could not connect to the backend. Please make sure the server is running.";
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "88px", minHeight: "100vh" }}>
        <NotesClient chapters11={chapters11} chapters12={chapters12} notes={notes} error={error} />
      </main>
      <Footer />
    </>
  );
}
