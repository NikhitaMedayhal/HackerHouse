"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BeachBackground from "@/components/BeachBackground";

export default function BeachPage() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        router.push("/builder");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className="relative h-screen overflow-hidden">
      <BeachBackground onEnter={() => router.push("/builder")} />
    </div>
  );
}