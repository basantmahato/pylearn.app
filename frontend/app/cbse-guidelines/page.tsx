import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CbseGuidelinesPage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero min-h-screen pt-[120px] pb-20 relative overflow-hidden">
        {/* Background decorative orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary -top-[150px] -left-[150px] animate-float" />
        <div className="orb w-[400px] h-[400px] bg-accent -bottom-[100px] -right-[100px] animate-float [animation-delay:4s]" />

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="badge bg-accent/10 text-accent mb-4">BOARD ACADEMICS</span>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black text-text leading-tight mb-4 tracking-tight">
              CBSE CS Guidelines
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Curriculum breakdown, board exam weightage, and practical blueprint for Class 11 & 12 Computer Science (Python).
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-border rounded-[32px] p-8 md:p-12 shadow-xl space-y-10">
            {/* Section 1: Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">📋</span>
                Curriculum Overview
              </h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                The CBSE Computer Science curriculum (Subject Code: 083) focuses on computational thinking, programming concepts in Python, database management (SQL), and computer networks. All notes, quizzes, and sample papers in PyLearn are mapped unit-by-unit with this official syllabus.
              </p>
            </section>

            {/* Section 2: Class 12 Boards Weightage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">📊</span>
                Class 12 Boards Weightage (Theory: 70 Marks)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { unit: "Unit I", name: "Computational Thinking & Programming - 2", marks: "40 Marks", desc: "Python Revision, Functions, Exception Handling, File Handling (Text, Binary, CSV), Stack using List." },
                  { unit: "Unit II", name: "Computer Networks", marks: "10 Marks", desc: "Evolution of Networking, Network types, Topologies, Protocols (HTTP, TCP/IP), Web services, Security." },
                  { unit: "Unit III", name: "Database Management", marks: "20 Marks", desc: "Relational database concepts, SQL Commands (DDL, DML), Joins, Mongoose/Python-SQL Connectivity." }
                ].map(u => (
                  <div key={u.unit} className="p-5 rounded-2xl bg-bg border border-border flex flex-col justify-between">
                    <div>
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary leading-none">{u.unit}</span>
                      <h4 className="font-extrabold text-text text-sm mt-1.5 leading-tight">{u.name}</h4>
                      <p className="text-xs text-text-secondary mt-3 leading-relaxed">{u.desc}</p>
                    </div>
                    <span className="font-black text-lg text-primary mt-4 block">{u.marks}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Practical Component */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center text-sm">🔬</span>
                Practical Exam Blueprint (30 Marks)
              </h2>
              <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                The internal evaluation includes hands-on programming, file creation, and project presentations:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Lab Test (12 Marks)", desc: "A Python program (6 marks) and a SQL query execution (6 marks) on a computer system." },
                  { title: "Report File + Viva (10 Marks)", desc: "A practical file with 15+ Python programs, 5+ SQL queries, and a corresponding viva voce exam." },
                  { title: "Project Work (8 Marks)", desc: "A collaborative real-world software project demonstrating Python and database connectivity (e.g. library, school management)." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-all bg-white">
                    <span className="text-xl font-bold text-primary shrink-0">{idx + 1}.</span>
                    <div>
                      <h4 className="font-bold text-text text-sm">{item.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
