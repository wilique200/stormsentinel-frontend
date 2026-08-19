"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BrandHeader } from "@/components/BrandHeader";

export default function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // error state is already set by AuthContext — nothing else to do here
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
            Sign in
          </h1>
          <p className="font-body text-xs text-base-muted text-center mb-6">
            Check risk anywhere on Earth — sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-base-line rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
                placeholder="••••••••"
              />
            </div>

            {(error || localError) && (
              <div className="bg-hazard-heat/10 border border-hazard-heat/30 rounded-lg px-3 py-2">
                <p className="font-body text-xs text-hazard-heat">{error || localError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-display font-semibold tracking-widest text-sm py-2.5 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)" }}
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="font-body text-xs text-base-muted text-center mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-hazard-thunderstorm hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
