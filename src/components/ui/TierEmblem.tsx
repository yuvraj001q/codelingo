"use client";

import { useMemo } from "react";
import { motion, type TargetAndTransition } from "framer-motion";

interface TierEmblemProps {
  tier: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const tierConfig: Record<string, {
  label: string;
  shape: string;
  colors: { primary: string; secondary: string; accent: string; glow: string };
  behaviors: string[];
  svgPath: string;
}> = {
  Iron: {
    label: "Iron",
    shape: "jagged-blunt",
    colors: { primary: "#4a4a4a", secondary: "#2d2d2d", accent: "#6b5b4f", glow: "transparent" },
    behaviors: ["static"],
    svgPath: "M20 80 L35 55 L50 70 L65 40 L80 65 L95 20 L80 80 Z",
  },
  Bronze: {
    label: "Bronze",
    shape: "wide-peak",
    colors: { primary: "#b87333", secondary: "#8b5e3c", accent: "#d4956b", glow: "transparent" },
    behaviors: ["static"],
    svgPath: "M15 80 L30 45 L50 35 L70 45 L85 80 L75 50 L50 25 L25 50 Z",
  },
  Silver: {
    label: "Silver",
    shape: "sharp-sweep",
    colors: { primary: "#c0c0c0", secondary: "#8a8a8a", accent: "#e8e8e8", glow: "rgba(192,192,192,0.3)" },
    behaviors: ["drop-shadow"],
    svgPath: "M10 85 L25 40 L50 20 L75 40 L90 85 L80 45 L50 15 L20 45 Z",
  },
  Gold: {
    label: "Gold",
    shape: "multi-wing",
    colors: { primary: "#ffd700", secondary: "#b8860b", accent: "#fff4b0", glow: "rgba(255,215,0,0.5)" },
    behaviors: ["pulse-glow"],
    svgPath: "M5 85 L20 35 L50 10 L80 35 L95 85 L85 40 L50 5 L15 40 Z",
  },
  Platinum: {
    label: "Platinum",
    shape: "aggressive-shards",
    colors: { primary: "#00bcd4", secondary: "#00838f", accent: "#80deea", glow: "rgba(0,188,212,0.4)" },
    behaviors: ["metallic-shine"],
    svgPath: "M5 90 L15 30 L50 5 L85 30 L95 90 L80 35 L50 0 L20 35 Z",
  },
  Emerald: {
    label: "Emerald",
    shape: "sweeping-arcs",
    colors: { primary: "#2ecc71", secondary: "#1a7a42", accent: "#82e0aa", glow: "rgba(46,204,113,0.6)" },
    behaviors: ["core-glow", "hover-scale"],
    svgPath: "M5 85 L18 25 L50 5 L82 25 L95 85 L85 30 L50 0 L15 30 Z",
  },
  Diamond: {
    label: "Diamond",
    shape: "crystalline-spikes",
    colors: { primary: "#4fc3f7", secondary: "#0288d1", accent: "#b3e5fc", glow: "rgba(79,195,247,0.6)" },
    behaviors: ["float", "multi-shadow"],
    svgPath: "M5 85 L12 20 L50 0 L88 20 L95 85 L90 25 L50 -5 L10 25 Z",
  },
  Master: {
    label: "Master",
    shape: "arcane-ethereal",
    colors: { primary: "#ab47bc", secondary: "#6a1b9a", accent: "#e1bee7", glow: "rgba(171,71,188,0.7)" },
    behaviors: ["float-fast", "bloom-flash"],
    svgPath: "M5 85 L10 15 L50 -5 L90 15 L95 85 L92 20 L50 -10 L8 20 Z",
  },
  Grandmaster: {
    label: "Grandmaster",
    shape: "demonic-fiery",
    colors: { primary: "#d32f2f", secondary: "#b71c1c", accent: "#ff8a65", glow: "rgba(211,47,47,0.7)" },
    behaviors: ["heat-distortion"],
    svgPath: "M5 85 L8 10 L50 -10 L92 10 L95 85 L94 15 L50 -15 L6 15 Z",
  },
  Challenger: {
    label: "Challenger",
    shape: "ultimate-crown",
    colors: { primary: "#ffd700", secondary: "#0d47a1", accent: "#42a5f5", glow: "rgba(255,215,0,0.9)" },
    behaviors: ["particle-drift", "core-pulse"],
    svgPath: "M5 85 L6 5 L50 -15 L94 5 L95 85 L96 10 L50 -20 L4 10 Z",
  },
};

const sizeMap = { sm: 48, md: 72, lg: 120 };

export default function TierEmblem({ tier, size = "md", animate = true }: TierEmblemProps) {
  const config = tierConfig[tier] || tierConfig.Iron;
  const px = sizeMap[size];
  const isApex = ["Diamond", "Master", "Grandmaster", "Challenger"].includes(tier);
  const isPrestige = ["Gold", "Platinum", "Emerald"].includes(tier);

  const emblemAnim = useMemo(() => {
    if (!animate) return undefined;
    if (isApex && tier === "Gold") {
      return { y: [0, -4, 0], scale: [1, 1.03, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } } as TargetAndTransition;
    }
    if (isApex) {
      return { y: [0, -4, 0], transition: { duration: tier === "Master" || tier === "Grandmaster" || tier === "Challenger" ? 2.5 : 3.5, repeat: Infinity, ease: "easeInOut" } } as TargetAndTransition;
    }
    if (tier === "Gold") {
      return { scale: [1, 1.03, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } } as TargetAndTransition;
    }
    return undefined;
  }, [animate, isApex, tier]);

  const hoverScale = tier === "Emerald" ? 1.05 : 1;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: px, height: px }}
    >
      {/* Grandmaster heat distortion layer */}
      {tier === "Grandmaster" && animate && (
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: `radial-gradient(circle, ${config.colors.accent} 0%, transparent 70%)`,
            animation: "heat-shimmer 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Challenger particle layer */}
      {tier === "Challenger" && animate && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: config.colors.accent,
                left: `${20 + i * 14}%`,
                top: "50%",
                boxShadow: `0 0 4px ${config.colors.accent}`,
                animation: `tier-particle-drift ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow behind emblem */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.colors.glow} 0%, transparent 70%)`,
          filter: "blur(8px)",
          opacity: isApex ? 0.9 : isPrestige ? 0.6 : 0,
        }}
      />

      {/* Emblem SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        className="relative z-10"
        style={{ width: px, height: px }}
        animate={emblemAnim}
        whileHover={{ scale: hoverScale }}
      >
        <defs>
          {/* Metallic shine gradient for Platinum */}
          {tier === "Platinum" && (
            <linearGradient id="metallic-shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={config.colors.secondary} />
              <stop offset="40%" stopColor={config.colors.primary} stopOpacity={0.6} />
              <stop offset="60%" stopColor="#fff" stopOpacity={0.8} />
              <stop offset="80%" stopColor={config.colors.primary} />
              <stop offset="100%" stopColor={config.colors.secondary} />
            </linearGradient>
          )}

          {/* Core glow for Master */}
          {tier === "Master" && (
            <radialGradient id="master-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.9} />
              <stop offset="30%" stopColor={config.colors.primary} />
              <stop offset="100%" stopColor={config.colors.secondary} />
            </radialGradient>
          )}
        </defs>

        {/* Drop shadow filter for Silver+ */}
        {(isPrestige || isApex) && (
          <filter id="emblem-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={config.colors.glow} />
          </filter>
        )}

        {/* Multi-layer shadows for Diamond+ */}
        {isApex && (
          <>
            <filter id="emblem-glow-deep">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={config.colors.glow} />
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={config.colors.glow} />
            </filter>
          </>
        )}

        {/* Outlines / base shape */}
        <path
          d={config.svgPath}
          fill={
            tier === "Platinum" ? "url(#metallic-shine)" :
            tier === "Master" ? "url(#master-bloom)" :
            config.colors.primary
          }
          stroke={config.colors.accent}
          strokeWidth={tier === "Challenger" ? 3 : tier === "Grandmaster" ? 2.5 : 2}
          strokeLinejoin="round"
          filter={
            isApex ? "url(#emblem-glow-deep)" :
            isPrestige ? "url(#emblem-glow)" :
            undefined
          }
          style={{
            transition: "all 0.3s ease",
          }}
        />

        {/* Inner highlight layer */}
        <path
          d={config.svgPath}
          fill="none"
          stroke={config.colors.accent}
          strokeWidth={1}
          strokeLinejoin="round"
          opacity={0.5}
          transform="scale(0.85) translate(8, 8)"
        />

        {/* Challenger star core */}
        {tier === "Challenger" && (
          <g>
            <circle cx="50" cy="35" r="8" fill={config.colors.accent} opacity={0.9} />
            <circle cx="50" cy="35" r="4" fill="#fff" opacity={0.8} />
            <line x1="50" y1="20" x2="50" y2="50" stroke={config.colors.accent} strokeWidth="1.5" opacity={0.5} />
            <line x1="35" y1="35" x2="65" y2="35" stroke={config.colors.accent} strokeWidth="1.5" opacity={0.5} />
            <line x1="39" y1="24" x2="61" y2="46" stroke={config.colors.accent} strokeWidth="1" opacity={0.3} />
            <line x1="61" y1="24" x2="39" y2="46" stroke={config.colors.accent} strokeWidth="1" opacity={0.3} />
          </g>
        )}

        {/* Grandmaster fiery core */}
        {tier === "Grandmaster" && (
          <ellipse cx="50" cy="40" rx="10" ry="6" fill={config.colors.accent} opacity={0.7}>
            <animate attributeName="rx" values="10;12;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="ry" values="6;8;6" dur="2s" repeatCount="indefinite" />
          </ellipse>
        )}
      </motion.svg>
    </div>
  );
}
