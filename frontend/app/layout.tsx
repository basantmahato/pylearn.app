import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://pylearn.com"; // Update to your production domain

export const metadata: Metadata = {
  title: "PyLearn — Python Notes, Quizzes & Sample Papers for Class 11, 12, BCA & B.Tech",
  description:
    "PyLearn is the ultimate Python learning platform for students of Class 11, Class 12, BCA, B.Tech and AI/ML. Master Python with structured notes, 100+ quizzes, and 20+ sample papers.",
  keywords: [
    "Python", "CBSE", "Class 12", "Class 11", "BCA", "B.Tech", "AI/ML", 
    "Computer Science", "Python Notes", "Python Quiz", "Sample Papers", 
    "PyLearn", "Programming", "Data Science", "Python for Beginners"
  ],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "PyLearn — Master Python for Class 11, 12, BCA & B.Tech",
    description:
      "Structured notes, 100+ quizzes, 20 sample papers. The all-in-one Python prep app for all courses.",
    url: BASE_URL,
    siteName: "PyLearn",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyLearn — Master Python for Class 11, 12, BCA & B.Tech",
    description: "Structured notes, 100+ quizzes, 20 sample papers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "PyLearn",
    "url": BASE_URL,
    "logo": `${BASE_URL}/icon.png`,
    "description": "Premium Python learning resources for students and engineers.",
    "sameAs": [
      "https://github.com/pylearn",
      "https://play.google.com/store/apps/details?id=com.pylearn12"
    ],
    "offers": {
      "@type": "Offer",
      "category": ["Class 11", "Class 12", "BCA", "B.Tech", "AI/ML"],
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
