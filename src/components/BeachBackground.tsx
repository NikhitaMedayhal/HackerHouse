function buildCircleCells(radius: number) {
  const cells: { x: number; y: number }[] = [];
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= radius * radius + radius * 0.4) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}

const SUN_RADIUS = 7;
const HALO_RADIUS = 10;
const sunCells = buildCircleCells(SUN_RADIUS);
const haloCells = buildCircleCells(HALO_RADIUS).filter(
  (c) => !sunCells.some((s) => s.x === c.x && s.y === c.y)
);

function buildSquareWavePath(
  width: number,
  bottom: number,
  baseY: number,
  amp: number,
  step: number
) {
  let d = `M0,${bottom} L0,${baseY}`;
  let up = true;
  for (let x = step; x <= width; x += step) {
    const y = up ? baseY - amp : baseY + amp;
    d += ` L${x},${y}`;
    up = !up;
  }
  d += ` L${width},${bottom} Z`;
  return d;
}

const WAVE_WIDTH = 1440;

const PIXEL_FONT = "'Press Start 2P', 'Courier New', Courier, monospace";

const PIXEL_TEXT_SHADOW = [
  "2px 0 0 #133A5C",
  "0 2px 0 #133A5C",
  "2px 2px 0 #133A5C",
  "4px 2px 0 #133A5C",
  "2px 4px 0 #133A5C",
  "4px 4px 0 #133A5C",
  "6px 6px 0 rgba(0,0,0,0.4)",
].join(", ");

export default function BeachBackground({
  onEnter,
}: {
  onEnter?: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0F3D2E]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

<div
  className="absolute inset-0"
  style={{
    background: "#9ED2E8",
  }}
/>

      <div
        className="absolute"
        style={{
          right: "clamp(12px, 6vw, 96px)",
          top: "clamp(12px, 5vh, 64px)",
          // @ts-expect-error -- CSS custom property, not a known CSSProperties key
          "--sun-px": "clamp(4px, 1.6vw, 8px)",
          width: `calc(${HALO_RADIUS * 2 + 1} * var(--sun-px))`,
          height: `calc(${HALO_RADIUS * 2 + 1} * var(--sun-px))`,
          imageRendering: "pixelated",
        }}
      >
        {haloCells.map((c, i) => (
          <div
            key={`halo-${i}`}
            className="absolute"
            style={{
              left: `calc(${c.x + HALO_RADIUS} * var(--sun-px))`,
              top: `calc(${c.y + HALO_RADIUS} * var(--sun-px))`,
              width: "var(--sun-px)",
              height: "var(--sun-px)",
              background: "#FFF3C4",
              opacity: 0.22,
            }}
          />
        ))}
        {sunCells.map((c, i) => (
          <div
            key={`sun-${i}`}
            className="absolute"
            style={{
              left: `calc(${c.x + HALO_RADIUS} * var(--sun-px))`,
              top: `calc(${c.y + HALO_RADIUS} * var(--sun-px))`,
              width: "var(--sun-px)",
              height: "var(--sun-px)",
              background: c.y < -SUN_RADIUS / 3 ? "#FFFBEA" : "#FFEB9E",
            }}
          />
        ))}
      </div>

  <div
    className="wave-layer"
    style={{
      position: "absolute",
      bottom: "128px",
      width: "100%",
      height: "140px",
      backgroundImage: "url('/tiles/wave-user.png')",
      backgroundRepeat: "repeat",
      backgroundSize: "60px 60px",
      imageRendering: "pixelated",
    }}
  />
      
      <div
  style={{
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "128px",
    backgroundImage: "url('/tiles/sand-beach.png')",
    backgroundRepeat: "repeat",
    imageRendering: "pixelated",
  }}
/>
      <div
        className="absolute z-10"
        style={{
          left: "clamp(16px, 6vw, 48px)",
          top: "clamp(16px, 6vh, 64px)",
          width: "min(88vw, 576px)",
          background: "#1B6B4A",
          boxShadow: "4px 4px 0 #071F17, 8px 8px 0 rgba(0,0,0,0.35)",
          padding: "clamp(20px, 5vw, 36px) clamp(18px, 5vw, 32px) clamp(28px, 7vw, 44px)",
          imageRendering: "pixelated",
          boxSizing: "border-box",
        }}
      >
        <div
          className="mb-4"
          style={{
            color: "#F4EFDD",
            fontFamily: PIXEL_FONT,
            fontSize: "clamp(8px, 2.2vw, 10px)",
            lineHeight: 1.6,
            letterSpacing: "2px",
            textShadow: "2px 2px 0 #000",
          }}
        >
          HACKER HOUSE GOA · 2026
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              color: "#F5D949",
              fontFamily: PIXEL_FONT,
              fontSize: "clamp(20px, 6.5vw, 34px)",
              lineHeight: 1.35,
              letterSpacing: "2px",
              textShadow: PIXEL_TEXT_SHADOW,
              imageRendering: "pixelated",
            }}
          >
            WELCOME
            <br />
            TO GOA
          </div>

          <div
            style={{
              position: "absolute",
              right: "-4%",
              top: "62%",
              transform: "rotate(-7deg)",
              background: "#EC4899",
              boxShadow: "3px 3px 0 #831843, 6px 6px 0 rgba(0,0,0,0.35)",
              clipPath:
                "polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))",
              padding: "clamp(6px, 1.6vw, 10px) clamp(8px, 2.2vw, 14px)",
              imageRendering: "pixelated",
            }}
          >
            <span
              style={{
                color: "#FDF2F8",
                fontFamily: PIXEL_FONT,
                fontSize: "clamp(9px, 2.6vw, 13px)",
                letterSpacing: "1px",
              }}
            >
              गोवा
            </span>
          </div>
        </div>

        <div
          className="mt-6"
          style={{
            color: "#F4EFDD",
            fontFamily: PIXEL_FONT,
            fontSize: "clamp(9px, 2.6vw, 11px)",
            lineHeight: 1.8,
            letterSpacing: "0.5px",
            textShadow: "2px 2px 0 #000",
            maxWidth: "100%",
          }}
        >
          I see you've reached to HACKER HOUSE GOA! Congrats, but its ruled by humans :0, and everyone who knows humans know that they WILL welcome you, but only if you're one of them, so go shoo build your character card uh ahem sorry ID card and show 'em your a human too
        </div>
          <div
            className="press-enter"
            onClick={() => onEnter?.()}
            style={{
              marginTop: "clamp(28px, 8vw, 44px)",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "clamp(10px, 2.8vw, 13px)",
              color: "#F4EFDD",
            }}
          >
               ▶ CLICK HERE
          </div>
      </div>
      <style jsx>{`
        @keyframes wave-scroll {
          from { background-position: 0 0; }
          to { background-position: -60px 0; }
        }
        .wave-layer {
          animation: wave-scroll 1.6s steps(4) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}