"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BeachBackground from "./BeachBackground";

const frames = [
  "/sprites/sprite_0.png",
  "/sprites/sprite_1.png",
  "/sprites/sprite_2.png",
  "/sprites/sprite_3.png",
];

const GROUND_HEIGHT = 80;

const STAR_COUNT = 80;

const POPUP_MESSAGE =
  "WHA-, where am I? Why is it so dark here? What is this strange golden thing in front of me? Oh oh wait I see, it's a character card! But its empty....Maybe I'm supposed to fill it?";

// how close (in px, sprite-center to passport-center) counts as "reached it"
const PASSPORT_TRIGGER_DISTANCE = 50;

type Star = { x: number; y: number; size: number; opacity: number };
type Scene = "intro" | "popup" | "beach";

export default function Intro() {
  const router = useRouter();
  // Start at 0 on both server and client so the first render always matches.
  const [x, setX] = useState<number>(0);
  const [frame, setFrame] = useState<number>(0);
  const [moving, setMoving] = useState<boolean>(false);
  // Stars are generated client-side only, after mount — Math.random() at
  // module/render scope causes a server/client HTML mismatch (hydration error).
  const [stars, setStars] = useState<Star[]>([]);

  const [scene, setScene] = useState<Scene>("intro");
  // Track whether the popup has already fired so walking back and forth
  // over the passport doesn't re-trigger it.
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    setX(window.innerWidth - 128);
    setStars(
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4,
      }))
    );
  }, []);

  // Movement + popup input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scene === "popup") {
        if (e.key === "Enter") {
          router.push("/beach");
        }
        return;
      }

      if (scene !== "intro") return;

      if (e.key === "ArrowRight") {
        setMoving(true);
        setX((prev) => Math.min(prev + 8, window.innerWidth - 128));
      }

      if (e.key === "ArrowLeft") {
        setMoving(true);
        setX((prev) => Math.max(prev - 8, 0));
      }
    };

    const handleKeyUp = () => {
      setMoving(false);
      setFrame(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scene]);

  useEffect(() => {
    if (!moving || scene !== "intro") return;

    const interval = window.setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 120);

    return () => window.clearInterval(interval);
  }, [moving, scene]);

  // Collision check: has the sprite reached the buried passport?
  useEffect(() => {
    if (scene !== "intro" || hasTriggeredRef.current) return;
    if (typeof window === "undefined") return;

    const passportCenter = window.innerWidth / 2;
    const spriteCenter = x + 64; // sprite is 128px wide

    if (Math.abs(spriteCenter - passportCenter) <= PASSPORT_TRIGGER_DISTANCE) {
      hasTriggeredRef.current = true;
      setMoving(false);
      setFrame(0);
      setScene("popup");
    }
  }, [x, scene]);

  if (scene === "beach") {
    return (
      <div className="relative h-screen overflow-hidden">
        <BeachBackground />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-[#04030a] via-[#09101c] to-[#121212]">
      {/* ⭐ Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* ✨ Title */}
      <div
        className="absolute left-1/2 top-24 -translate-x-1/2 text-center z-10"
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#ffd700",
          textShadow: `
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 40px rgba(255, 195, 0, 0.5),
            0 0 80px rgba(255, 180, 0, 0.3)
          `,
          fontFamily: "serif",
          letterSpacing: "2px",
        }}
      >
        Make Your Identity
      </div>

      {/* 🌕 Moon */}
      <div
        className="absolute right-24 top-16 h-24 w-24 rounded-full bg-yellow-100 opacity-90"
        style={{
          boxShadow: "0 0 60px rgba(255,255,180,.6)",
        }}
      />

      {/* 👤 Player */}
      <Image
        src={frames[frame]}
        alt="Builder"
        width={128}
        height={128}
        className="absolute"
        style={{
          left: `${x}px`,
          bottom: `${GROUND_HEIGHT}px`,
          imageRendering: "pixelated",
          zIndex: 5,
        }}
      />

      {/* 📔 Buried Passport */}
      <div
        className="absolute rounded-[3px]"
        style={{
          left: "50%",
          bottom: "65px", // partially overlaps the ground strip (0–80px) so it reads as half-buried
          width: "44px",
          height: "30px",
          transform: "translateX(-50%) rotate(-9deg)",
          background: "linear-gradient(160deg, #f5d576 0%, #d4a72c 55%, #a97e1a 100%)",
          border: "1px solid #8a6414",
          boxShadow: `
            0 0 6px rgba(255, 215, 0, 0.7),
            0 0 14px rgba(255, 195, 0, 0.5),
            0 0 28px rgba(255, 180, 0, 0.35)
          `,
        }}
      >
        {/* simple emblem to read as a passport crest */}
        <div
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "40%",
            width: "12px",
            height: "12px",
            transform: "translate(-50%, -50%)",
            border: "1px solid #6b4d10",
            opacity: 0.7,
          }}
        />
      </div>

      {/* 🌍 Ground */}
      <div
        className="absolute bottom-0 h-20 w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg,#1b1b1b 0px,#1b1b1b 16px,#262626 16px,#262626 32px)",
        }}
      />

      {/* 💬 Dialogue popup */}
      {scene === "popup" && (
        <div
          className="absolute inset-0 z-20 flex justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <div
            className="mt-32 w-[min(420px,85vw)] p-4"
            style={{
              background: "#12100a",
              border: "4px solid #100c05",
              borderRadius: 0,
              imageRendering: "pixelated",
              boxShadow: `
                0 0 0 4px #d4a72c,
                0 0 0 8px #100c05,
                6px 6px 0 0 #100c05,
                0 0 24px rgba(255, 195, 0, 0.35),
                0 0 60px rgba(255, 180, 0, 0.15)
              `,
            }}
          >
            <p
              style={{
                color: "#f5d576",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                fontSize: "13px",
                lineHeight: 1.6,
                letterSpacing: "0.5px",
                margin: 0,
                textShadow: "2px 2px 0 #000",
              }}
            >
              {POPUP_MESSAGE}
            </p>
            <p
              className="mt-3 text-right"
              style={{
                color: "#ffd700",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
                textShadow: "1px 1px 0 #000",
                animation: "pulse 1s steps(1) infinite",
              }}
            >
              ▶ Press Enter to continue
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}