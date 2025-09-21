import Link from "next/link";
import { Shield, FileText, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
//import EnhancedMapView from "@/components/MapView";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gray-50">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Geospatial Brain of Insurance
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl">
          From underwriting to claims and reinsurance, our solutions help insurers 
          streamline operations, reduce risk, and deliver better outcomes for policyholders.
        </p>
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
          {/* <EnhancedMapView /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Solutions for Every Part of Insurance
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tools designed to optimize underwriting, accelerate claims, 
            and strengthen reinsurance strategies.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <Shield className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Underwriting Excellence</h3>
            <p className="mt-2 text-gray-600">
              Leverage smarter data and analytics to assess risk more accurately 
              and price policies with confidence.
            </p>
          </div>

          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <FileText className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Faster Claims</h3>
            <p className="mt-2 text-gray-600">
              Automate claim verification, reduce fraud, and pay customers 
              faster while improving accuracy.
            </p>
          </div>

          <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition">
            <BarChart3 className="w-10 h-10 text-black" />
            <h3 className="mt-6 text-xl text-black font-semibold">Reinsurance Optimization</h3>
            <p className="mt-2 text-gray-600">
              Strengthen resilience with advanced modeling and portfolio insights 
              for reinsurers and brokers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Transform Your Insurance Operations
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Whether you’re an insurer, underwriter, claims manager, or reinsurer, 
          we help you move faster with less risk.
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
