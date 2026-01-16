import Link from "next/link";
import { Shield, FileText, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import EnhancedMapView from "@/components/MapView";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gray-50">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Save Millions on Fraud.<br />Pay Claims in Minutes.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl">
          Two powerful AI platforms that help health insurers stop billions in fraudulent payouts while dramatically speeding up legitimate claims - reducing costs and improving trust.
        </p>
          {/* <EnhancedMapView /> */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
        </div>
      </section>
      {/* Interactive Map Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              See Fraud Patterns and Instant Decisions in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our AI analyzes millions of claims in real time to flag suspicious patterns and auto-approve clean claims for immediate payout.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
                  <p className="text-xl font-medium text-gray-700">
                    Live Demo Coming Soon
                  </p>
                  <p className="mt-2 text-gray-500">
                    Real-time fraud detection + instant claim approval dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-black">95%+</p>
              <p className="mt-2 text-gray-600">Fraud Detection Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-black">80%+</p>
              <p className="mt-2 text-gray-600">Claims Auto-Approved Instantly</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-black">&lt;24h</p>
              <p className="mt-2 text-gray-600">Average Payout Time for Valid Claims</p>
            </div>
          </div>
          </div>
      </section>

      {/* Features Section */}
      <section id='features' className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Two AI Platforms Transforming Health Insurance Claims
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Stop fraud at the source and pay legitimate claims faster than ever - all with explainable, auditable AI designed for insurers.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <Shield className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Fraud Elimination Platform</h3>
            <p className="mt-2 text-gray-600">
              Real-time detection of phantom billing, upcoding, unbundling, duplicate claims, and organized fraud rings. Catch fraud before payout with 95%+ accuracy and full audit trails.
            </p>
            <Link
              href="/fraud-detection"
              className="mt-6 inline-block text-black font-medium hover:underline"
            >
              Learn more →
            </Link>
          </div>

          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <FileText className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Instant Claims Platform</h3>
            <p className="mt-2 text-gray-600">
               Automate adjudication for clean claims and enable same-day or instant payouts. Reduce processing time from weeks to minutes while maintaining compliance and accuracy.
            </p>
            <Link
              href="/instant-claims"
              className="mt-6 inline-block text-black font-medium hover:underline"
            >
              Learn more →
            </Link>
          </div>

          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <BarChart3 className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Better Outcomes For Everyone</h3>
            <p className="mt-2 text-gray-600">
              Reduce losses, lower premiums, speed up care delivery, and rebuild trust with providers and policyholders.
            </p>
            <Link
              href="/delighted-customers"
              className="mt-6 inline-block text-black font-medium hover:underline"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Eliminate Fraud and Pay Claims Faster?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Join leading health insurers transforming claims processing with AI.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Talk to Us
          </Link>
        </div>
      </section>
    </div>
  );
}
