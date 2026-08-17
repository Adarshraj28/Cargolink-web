"use client";

import { useState, type FormEvent } from "react";
import PageHeader from "@/components/sections/PageHeader";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.message.trim()) {
      setError("Please fill in your name, a valid work email and a message.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Contact"
          title="Talk to the team."
          subtitle="Questions about the platform, partnerships or your operation."
        />
        <section className="bg-white">
          <div className="container-site section-pad">
            <div className="mx-auto max-w-md rounded-2xl border border-success/25 bg-success-bg p-10 text-center animate-scale-in">
              <CheckCircle2 size={44} className="mx-auto text-success" />
              <h2 className="mt-4 text-[20px] font-bold text-charcoal">Message sent</h2>
              <p className="mt-2 text-[14.5px] text-charcoal/75">
                Thanks {form.name.split(" ")[0]} — we&apos;ve received your message
                and will get back to you at {form.email} shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", company: "", role: "", phone: "", message: "" });
                }}
                className="btn btn-secondary mt-6"
              >
                Send another message
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the team."
        subtitle="Questions about the platform, partnerships or your operation — send us a message."
        image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Long highway ahead"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-2xl">
            {error && (
              <div className="mb-5 rounded-lg bg-danger-bg px-4 py-3 text-[13.5px] font-medium text-danger">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-8 shadow-md">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="form-label">Name <span className="req">*</span></label>
                  <input id="name" className="form-input" placeholder="Your name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Work email <span className="req">*</span></label>
                  <input id="email" type="email" className="form-input" placeholder="you@company.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="company" className="form-label">Company</label>
                  <input id="company" className="form-input" placeholder="Company name" value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="role" className="form-label">Role</label>
                  <select id="role" className="form-select" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="">Select a role</option>
                    <option>Shipper</option>
                    <option>Fleet Operator</option>
                    <option>Driver</option>
                    <option>Enterprise / Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input id="phone" type="tel" className="form-input" placeholder="+91 98xxx xxxxx" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="form-label">Message <span className="req">*</span></label>
                  <textarea id="message" rows={5} className="form-input resize-none" placeholder="How can we help?"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-6 w-full">
                Send message
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
