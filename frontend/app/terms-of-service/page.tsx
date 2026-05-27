import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero min-h-screen pt-[120px] pb-20 relative overflow-hidden">
        {/* Background decorative orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary -top-[150px] -left-[150px] animate-float" />
        <div className="orb w-[400px] h-[400px] bg-purple -bottom-[100px] -right-[100px] animate-float [animation-delay:3s]" />

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="badge bg-purple/10 text-purple mb-4">SERVICE RULES</span>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black text-text leading-tight mb-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Last updated: May 27, 2026. Please read these terms carefully before using PyLearn services.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-border rounded-[32px] p-8 md:p-12 shadow-xl space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                By accessing or using the PyLearn website or mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using this platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">2. Intellectual Property & Use License</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                All materials contained in PyLearn (including curriculum notes, quiz questions, sample papers, custom illustrations, and code samples) are the intellectual property of PyLearn and protected by copyright law.
              </p>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                Permission is granted to temporarily download one copy of materials for personal, non-commercial, educational reference only. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary text-[0.95rem]">
                <li>Modify or copy curriculum or code materials.</li>
                <li>Use materials for commercial teaching purposes without prior authorization.</li>
                <li>Decompile or reverse engineer any software contained in the website or mobile app.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">3. User Content & Contact Submissions</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                When using our contact form or interacting with our services, you agree not to submit any material that is defamatory, obscene, infringing, or otherwise unlawful. We reserve the right to block or delete any submission violating these guidelines.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">4. Disclaimer & Limitations</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                PyLearn study resources are provided "as is". We strive to keep our materials aligned to current CBSE and university guidelines, but we make no warranties, expressed or implied, regarding accuracy, completeness, or suitability for any specific exam outcomes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">5. Modifications</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                We reserve the right to revise or update these Terms of Service at any time without notice. By using our platforms, you agree to be bound by the then-current version of these terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
