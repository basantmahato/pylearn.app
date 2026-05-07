/**
 * Centralized Axios API client for PyLearn app.
 * All backend calls go through this file.
 *
 * Base URL resolves to:
 *  - Android emulator  → http://10.0.2.2:5000/api
 *  - Physical device   → replace with your LAN IP e.g. http://192.168.1.x:5000/api
 *  - Expo Web / iOS sim → http://localhost:5000/api
 */

import axios from "axios";
import { Platform } from "react-native";

// ── Base URL ──────────────────────────────────────────────────────────────────
// For Android emulator, localhost maps to 10.0.2.2
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api"
    : "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiChapter {
  _id: string;
  chapterId: string;
  title: string;
  order: number;
  summary?: {
    short_summary?: string;
    detailed_summary?: string;
    exam_focus?: string[];
    revision_notes?: string[];
  };
  practice?: {
    id: string;
    q: string;
    type: string;
    difficulty: string;
    hints?: string[];
    solution?: { explanation?: string; code?: string; example?: string };
  }[];
}

export interface ApiNoteBlock {
  _id: string;
  chapterId: string;
  type: "paragraph" | "bullet_list" | "code";
  heading?: string;
  text?: string;
  items?: string[];
  code?: string;
  language?: string;
  order: number;
}

export interface ApiQuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface ApiQuizSet {
  _id: string;
  chapterId: string;
  setId: string;
  setName: string;
  difficulty?: string;
  questions: ApiQuizQuestion[];
}

export interface ApiSampleQuestion {
  id: string;
  question: string;
  options?: string[];
  answer?: string | number;
  marks?: number;
  explanation?: string;
  keywords?: string[];
  hints?: string[];
}

export interface ApiSampleSection {
  sectionId: string;
  title: string;
  marks?: number;
  questions: ApiSampleQuestion[];
}

export interface ApiSamplePaper {
  _id: string;
  paperId: string;
  title: string;
  subtitle?: string;
  duration?: string;
  totalMarks?: number;
  difficulty?: string;
  sections: ApiSampleSection[];
}

// ── API functions ─────────────────────────────────────────────────────────────

export const api = {
  /** Fetch all chapters (ordered by `order`) */
  getChapters: () =>
    apiClient.get<ApiChapter[]>("/chapters").then((r) => r.data),

  /** Fetch all note blocks for a specific chapter */
  getNotesByChapter: (chapterId: string) =>
    apiClient
      .get<ApiNoteBlock[]>(`/notes/${chapterId}`)
      .then((r) => r.data),

  /** Fetch all quiz sets for a specific chapter */
  getQuizzesByChapter: (chapterId: string) =>
    apiClient
      .get<ApiQuizSet[]>(`/quizzes/${chapterId}`)
      .then((r) => r.data),

  /** Fetch a specific quiz set by chapterId + setId */
  getQuizSet: async (chapterId: string, setId: string) => {
    const sets = await apiClient
      .get<ApiQuizSet[]>(`/quizzes/${chapterId}`)
      .then((r) => r.data);
    return sets.find((s) => s.setId === setId) ?? null;
  },

  /** Fetch all sample papers */
  getSamplePapers: () =>
    apiClient.get<ApiSamplePaper[]>("/sample-papers").then((r) => r.data),

  /** Fetch a single sample paper by paperId */
  getSamplePaperById: (paperId: string) =>
    apiClient
      .get<ApiSamplePaper>(`/sample-papers/${paperId}`)
      .then((r) => r.data),
};
