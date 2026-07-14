"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/BrandHeader";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }

    // Dynamic greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-void">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-base-void text-white p-6 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <BrandHeader/>   // or just remove the size prop if it defaults nicely
          <button
            onClick={logout}
            className="px-5 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <h1 className="text-4xl font-display font-bold mb-2">
          {greeting}, {user.display_name || user.email.split("@")[0]}!
        </h1>
        <p className="text-base-muted text-lg mb-12">
          StormSentinel AI — Multi-Hazard Risk Intelligence
        </p>

        {/* Quick Stats / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-panel border border-base-line rounded-2xl p-6">
            <div className="text-hazard-thunderstorm text-sm font-medium mb-1">GLOBAL RISK</div>
            <div className="text-5xl font-display font-bold">MODERATE</div>
            <div className="text-xs text-base-muted mt-4">Last updated just now</div>
          </div>

          <div className="bg-base-panel border border-base-line rounded-2xl p-6">
            <div className="text-hazard-heat text-sm font-medium mb-1">WILDFIRES</div>
            <div className="text-5xl font-display font-bold">12</div>
            <div className="text-xs text-base-muted mt-4">Active hotspots detected</div>
          </div>

          <div className="bg-base-panel border border-base-line rounded-2xl p-6">
            <div className="text-hazard-storm text-sm font-medium mb-1">STORMS</div>
            <div className="text-5xl font-display font-bold">3</div>
            <div className="text-xs text-base-muted mt-4">Potential threats</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-base-panel border border-base-line rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Your Risk Overview</h2>
          <p className="text-base-muted mb-8">
            Connect your location or search any place on Earth to get real-time multi-hazard risk intelligence.
          </p>
          
          {/* Placeholder for future map / prediction components */}
          <div className="bg-black/40 border border-dashed border-base-line rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-base-muted">Interactive Map &amp; Predictions coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
