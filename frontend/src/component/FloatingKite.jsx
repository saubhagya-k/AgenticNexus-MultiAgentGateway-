import React from "react";

/**
 * FloatingKite
 * ------------------------------------------------------------
 * A decorative, absolutely-positioned overlay of a black kite that
 * drifts around the screen with a smooth, organic path and has a
 * tail that waves independently, like it's catching the wind.
 *
 * Usage:
 *   <FloatingKite />                         // sensible defaults
 *   <FloatingKite size={140} duration={26} top="10%" left="5%" />
 *
 * Drop it anywhere inside a `position: relative` (or static, it'll
 * just anchor to the viewport/nearest positioned ancestor) wrapper.
 * It has pointer-events: none so it never blocks clicks/scroll on
 * the content underneath, and its background is fully transparent.
 */

const FloatingKite = ({
  size = 120,
  duration = 22,
  delay = 0,
  top = "15%",
  left = "10%",
  color = "#111111",
  opacity = 0.9,
  zIndex = 40,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size * 1.6,
        pointerEvents: "none",
        background: "transparent",
        zIndex,
        animation: `kite-drift ${duration}s ease-in-out ${delay}s infinite`,
        willChange: "transform",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.15))",
      }}
    >
      <svg
        viewBox="0 0 200 320"
        width="100%"
        height="100%"
        style={{
          overflow: "visible",
          display: "block",
          animation: `kite-sway ${duration * 0.55}s ease-in-out ${delay}s infinite`,
          transformOrigin: "50% 20%",
        }}
      >
        {/* Cross spars */}
        <line
          x1="100"
          y1="10"
          x2="100"
          y2="150"
          stroke={color}
          strokeWidth="2"
          opacity={opacity * 0.5}
        />
        <line
          x1="25"
          y1="70"
          x2="175"
          y2="70"
          stroke={color}
          strokeWidth="2"
          opacity={opacity * 0.5}
        />

        {/* Kite body (diamond) */}
        <polygon
          points="100,10 175,70 100,150 25,70"
          fill={color}
          opacity={opacity}
        />

        {/* Center bridle line down to the tail */}
        <line
          x1="100"
          y1="150"
          x2="100"
          y2="175"
          stroke={color}
          strokeWidth="2"
          opacity={opacity * 0.6}
        />

        {/* Waving tail: a wavy spine plus little bow ribbons */}
        <path
          className="kite-tail"
          d="M100,175
             Q 115,195 100,215
             Q 85,235 100,255
             Q 115,275 100,295
             Q 85,315 100,330"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          opacity={opacity * 0.85}
          strokeLinecap="round"
        />

        {/* Bows along the tail */}
        {[195, 235, 275, 315].map((cy, i) => (
          <g
            key={i}
            className="kite-bow"
            style={{
              transformOrigin: `100px ${cy}px`,
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <polygon
              points={`100,${cy - 8} 92,${cy} 100,${cy + 8} 108,${cy}`}
              fill={color}
              opacity={opacity * 0.75}
            />
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes kite-drift {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          20%  { transform: translate(28px, -34px) rotate(4deg); }
          40%  { transform: translate(-18px, -60px) rotate(-3deg); }
          60%  { transform: translate(-40px, -18px) rotate(-6deg); }
          80%  { transform: translate(14px, 24px) rotate(3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }

        @keyframes kite-sway {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(6deg); }
          50%  { transform: rotate(-4deg); }
          75%  { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }

        .kite-tail {
          animation: tail-wave 2.6s ease-in-out infinite;
          transform-origin: 100px 175px;
        }

        @keyframes tail-wave {
          0%   { d: path("M100,175 Q 115,195 100,215 Q 85,235 100,255 Q 115,275 100,295 Q 85,315 100,330"); }
          50%  { d: path("M100,175 Q 85,195 100,215 Q 115,235 100,255 Q 85,275 100,295 Q 115,315 100,330"); }
          100% { d: path("M100,175 Q 115,195 100,215 Q 85,235 100,255 Q 115,275 100,295 Q 85,315 100,330"); }
        }

        .kite-bow {
          animation: bow-flutter 1.4s ease-in-out infinite;
        }

        @keyframes bow-flutter {
          0%, 100% { transform: rotate(-8deg) scale(1); }
          50%      { transform: rotate(8deg) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          div[aria-hidden="true"] {
            animation: none !important;
          }
          svg, .kite-tail, .kite-bow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingKite;

/**
 * Example: overlay usage on an existing page
 * ------------------------------------------------------------
 * export default function App() {
 *   return (
 *     <div style={{ position: "relative", minHeight: "100vh" }}>
 *       <FloatingKite top="8%" left="6%" size={110} duration={24} />
 *       <FloatingKite top="55%" left="80%" size={80} duration={30} delay={3} opacity={0.7} />
 *
 *       // ... your real page content goes here, completely unaffected ...
 *     </div>
 *   );
 * }
 */
