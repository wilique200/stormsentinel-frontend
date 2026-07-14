"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BrandHeader } from "@/components/BrandHeader";

export default function SignupPage() {
  const { signup, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setIsSubmitting(true);
  setLocalError?.(null);        // if you have localError

  try {
    await login(email, password);     // or signup(...)
    // If we reach here, success — redirect happens in context
  } catch (err) {
    console.error(err);
    // Do nothing — error is handled in context
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-base-void">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <BrandHeader size="large" />
        </div>

        <div className="bg-base-panel border border-base-line rounded-xl p-6">
          <h1 className="font-display text-lg font-semibold tracking-wide text-center mb-1">
            Create an account
          </h1>
          <p className="font-body text-xs text-base-muted text-center mb-6">
            Global wildfire, storm, heat &amp; drought risk — free
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-display text-[11px] tracking-widest text-base-muted block mb-1.5">
                NAME <span className="text-base-faint">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/30 border border-base-line rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="font-display text-[11px] tracking-widest text-base-muted block mb-1.5">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-base-line rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="font-display text-[11px] tracking-widest text-base-muted block mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-base-line rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <div className="bg-hazard-heat/10 border border-hazard-heat/30 rounded-lg px-3 py-2">
                <p className="font-body text-xs text-hazard-heat">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-display font-semibold tracking-widest text-sm py-2.5 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)" }}
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>

        <p className="font-body text-xs text-base-muted text-center mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-hazard-thunderstorm hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
