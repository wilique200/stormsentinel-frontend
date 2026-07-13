"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-void">
      <p className="font-display text-base-muted tracking-widest text-sm">
        LOADING STORMSENTINEL AI...
      </p>
    </main>
  );
}
