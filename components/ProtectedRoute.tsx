"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-base-void">
        <p className="font-display text-base-muted tracking-widest text-sm">LOADING...</p>
      </main>
    );
  }

  if (!user) {
    return null; // redirect is in flight
  }

  return <>{children}</>;
}
