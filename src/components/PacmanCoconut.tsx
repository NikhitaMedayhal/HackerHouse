"use client";

export default function PacmanCoconut() {
  return (
    <div className="pacman-scene" aria-hidden="true">
      <img src="/pacman.png" alt="" className="pacman" />
      <img src="/coconut.png" alt="" className="coconut" />

      <style jsx>{`
        .pacman-scene {
          position: relative;
          width: 100%;
          height: 110px;
          margin-top: 25px;
          overflow: hidden;
          container-type: inline-size;
        }

        .pacman,
        .coconut {
          position: absolute;
          top: 50%;
          left: 0;
          object-fit: contain;
          image-rendering: pixelated;
          will-change: transform;
        }

        .pacman {
          width: clamp(52px, 18cqw, 78px);
          height: clamp(52px, 18cqw, 78px);
          z-index: 2;
          transform: translate(20cqw, -50%) scaleX(1);
          animation: chase 2.5s infinite steps(8);
        }

        .coconut {
          width: clamp(26px, 9cqw, 38px);
          height: clamp(26px, 9cqw, 38px);
          z-index: 1;
          transform: translate(60cqw, -50%);
          animation: nibble 2.5s infinite steps(8);
        }

        @keyframes chase {
          0% {
            transform: translate(20cqw, -50%) scaleX(1);
          }
          50% {
            transform: translate(60cqw, -50%) scaleX(1);
          }
          62.5% {
            transform: translate(60cqw, -50%) scaleX(-1);
          }
          100% {
            transform: translate(20cqw, -50%) scaleX(-1);
          }
        }

        /* Coconut stays put; it just fades out while Pac-Man is
           overlapping it, then fades back in for the next loop. */
        @keyframes nibble {
          0%,
          37.5% {
            opacity: 1;
          }
          50%,
          75% {
            opacity: 0;
          }
          87.5%,
          100% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pacman,
          .coconut {
            animation: none;
          }
          .pacman {
            transform: translate(60cqw, -50%) scaleX(1);
          }
          .coconut {
            transform: translate(60cqw, -50%);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}