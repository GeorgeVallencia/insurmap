'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white fixed top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-black">Albitross</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <Link 
            href="/#features" 
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Features
          </Link>
          <Link 
            href="/pricing"
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Pricing
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Log in
          </Link>
          <Link
            href="/contact"  // Or use your Calendly link directly if preferred
            className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition"
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-5">
          <Link 
            href="/#features" 
            className="block text-base font-medium text-gray-700 hover:text-black"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="/pricing"
            className="block text-base font-medium text-gray-700 hover:text-black"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            href="/about" 
            className="block text-base font-medium text-gray-700 hover:text-black"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="block text-base font-medium text-gray-700 hover:text-black"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <Link 
              href="/login" 
              className="block text-base font-medium text-gray-700 hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/contact"  // Or your Calendly link
              className="block w-full text-center px-5 py-3 bg-black text-white text-base font-medium rounded-lg hover:bg-gray-900 transition"
              onClick={() => setMobileOpen(false)}
            >
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}