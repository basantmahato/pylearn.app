import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SamplesClient from "./SamplesClient";
import { fetchSamplePapers, type SamplePaper, fetchCourses, type ApiCourse } from "../../lib/api";

export const metadata: Metadata = {
  title: "Sample Papers — PyLearn | CBSE Class 12 Python",
  description:
    "Attempt 20 full-length CBSE Class 12 Python sample papers with section-wise questions, marks, and detailed explanations.",
};

export default async function SamplesPage() {
  let CATEGORIES: ApiCourse[] = [];
  try {
    CATEGORIES = await fetchCourses();
  } catch {
    CATEGORIES = [];
  }

  let papers: SamplePaper[] = [];
  let error = "";

  try {
    papers = await fetchSamplePapers();
  } catch {
    error = "Could not connect to the backend. Please make sure the server is running.";
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-bg">
        <SamplesClient categories={CATEGORIES} papers={papers} error={error} />
      </main>
      <Footer />
    </>
  );
}
