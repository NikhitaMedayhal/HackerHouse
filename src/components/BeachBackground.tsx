// Pixel-art helpers ---------------------------------------------------------
// Small utilities that build crisp, right-angle geometry (circles as pixel
// grids, waves as square "staircase" waveforms) instead of smooth curves —
// combined with shape-rendering="crispEdges" this reads as genuine 8-bit art
// instead of a blurry/anti-aliased approximation of one.

const SUN_PIXEL = 8;

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

// Builds a flat "SQUARE WAVE" path (horizontal + vertical segments only —
// no curves) so the ocean reads as pixel-water instead of a smooth sea.
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

// Stepped, hard-edged "pixel" drop shadow — several 1px-multiple offsets
// instead of a blurred box-shadow, so the letters look stamped rather than
// lit. Two tones: a near navy for the body of the shadow, a soft black for
// the trailing pixel underneath it.
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
      {/* Pull in a genuine bitmap face for the headline treatment */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

      {/* Sky — flat single-tone light blue */}
<div
  className="absolute inset-0"
  style={{
    background: "#9ED2E8",
  }}
/>

      {/* Sun — built from a bitmap of square cells, no border-radius/blur */}
      <div
        className="absolute right-24 top-16"
        style={{
          width: (HALO_RADIUS * 2 + 1) * SUN_PIXEL,
          height: (HALO_RADIUS * 2 + 1) * SUN_PIXEL,
          imageRendering: "pixelated",
        }}
      >
        {haloCells.map((c, i) => (
          <div
            key={`halo-${i}`}
            className="absolute"
            style={{
              left: (c.x + HALO_RADIUS) * SUN_PIXEL,
              top: (c.y + HALO_RADIUS) * SUN_PIXEL,
              width: SUN_PIXEL,
              height: SUN_PIXEL,
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
              left: (c.x + HALO_RADIUS) * SUN_PIXEL,
              top: (c.y + HALO_RADIUS) * SUN_PIXEL,
              width: SUN_PIXEL,
              height: SUN_PIXEL,
              background: c.y < -SUN_RADIUS / 3 ? "#FFFBEA" : "#FFEB9E",
            }}
          />
        ))}
      </div>

{/* Ocean — square-wave layers instead of curved swells */}      
      <div  style={{   
        position: "absolute",    
        bottom: "128px",    
        width: "100%",    
        height: "140px",    
        backgroundImage: "url('/tiles/water.png')",    
        backgroundRepeat: "repeat",    
        imageRendering: "pixelated",  }}
        />

      {/* Sand — crisp dither pattern instead of soft radial dots */}
      <div
  style={{
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "128px",
    backgroundImage: "url('/tiles/sand.png')",
    backgroundRepeat: "repeat",
    imageRendering: "pixelated",
  }}
/>
      {/* Welcome copy — sits on its own dark-green pixel card, not the sky */}
      <div
        className="absolute left-12 top-16 max-w-xl z-10"
        style={{
          background: "#1B6B4A",
          boxShadow: "4px 4px 0 #071F17, 8px 8px 0 rgba(0,0,0,0.35)",
          padding: "28px 32px",
          imageRendering: "pixelated",
        }}
      >
        <div
          className="mb-4"
          style={{
            color: "#F4EFDD",
            fontFamily: PIXEL_FONT,
            fontSize: "10px",
            lineHeight: 1.6,
            letterSpacing: "2px",
            textShadow: "2px 2px 0 #000",
          }}
        >
          HACKER HOUSE GOA · 2026
        </div>

        {/* Headline + badge live in one relative wrapper so the badge can
            sit tucked into the letterforms, echoing the reference layout */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              color: "#F5D949",
              fontFamily: PIXEL_FONT,
              fontSize: "34px",
              lineHeight: 1.9,
              letterSpacing: "2px",
              textShadow: PIXEL_TEXT_SHADOW,
              imageRendering: "pixelated",
            }}
          >
            WELCOME
            <br />
            TO GOA
          </div>

          {/* Pixel badge accent — jagged stepped border instead of a
              rounded pill, filled square corners instead of anti-aliased
              curves, tucked over the headline like a stamped sticker */}
          <div
            style={{
              position: "absolute",
              right: "-18px",
              top: "58px",
              transform: "rotate(-7deg)",
              background: "#EC4899",
              boxShadow: "3px 3px 0 #831843, 6px 6px 0 rgba(0,0,0,0.35)",
              clipPath:
                "polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))",
              padding: "10px 14px",
              imageRendering: "pixelated",
            }}
          >
            <span
              style={{
                color: "#FDF2F8",
                fontFamily: PIXEL_FONT,
                fontSize: "13px",
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
            fontSize: "11px",
            lineHeight: 1.8,
            letterSpacing: "0.5px",
            textShadow: "2px 2px 0 #000",
            maxWidth: "420px",
          }}
        >
          I see you've reached to HACKER HOUSE GOA! Congrats, but its ruled by humans :0, and everyone who knows humans know that they WILL welcome you, but only if you're one of them, so go shoo build your character card uh ahem sorry ID card and show 'em your a human too
        </div>
          <div className="press-enter" onClick={() => onEnter?.()}>
  ▶ PRESS ENTER
</div>
      </div>
    </div>
  );
}
