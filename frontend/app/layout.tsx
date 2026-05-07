import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PyLearn — Master Python for CBSE Class 12",
  description:
    "PyLearn is the ultimate Python learning app for CBSE Class 12 students. Study structured notes, practice with 100+ smart quizzes, and attempt 20 sample papers — all in one place.",
  keywords: [
    "Python", "CBSE", "Class 12", "Computer Science", "Notes", "Quiz",
    "Sample Papers", "PyLearn", "Programming", "Learning App",
  ],
  openGraph: {
    title: "PyLearn — Master Python for CBSE Class 12",
    description:
      "Structured notes, 100+ quizzes, 20 sample papers. The all-in-one Python prep app for Class 12.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyLearn — Master Python for CBSE Class 12",
    description: "Structured notes, 100+ quizzes, 20 sample papers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
