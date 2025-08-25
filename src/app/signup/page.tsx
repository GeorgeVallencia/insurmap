
"use client";

import { useState } from "react";

type Role =
  | "UNDERWRITER"
  | "BROKER"
  | "INSURER"
  | "CLAIMS"
  | "REINSURER";

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitSignup(payload: Record<string, any>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      window.location.href = "/dashboard"; // success → redirect
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side Info */}
        <div className="p-10 bg-black text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">Create your account</h1>
          <p className="text-lg mb-6">
            Join our platform for insurers, underwriters, brokers, agents, 
            claims managers, and reinsurers. 
          </p>
          <ul className="space-y-3 text-sm">
            <li>✔ Manage underwriting seamlessly</li>
            <li>✔ Streamline claims processing</li>
            <li>✔ Connect with insurers & reinsurers</li>
          </ul>
        </div>

        {/* Right Side Form */}
        <div className="p-10 text-black">
          {!role ? (
            <>
              <h2 className="text-xl font-semibold mb-4">I am signing up as:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["UNDERWRITER", "BROKER", "INSURER", "CLAIMS MANAGER", "REINSURER"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r as Role)}
                    className="p-4 border rounded-xl hover:text-white hover:bg-black"
                  >
                    {r === "BROKER" ? "Broker / Agent" : r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <Form role={role} goBack={() => setRole(null)} onSubmit={submitSignup} loading={loading} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}

// Dynamic Form Component
function Form({
  role,
  goBack,
  onSubmit,
  loading,
  error,
}: {
  role: Role;
  goBack: () => void;
  onSubmit: (payload: Record<string, any>) => void;
  loading: boolean;
  error: string | null;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.role = role;
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button type="button" onClick={goBack} className="text-blue-600 text-sm underline mb-2">
        ← Choose another role
      </button>

      {/* Error Display */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Common Fields */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input name="fullName" type="text" required placeholder="John Doe" className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" required placeholder="john@workmail.com" className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Username</label>
        <input name="username" type="text" required placeholder="Choose a username" className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input name="password" type="password" required placeholder="Create a password" className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      {/* Role-specific Fields */}
      {role === "UNDERWRITER" && (
        <>
          <div>
            <label className="block text-sm font-medium">Specialty Line</label>
            <select name="specialtyLine" required className="mt-1 block w-full rounded-md border px-3 py-2">
              <option value="">Select one</option>
              <option>General</option>
              <option>Life</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Years of Experience</label>
            <input name="yearsExp" type="number" required className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
        </>
      )}

      {role === "BROKER" && (
        <div>
          <label className="block text-sm font-medium">Organization Name</label>
          <input name="organization" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2" />
        </div>
      )}

      {role === "INSURER" && (
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input name="organization" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2" />
        </div>
      )}

      {role === "CLAIMS" && (
        <>
          <div>
            <label className="block text-sm font-medium">Organization</label>
            <input name="organization" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Avg. Claims per Month</label>
            <input name="avgClaimsPerMonth" type="number" required className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
        </>
      )}

      {role === "REINSURER" && (
        <>
          <div>
            <label className="block text-sm font-medium">Reinsurance Company</label>
            <input name="organization" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select name="reinsurerType" required className="mt-1 block w-full rounded-md border px-3 py-2">
              <option value="">Select type</option>
              <option>Treaty</option>
              <option>Facultative</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-black text-white py-2 rounded-md hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 font-medium">Log in</a>
      </p>
    </form>
  );
}

