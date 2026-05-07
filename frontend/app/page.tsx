import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import AppScreens from "./components/AppScreens";
import Syllabus from "./components/Syllabus";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import FeaturedBlogs from "./components/FeaturedBlogs";
import Download from "./components/Download";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AppScreens />
        <Syllabus />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <FeaturedBlogs />
        <Download />
      </main>
      <Footer />
    </>
  );
}
