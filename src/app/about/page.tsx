import Link from "next/link";
import { Shield, Zap, HeartHandshake, Users, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Transforming Insurance with AI
          </h1>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
            We build advanced AI platforms that detect and prevent fraud across all lines of insurance 
            while enabling legitimate claims to be paid in minutes — not weeks or months.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <HeartHandshake className="w-12 h-12 text-black mb-6" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              To stop billions in fraudulent payouts across property & casualty, auto, workers' comp, 
              life, and other insurance lines — while ensuring valid claims are processed and paid faster 
              than ever. We make insurance more efficient, fair, and trustworthy for everyone.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <Zap className="w-12 h-12 text-black mb-6" />
            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              An insurance industry with near-zero fraud losses and instant payouts for legitimate claims — 
              reducing costs, lowering premiums, and delivering better outcomes for policyholders and insurers alike.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do / Our Two Platforms */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Two Platforms. One Goal: Smarter, Fraud-Free Insurance.
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI solutions work independently or together to tackle fraud and slow payouts 
            across auto, property, workers' comp, liability, and beyond.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Fraud Elimination */}
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition">
            <Shield className="w-14 h-14 text-red-600 mx-auto mb-8" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Fraud Elimination Platform
            </h3>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Real-time detection of inflated claims, staged accidents, premium leakage, upcoding, 
              phantom billing, and organized fraud rings — with industry-leading accuracy and full audit trails.
            </p>
            <ul className="mt-8 space-y-4 text-left text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Catches fraud before payout across all insurance lines</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Reduces false positives with explainable AI</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Seamlessly integrates with existing claims systems</span>
              </li>
            </ul>
          </div>

          {/* Instant Claims */}
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition">
            <Zap className="w-14 h-14 text-green-600 mx-auto mb-8" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Instant Claims Platform
            </h3>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Automates adjudication of straightforward claims and enables same-day or instant payouts — 
              turning weeks of manual review into minutes, while maintaining compliance.
            </p>
            <ul className="mt-8 space-y-4 text-left text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Auto-approves 80%+ of clean claims instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Full compliance and audit trails</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Boosts policyholder and provider satisfaction</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team / Values */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <Users className="w-12 h-12 text-black mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-900">Built by Experts in AI & Insurance</h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Our team brings decades of experience in claims processing, fraud investigation, 
            and cutting-edge machine learning across multiple insurance lines. 
            We're driven by technology that makes insurance fairer, faster, and more resilient.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white text-center">
        <h2 className="text-4xl font-bold">
          Ready to Stop Fraud and Pay Claims Instantly?
        </h2>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
          Let’s discuss how our AI platforms can transform your operations.
        </p>
        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}