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

const UFO_SRC = "/sprites/ufo.png";
const UFO_WIDTH = 140;
const UFO_HEIGHT = 70;
const UFO_TOP = "16vh"; 

const GROUND_HEIGHT = 80;
const STAR_COUNT = 80;
const MOVE_SPEED = 8; 
const MOVE_INTERVAL = 16; 
const POPUP_MESSAGE =
  "WHA-, where am I? Why is it so dark here? What is this strange golden thing in front of me? Oh oh wait I see, it's a character card! But its empty....Maybe I'm supposed to fill it?";

const HINT_MESSAGE =
  "What do you think that golden card sticking out is? Walk towards it...";

const PASSPORT_TRIGGER_DISTANCE = 50;

type Star = { x: number; y: number; size: number; opacity: number };
type Scene = "intro" | "popup" | "beach";
type Direction = -1 | 0 | 1;
type EntryPhase = "flyIn" | "hover" | "beamDown" | "flyOut" | "done";

export default function Intro() {
  const router = useRouter();
  const [x, setX] = useState<number>(0);
  const [frame, setFrame] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>(0);
  const [stars, setStars] = useState<Star[]>([]);

  const [scene, setScene] = useState<Scene>("intro");
  const hasTriggeredRef = useRef(false);

  // 🛸 UFO entry cinematic state
  const [entryPhase, setEntryPhase] = useState<EntryPhase>("flyIn");
  const [ufoX, setUfoX] = useState<number>(-UFO_WIDTH * 2); 
  const [beamOn, setBeamOn] = useState(false);
  const [playerDropped, setPlayerDropped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const spawnXRef = useRef<number>(0);

  const moving = direction !== 0;
  const controlsEnabled = scene === "intro" && entryPhase === "done";

  useEffect(() => {
    const spawnX = window.innerWidth - 128;
    spawnXRef.current = spawnX;
    setX(spawnX);
    setStars(
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4,
      }))
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setX((prev) => Math.min(prev, window.innerWidth - 128));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timers: number[] = [];
    const spawnX = spawnXRef.current || window.innerWidth - 128;
    const ufoTargetX = spawnX + 64 - UFO_WIDTH / 2; 

    timers.push(
      window.setTimeout(() => {
        setUfoX(ufoTargetX);
      }, 50)
    );

    timers.push(
      window.setTimeout(() => {
        setEntryPhase("hover");
      }, 3250)
    );

    timers.push(
      window.setTimeout(() => {
        setEntryPhase("beamDown");
        setBeamOn(true);
      }, 3700)
    );

    timers.push(
      window.setTimeout(() => {
        setPlayerDropped(true);
      }, 4000)
    );

    timers.push(
      window.setTimeout(() => {
        setBeamOn(false);
      }, 4800)
    );

    timers.push(
      window.setTimeout(() => {
        setEntryPhase("flyOut");
        setUfoX(window.innerWidth + UFO_WIDTH * 2);
      }, 5200)
    );

    timers.push(
      window.setTimeout(() => {
        setEntryPhase("done");
      }, 8200)
    );

    timers.push(
      window.setTimeout(() => {
        setShowHint(true);
      }, 8800)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const goToBeach = () => router.push("/beach");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scene === "popup") {
        if (e.key === "Enter") goToBeach();
        return;
      }

      if (!controlsEnabled) return;

      if (e.key === "ArrowRight") setDirection(1);
      if (e.key === "ArrowLeft") setDirection(-1);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setDirection(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scene, controlsEnabled]);

  
  useEffect(() => {
    if (!controlsEnabled || direction === 0) return;

    const interval = window.setInterval(() => {
      setX((prev) => {
        const next = prev + direction * MOVE_SPEED;
        return Math.min(Math.max(next, 0), window.innerWidth - 128);
      });
    }, MOVE_INTERVAL);

    return () => window.clearInterval(interval);
  }, [direction, controlsEnabled]);

  useEffect(() => {
    if (!moving || !controlsEnabled) {
      setFrame(0);
      return;
    }

    const interval = window.setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 120);

    return () => window.clearInterval(interval);
  }, [moving, controlsEnabled]);

  useEffect(() => {
    if (direction !== 0 && showHint) {
      setShowHint(false);
    }
  }, [direction, showHint]);

  useEffect(() => {
    if (scene !== "intro" || !controlsEnabled || hasTriggeredRef.current) return;
    if (typeof window === "undefined") return;

    const passportCenter = window.innerWidth / 2;
    const spriteCenter = x + 64; // sprite is 128px wide

    if (Math.abs(spriteCenter - passportCenter) <= PASSPORT_TRIGGER_DISTANCE) {
      hasTriggeredRef.current = true;
      setDirection(0);
      setFrame(0);
      setScene("popup");
    }
  }, [x, scene, controlsEnabled]);

  if (scene === "beach") {
    return (
      <div className="relative h-screen overflow-hidden">
        <BeachBackground />
      </div>
    );
  }

  return (
    <div
      className="intro-root relative overflow-hidden bg-gradient-to-b from-[#04030a] via-[#09101c] to-[#121212]"
      style={{ touchAction: "none" }}
    >
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

      <div
        className="absolute left-1/2 top-12 sm:top-24 -translate-x-1/2 text-center z-10 px-4"
        style={{
          fontSize: "clamp(22px, 7vw, 48px)",
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
          whiteSpace: "nowrap",
        }}
      >
        Make Your Identity
      </div>

      <div
        className="absolute rounded-full bg-yellow-100 opacity-90"
        style={{
          right: "clamp(16px, 6vw, 96px)",
          top: "clamp(12px, 4vw, 64px)",
          width: "clamp(48px, 14vw, 96px)",
          height: "clamp(48px, 14vw, 96px)",
          boxShadow: "0 0 60px rgba(255,255,180,.6)",
        }}
      />

      {entryPhase !== "done" && (
        <Image
          src={UFO_SRC}
          alt="UFO"
          width={UFO_WIDTH}
          height={UFO_HEIGHT}
          priority
          className="absolute z-20"
          style={{
            left: `${ufoX}px`,
            top: UFO_TOP,
            width: "clamp(84px, 24vw, 140px)",
            height: "clamp(42px, 12vw, 70px)",
            imageRendering: "pixelated",
            transition:
              entryPhase === "flyOut"
                ? "left 3s cubic-bezier(0.55,0,1,0.45)"
                : "left 3.2s cubic-bezier(0.34,1.56,0.64,1)",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
          }}
        />
      )}

      {entryPhase !== "done" && (
        <div
          className="absolute z-10"
          style={{
            left: `${ufoX + UFO_WIDTH / 2 - 45}px`,
            top: `calc(${UFO_TOP} + ${UFO_HEIGHT - 10}px)`,
            width: "clamp(56px, 16vw, 90px)",
            height: beamOn ? "clamp(160px, 34vh, 260px)" : "0px",
            background:
              "linear-gradient(180deg, rgba(255,241,168,0.65) 0%, rgba(255,241,168,0.25) 55%, rgba(255,241,168,0) 100%)",
            clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
            transition: "height 0.4s ease-out, left 3.2s cubic-bezier(0.34,1.56,0.64,1)",
            pointerEvents: "none",
            opacity: beamOn ? 1 : 0,
          }}
        />
      )}

      <Image
        src={frames[frame]}
        alt="Builder"
        width={128}
        height={128}
        priority
        className="absolute"
        style={{
          left: `${x}px`,
          bottom: `${GROUND_HEIGHT}px`,
          width: "clamp(80px, 22vw, 128px)",
          height: "clamp(80px, 22vw, 128px)",
          imageRendering: "pixelated",
          zIndex: 5,
          opacity: playerDropped ? 1 : 0,
          transform: playerDropped
            ? "translateY(0) scale(1)"
            : "translateY(-50px) scale(0.6)",
          transition:
            "opacity 0.35s ease-out, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 text-center z-10 px-6"
        style={{
          bottom: "clamp(170px, 26vh, 210px)",
          width: "min(80vw, 420px)",
          color: "rgba(245, 213, 118, 0.75)",
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 700,
          fontSize: "clamp(10px, 3vw, 14px)",
          lineHeight: 1.5,
          letterSpacing: "0.5px",
          textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
          opacity: showHint ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          pointerEvents: "none",
        }}
      >
        {HINT_MESSAGE}
      </div>

      <div
        className="absolute rounded-[3px]"
        style={{
          left: "50%",
          bottom: "65px", 
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

      <div
        className="absolute bottom-0 h-20 w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg,#1b1b1b 0px,#1b1b1b 16px,#262626 16px,#262626 32px)",
        }}
      />

      {controlsEnabled && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-4 sm:gap-5 select-none"
          style={{ touchAction: "none" }}
        >
          <button
            aria-label="Move left"
            onPointerDown={(e) => {
              e.preventDefault();
              setDirection(-1);
            }}
            onPointerUp={() => setDirection(0)}
            onPointerLeave={() => setDirection(0)}
            onPointerCancel={() => setDirection(0)}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center justify-center rounded-full text-2xl font-bold text-[#ffd700] active:scale-95"
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(18,16,10,0.85)",
              border: "2px solid #d4a72c",
              boxShadow: "0 0 12px rgba(255,195,0,0.35)",
              WebkitTouchCallout: "none",
            }}
          >
            ◀
          </button>
          <button
            aria-label="Move right"
            onPointerDown={(e) => {
              e.preventDefault();
              setDirection(1);
            }}
            onPointerUp={() => setDirection(0)}
            onPointerLeave={() => setDirection(0)}
            onPointerCancel={() => setDirection(0)}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center justify-center rounded-full text-2xl font-bold text-[#ffd700] active:scale-95"
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(18,16,10,0.85)",
              border: "2px solid #d4a72c",
              boxShadow: "0 0 12px rgba(255,195,0,0.35)",
              WebkitTouchCallout: "none",
            }}
          >
            ▶
          </button>
        </div>
      )}

      {scene === "popup" && (
        <div
          className="absolute inset-0 z-20 flex justify-center px-4"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={goToBeach}
        >
          <div
            className="mt-36 sm:mt-48 w-[min(420px,90vw)] p-4 h-fit"
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToBeach();
              }}
              className="mt-3 w-full text-right"
              style={{
                color: "#ffd700",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow: "1px 1px 0 #000",
                animation: "pulse 1s steps(1) infinite",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ▶ Tap to continue
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .intro-root {
          /* iOS Safari < 15.4 doesn't understand 100dvh and ignores the
             whole declaration, so it falls back to this 100vh first.
             Browsers that DO understand dvh apply it and override the vh
             line, avoiding the address-bar resize jump. */
          height: 100vh;
          height: 100dvh;
        }
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