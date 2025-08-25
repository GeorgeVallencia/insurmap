'use client';

import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white fixed top-0 z-50">
      {/* Change here: instead of max-w-7xl, use a smaller width */}
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        
        {/* Logo */}
        <div className="flex cursor-pointer items-center space-x-2">
          <span className="text-xl text-black font-bold tracking-tight">InsurMap</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-800">
          <div className="relative group">
            <a href="#" className="hover:text-black transition">Products</a>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md p-4 space-y-2 w-48">
              <a href="#" className="block text-sm hover:text-black">Risk Mapping</a>
              <a href="#" className="block text-sm hover:text-black">Fraud Detection</a>
              <a href="#" className="block text-sm hover:text-black">Pricing Engine</a>
            </div>
          </div>

          <div className="relative group">
            <a href="#" className="hover:text-black transition">Solutions</a>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md p-4 space-y-2 w-48">
              <a href="#" className="block text-sm hover:text-black">For Insurers</a>
              <a href="#" className="block text-sm hover:text-black">For Brokers</a>
              <a href="#" className="block text-sm hover:text-black">For Regulators</a>
            </div>
          </div>

          <a href="#" className="hover:text-black transition">Developers</a>
          <a href="#" className="hover:text-black transition">Pricing</a>
          <a href="#" className="hover:text-black transition">Docs</a>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Desktop actions */}
          <button className="p-2 text-gray-600 hover:text-black hidden md:inline-block">
            <Search className="w-5 h-5" />
          </button>
          <a href="/login" className="hidden md:inline-block text-sm font-medium text-gray-800 hover:text-black">
            Log in
          </a>
          <a
            href="/signup"
            className="hidden md:inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition"
          >
            Sign Up
          </a>

          {/* Mobile menu button (ONLY on small screens) */}
          <div className="md:hidden">
            <button
              className="p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden text-black bg-white border-t border-gray-200 px-6 py-4 space-y-4">
          <a href="#" className="block hover:text-black">Products</a>
          <a href="#" className="block hover:text-black">Solutions</a>
          <a href="#" className="block hover:text-black">Developers</a>
          <a href="#" className="block hover:text-black">Pricing</a>
          <a href="#" className="block hover:text-black">Docs</a>
          <div className="pt-4 border-t border-gray-200">
            <a href="#" className="block hover:text-black">Sign in</a>
            <a
              href="#"
              className="mt-2 block w-full text-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
