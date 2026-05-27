import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
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
            <span className="badge bg-primary/10 text-primary mb-4">LEGAL POLICIES</span>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black text-text leading-tight mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Last updated: May 27, 2026. Learn how we collect, use, and safeguard your data.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-border rounded-[32px] p-8 md:p-12 shadow-xl space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">1. Overview</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                At PyLearn, we are committed to protecting your privacy. This Privacy Policy details the types of information we collect through our website and our mobile application, how we use it, and the security measures we employ to keep it safe.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">2. Information Collection</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                We prioritize user privacy and minimize data collection. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary text-[0.95rem]">
                <li><strong>No Mandatory Accounts:</strong> You can browse all content, take quizzes, and study chapters without creating an account or providing credentials.</li>
                <li><strong>Local Storage:</strong> Your study progress, scores, and streak data are stored locally on your device unless you explicitly opt to sync them.</li>
                <li><strong>Contact Information:</strong> If you use our Contact form, we collect your name, email address, subject, and message content to address your inquiry.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">3. How We Use Data</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                We use collected information solely for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary text-[0.95rem]">
                <li>To provide, maintain, and improve our learning services.</li>
                <li>To reply to your support tickets, feedback, or contact submissions.</li>
                <li>To perform aggregated, anonymous analytical research to enhance study modules.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">4. Third-Party Integrations</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                We utilize standard services like Google Play Services for push notifications (if opted in) and app updates. We do not sell, trade, or transfer your personally identifiable data to outside commercial parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-black text-text tracking-tight">5. Contact Information</h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                If you have any questions or feedback regarding this privacy policy or our data practices, please reach out to us using our <a href="/contact" className="text-primary font-bold hover:underline">Contact Form</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
