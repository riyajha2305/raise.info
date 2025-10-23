"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    console.log("Access Key:", accessKey ? "Key is set" : "Key is missing");

    try {
      const payload = {
        access_key: accessKey || "YOUR_ACCESS_KEY_HERE",
        name: formData.name,
        email: formData.email,
        message: formData.message,
        from_name: "salaris.fyi Contact Form",
        subject: "New Contact Form Submission from salaris.fyi",
      };

      console.log("Submitting form with payload:", {
        ...payload,
        access_key: "***hidden***",
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Web3Forms Response:", result);

      if (result.success) {
        console.log("✅ Form submitted successfully!");
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        console.error("❌ Form submission failed:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Header */}
      <header className="bg-[#80A1BA] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-4xl font-bold text-[#F0F0F0] mb-2 cursor-pointer hover:opacity-80 transition-opacity">
                salaris.fyi
              </h1>
            </Link>
            <p className="text-lg text-[#F0F0F0]">
              Discover salary insights across various companies
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#80A1BA] to-[#5A7A8A] bg-clip-text text-transparent mb-2 text-center">
            Contact Us
          </h2>

          {/* Email Display */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-600 text-sm">ssaswat786@gmail.com</span>
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed text-center">
            Have questions, suggestions, or feedback? We'd love to hear from
            you.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Tell us more..."
              />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Oops! Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#80A1BA] text-white py-3 px-6 rounded-md hover:bg-[#6B8BA0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#80A1BA] border-t border-[#6B8BA0] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[#F0F0F0] text-sm">
              © 2024 salaris.fyi. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-[#F0F0F0] hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-[#F0F0F0] hover:text-white transition-colors"
              >
                About
              </Link>
              <Link href="/contact" className="text-[#F0F0F0] font-medium hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
