import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "StormSentinel AI — Multi-Hazard Risk Intelligence",
  description: "Global wildfire, storm, heat, and drought risk from a 7-head multi-task neural network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="scan-line" />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
