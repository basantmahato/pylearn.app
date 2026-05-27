"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000/api/v1";
      const res = await fetch(`${BASE}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Failed to submit contact form.");
      }

      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="gradient-hero min-h-screen pt-[120px] pb-20 relative overflow-hidden">
        {/* Background decorative orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary -top-[150px] -left-[150px] animate-float" />
        <div className="orb w-[400px] h-[400px] bg-purple -bottom-[100px] -right-[100px] animate-float [animation-delay:3s]" />

        <div className="container mx-auto px-6 relative z-10 max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="badge bg-primary/10 text-primary mb-4">SUPPORT & CONTACT</span>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black text-text leading-tight mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Have questions, feedback, or a partnership inquiry? We are here to help.
            </p>
          </div>

          {/* Success Card */}
          {success ? (
            <div className="bg-white/80 backdrop-blur-xl border border-accent/20 rounded-[32px] p-8 text-center shadow-xl space-y-6 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center text-3xl font-bold animate-pulse">
                ✓
              </div>
              <h2 className="text-2xl font-black text-text tracking-tight">Form Submitted!</h2>
              <p className="text-text-secondary leading-relaxed text-sm">
                Thank you for reaching out! Our team has received your message and we will respond to your email as soon as possible.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary w-full py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Contact Form Card */
            <div className="bg-white/85 backdrop-blur-xl border border-border rounded-[32px] p-8 shadow-xl space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-text-secondary">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-bg-surface border border-border px-4 py-3 rounded-2xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-text-secondary">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-bg-surface border border-border px-4 py-3 rounded-2xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-black uppercase tracking-wider text-text-secondary">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="General Inquiry"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-bg-surface border border-border px-4 py-3 rounded-2xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-black uppercase tracking-wider text-text-secondary">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell us what you need..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-bg-surface border border-border px-4 py-3 rounded-2xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 text-xs font-bold bg-error/10 border border-error/20 text-error rounded-xl text-center">
                    ⚠ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
