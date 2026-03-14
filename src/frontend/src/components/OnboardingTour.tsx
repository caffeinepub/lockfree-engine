import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const TOUR_SEEN_KEY = "lockfree_tour_seen";

// ─── Step Illustrations ───────────────────────────────────────────────────────

function IllustrationWelcome() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden="true">
      {/* Background subtle grid */}
      <defs>
        <pattern
          id="tour-grid"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="oklch(0.78 0.18 195 / 0.08)"
            strokeWidth="0.5"
          />
        </pattern>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.78 0.18 195)"
            stopOpacity="0.12"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#tour-grid)" />
      <ellipse cx="160" cy="80" rx="90" ry="70" fill="url(#center-glow)" />

      {/* Central ICP node */}
      <circle
        cx="160"
        cy="80"
        r="22"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="1.5"
      />
      <circle
        cx="160"
        cy="80"
        r="30"
        fill="none"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="0.5"
        strokeOpacity="0.25"
        strokeDasharray="4 3"
      />
      <text
        x="160"
        y="84"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.78 0.18 195)"
        fontSize="9"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        ICP
      </text>

      {/* AWS node — top right */}
      <line
        x1="160"
        y1="80"
        x2="258"
        y2="40"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="5 3"
      />
      <circle
        cx="258"
        cy="40"
        r="16"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1.2"
      />
      <text
        x="258"
        y="44"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.18 55)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        AWS
      </text>

      {/* GCP node — bottom left */}
      <line
        x1="160"
        y1="80"
        x2="62"
        y2="120"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="5 3"
      />
      <circle
        cx="62"
        cy="120"
        r="16"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1.2"
      />
      <text
        x="62"
        y="124"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.65 0.18 220)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        GCP
      </text>

      {/* Azure node — bottom right */}
      <line
        x1="160"
        y1="80"
        x2="258"
        y2="128"
        stroke="oklch(0.72 0.17 195)"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="5 3"
      />
      <circle
        cx="258"
        cy="128"
        r="16"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.72 0.17 195)"
        strokeWidth="1.2"
      />
      <text
        x="258"
        y="132"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.17 195)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        Azure
      </text>

      {/* Mission 70 badge */}
      <rect
        x="100"
        y="4"
        width="120"
        height="18"
        rx="9"
        fill="oklch(0.78 0.18 195 / 0.12)"
        stroke="oklch(0.78 0.18 195 / 0.3)"
        strokeWidth="0.8"
      />
      <text
        x="160"
        y="16"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.78 0.18 195)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        ✦ ICP Mission 70
      </text>

      {/* Ping animation suggestion via opacity rings */}
      <circle
        cx="160"
        cy="80"
        r="38"
        fill="none"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="0.4"
        strokeOpacity="0.15"
      />
      <circle
        cx="160"
        cy="80"
        r="48"
        fill="none"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="0.3"
        strokeOpacity="0.08"
      />
    </svg>
  );
}

function IllustrationProvision() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="prov-glow" cx="40%" cy="50%" r="55%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#prov-glow)" />

      {/* Server card */}
      <rect
        x="60"
        y="24"
        width="140"
        height="112"
        rx="8"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1.2"
      />

      {/* Provider badge */}
      <rect
        x="72"
        y="34"
        width="46"
        height="16"
        rx="8"
        fill="oklch(0.72 0.18 55 / 0.18)"
        stroke="oklch(0.72 0.18 55 / 0.4)"
        strokeWidth="0.8"
      />
      <circle cx="82" cy="42" r="3" fill="oklch(0.72 0.18 55)" />
      <text
        x="100"
        y="46"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.18 55)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        AWS
      </text>

      {/* Server name */}
      <text
        x="130"
        y="64"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.94 0.01 240)"
        fontSize="9"
        fontFamily="Cabinet Grotesk, sans-serif"
        fontWeight="700"
      >
        prod-engine-01
      </text>

      {/* Slider - CPU */}
      <text
        x="72"
        y="82"
        fill="oklch(0.56 0.02 240)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
      >
        CPU
      </text>
      <rect
        x="72"
        y="88"
        width="90"
        height="4"
        rx="2"
        fill="oklch(0.2 0.015 240)"
      />
      <rect
        x="72"
        y="88"
        width="60"
        height="4"
        rx="2"
        fill="oklch(0.72 0.18 55)"
      />
      <circle
        cx="132"
        cy="90"
        r="4"
        fill="oklch(0.72 0.18 55)"
        stroke="oklch(0.94 0.01 240)"
        strokeWidth="1"
      />

      {/* Slider - RAM */}
      <text
        x="72"
        y="104"
        fill="oklch(0.56 0.02 240)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
      >
        RAM
      </text>
      <rect
        x="72"
        y="110"
        width="90"
        height="4"
        rx="2"
        fill="oklch(0.2 0.015 240)"
      />
      <rect
        x="72"
        y="110"
        width="45"
        height="4"
        rx="2"
        fill="oklch(0.72 0.18 55 / 0.7)"
      />
      <circle
        cx="117"
        cy="112"
        r="4"
        fill="oklch(0.72 0.18 55 / 0.7)"
        stroke="oklch(0.94 0.01 240)"
        strokeWidth="1"
      />

      {/* Provision button shape */}
      <rect
        x="72"
        y="122"
        width="116"
        height="8"
        rx="4"
        fill="oklch(0.78 0.18 195 / 0.15)"
        stroke="oklch(0.78 0.18 195 / 0.4)"
        strokeWidth="0.8"
      />
      <text
        x="130"
        y="129"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.78 0.18 195)"
        fontSize="6"
        fontFamily="Cabinet Grotesk, sans-serif"
        fontWeight="700"
      >
        Provision Engine
      </text>

      {/* Right side: provider options */}
      <circle
        cx="248"
        cy="50"
        r="14"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1"
      />
      <text
        x="248"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.65 0.18 220)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        GCP
      </text>

      <circle
        cx="248"
        cy="100"
        r="14"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.72 0.17 195)"
        strokeWidth="1"
      />
      <text
        x="248"
        y="104"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.17 195)"
        fontSize="6"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        Azure
      </text>

      {/* Arrows pointing to card */}
      <path
        d="M 234 50 L 202 65"
        stroke="oklch(0.25 0.015 240)"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        markerEnd="url(#arr)"
      />
      <path
        d="M 234 100 L 202 95"
        stroke="oklch(0.25 0.015 240)"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />

      {/* "No lock-in" label */}
      <text
        x="225"
        y="138"
        textAnchor="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        ↔ switch anytime
      </text>
    </svg>
  );
}

function IllustrationAIDeploy() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="ai-glow" cx="35%" cy="45%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.78 0.18 195)"
            stopOpacity="0.1"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#ai-glow)" />

      {/* Chat bubble */}
      <rect
        x="24"
        y="28"
        width="160"
        height="60"
        rx="10"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.78 0.18 195 / 0.5)"
        strokeWidth="1.2"
      />
      {/* Bubble tail */}
      <path
        d="M 40 88 L 28 104 L 60 88"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.78 0.18 195 / 0.5)"
        strokeWidth="1.2"
      />

      {/* Chat text lines */}
      <text
        x="38"
        y="46"
        fill="oklch(0.78 0.18 195)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        ✦ Deploy a CRM with
      </text>
      <text
        x="38"
        y="58"
        fill="oklch(0.78 0.18 195)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        {" "}
        auth and database
      </text>

      {/* Sparkle/AI indicator */}
      <circle
        cx="166"
        cy="33"
        r="10"
        fill="oklch(0.78 0.18 195 / 0.2)"
        stroke="oklch(0.78 0.18 195 / 0.4)"
        strokeWidth="0.8"
      />
      <text
        x="166"
        y="37"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.78 0.18 195)"
        fontSize="9"
      >
        ✦
      </text>

      {/* Arrow pointing right → canister */}
      <path
        d="M 192 80 Q 215 80 220 90"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 2"
      />
      <polygon points="218,88 224,90 218,96" fill="oklch(0.78 0.18 195)" />

      {/* Code lines flowing */}
      <rect
        x="196"
        y="58"
        width="50"
        height="5"
        rx="2.5"
        fill="oklch(0.72 0.19 145 / 0.5)"
      />
      <rect
        x="196"
        y="68"
        width="38"
        height="5"
        rx="2.5"
        fill="oklch(0.72 0.19 145 / 0.35)"
      />

      {/* Canister cylinder */}
      <ellipse
        cx="270"
        cy="96"
        rx="26"
        ry="8"
        fill="oklch(0.2 0.015 240)"
        stroke="oklch(0.72 0.19 145)"
        strokeWidth="1.2"
      />
      <rect
        x="244"
        y="96"
        width="52"
        height="36"
        fill="oklch(0.18 0.012 240)"
        stroke="oklch(0.72 0.19 145)"
        strokeWidth="1.2"
      />
      <ellipse
        cx="270"
        cy="132"
        rx="26"
        ry="8"
        fill="oklch(0.18 0.012 240)"
        stroke="oklch(0.72 0.19 145)"
        strokeWidth="1.2"
      />

      {/* ICP label on canister */}
      <text
        x="270"
        y="116"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        ICP
      </text>
      <text
        x="270"
        y="126"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.56 0.02 240)"
        fontSize="6"
        fontFamily="Geist Mono, monospace"
      >
        canister
      </text>

      {/* "Live in seconds" label */}
      <text
        x="160"
        y="150"
        textAnchor="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        ✓ live in seconds
      </text>
    </svg>
  );
}

function IllustrationMigration() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="mig-glow-l" cx="25%" cy="50%" r="45%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mig-glow-r" cx="75%" cy="50%" r="45%">
          <stop
            offset="0%"
            stopColor="oklch(0.65 0.18 220)"
            stopOpacity="0.1"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#mig-glow-l)" />
      <rect width="320" height="160" fill="url(#mig-glow-r)" />

      {/* AWS node — left */}
      <circle
        cx="68"
        cy="80"
        r="30"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1.5"
      />
      <circle
        cx="68"
        cy="80"
        r="38"
        fill="none"
        stroke="oklch(0.72 0.18 55 / 0.2)"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <text
        x="68"
        y="77"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.18 55)"
        fontSize="9"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        AWS
      </text>
      <text
        x="68"
        y="89"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.56 0.02 240)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
      >
        engine
      </text>

      {/* Migration arrow */}
      <path
        d="M 106 72 L 162 60 L 162 52 L 186 80 L 162 108 L 162 100 L 106 88 Z"
        fill="oklch(0.78 0.18 195 / 0.15)"
        stroke="oklch(0.78 0.18 195)"
        strokeWidth="1"
      />
      <text
        x="146"
        y="82"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.78 0.18 195)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        migrate
      </text>

      {/* GCP node — right */}
      <circle
        cx="252"
        cy="80"
        r="30"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1.5"
      />
      <circle
        cx="252"
        cy="80"
        r="38"
        fill="none"
        stroke="oklch(0.65 0.18 220 / 0.25)"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <text
        x="252"
        y="77"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.65 0.18 220)"
        fontSize="9"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        GCP
      </text>
      <text
        x="252"
        y="89"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.56 0.02 240)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
      >
        engine
      </text>

      {/* Shield — 0s badge */}
      <rect
        x="118"
        y="120"
        width="84"
        height="28"
        rx="6"
        fill="oklch(0.72 0.19 145 / 0.12)"
        stroke="oklch(0.72 0.19 145 / 0.4)"
        strokeWidth="1"
      />
      <text
        x="160"
        y="131"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        ⊕ 0s downtime
      </text>
      <text
        x="160"
        y="143"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.56 0.02 240)"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
      >
        DFINITY Mission 70
      </text>

      {/* Top label */}
      <text
        x="160"
        y="16"
        textAnchor="middle"
        fill="oklch(0.94 0.01 240 / 0.7)"
        fontSize="8"
        fontFamily="Cabinet Grotesk, sans-serif"
        fontWeight="600"
      >
        Seamless Multi-Cloud Migration
      </text>
    </svg>
  );
}

function IllustrationDistribute() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="dist-glow" cx="50%" cy="50%" r="60%">
          <stop
            offset="0%"
            stopColor="oklch(0.72 0.19 145)"
            stopOpacity="0.1"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#dist-glow)" />

      {/* AWS node */}
      <circle
        cx="60"
        cy="50"
        r="22"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1.3"
      />
      <text
        x="60"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.18 55)"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        AWS
      </text>

      {/* GCP node */}
      <circle
        cx="60"
        cy="120"
        r="22"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1.3"
      />
      <text
        x="60"
        y="124"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.65 0.18 220)"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        GCP
      </text>

      {/* Azure node */}
      <circle
        cx="260"
        cy="85"
        r="22"
        fill="oklch(0.155 0.01 240)"
        stroke="oklch(0.72 0.17 195)"
        strokeWidth="1.3"
      />
      <text
        x="260"
        y="89"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.17 195)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        Azure
      </text>

      {/* Lines to center */}
      <line
        x1="82"
        y1="55"
        x2="148"
        y2="80"
        stroke="oklch(0.72 0.18 55)"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="4 2"
      />
      <line
        x1="82"
        y1="115"
        x2="148"
        y2="88"
        stroke="oklch(0.65 0.18 220)"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="4 2"
      />
      <line
        x1="238"
        y1="85"
        x2="180"
        y2="84"
        stroke="oklch(0.72 0.17 195)"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="4 2"
      />

      {/* Central resilience gauge */}
      <circle
        cx="164"
        cy="84"
        r="28"
        fill="oklch(0.12 0.008 240)"
        stroke="oklch(0.25 0.015 240)"
        strokeWidth="1"
      />
      {/* Arc gauge - background */}
      <path
        d="M 143 96 A 22 22 0 1 1 185 96"
        fill="none"
        stroke="oklch(0.2 0.015 240)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Arc gauge - fill ~89% */}
      <path
        d="M 143 96 A 22 22 0 1 1 183 88"
        fill="none"
        stroke="oklch(0.72 0.19 145)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <text
        x="164"
        y="82"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="11"
        fontFamily="Geist Mono, monospace"
        fontWeight="700"
      >
        89%
      </text>
      <text
        x="164"
        y="96"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.56 0.02 240)"
        fontSize="5.5"
        fontFamily="Geist Mono, monospace"
      >
        resilience
      </text>

      {/* Label */}
      <text
        x="164"
        y="148"
        textAnchor="middle"
        fill="oklch(0.72 0.19 145)"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fontWeight="600"
      >
        ↑ distribute → own your infra
      </text>
    </svg>
  );
}

// ─── Step Data ────────────────────────────────────────────────────────────────

interface TourStep {
  title: string;
  description: string;
  illustration: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to LockFree Engine",
    description:
      "The cloud infrastructure platform that ends vendor lock-in forever. Powered by ICP Mission 70.",
    illustration: <IllustrationWelcome />,
  },
  {
    title: "Provision a Cloud Engine",
    description:
      "Pick a provider, set CPU/RAM/storage, and go live in seconds. Switch providers anytime — demand-driven compute means you're never stuck.",
    illustration: <IllustrationProvision />,
  },
  {
    title: "AI-Powered Deployment",
    description:
      "Describe any application in plain English. The AI builds it, deploys it as an ICP canister, and it's live on your engine instantly.",
    illustration: <IllustrationAIDeploy />,
  },
  {
    title: "Seamless Migration",
    description:
      "Click Migrate Now. Your entire engine — apps, data, configs — moves to a new provider with zero downtime. As announced in DFINITY Mission 70.",
    illustration: <IllustrationMigration />,
  },
  {
    title: "Distribute for Maximum Resilience",
    description:
      "Split your workload across AWS, GCP, and Azure simultaneously. Your resilience score climbs toward 100%. You own your infrastructure — no lock-in ever.",
    illustration: <IllustrationDistribute />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingTour({ open, onClose }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  // Mark as seen immediately when the tour opens
  useEffect(() => {
    if (open) {
      localStorage.setItem(TOUR_SEEN_KEY, "true");
      setStep(0);
    }
  }, [open]);

  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;
  const currentStep = TOUR_STEPS[step];

  function handleNext() {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border border-border/60 gap-0 max-h-[90vh] overflow-y-auto"
        // Hide the default close button from DialogContent
        aria-describedby="tour-step-description"
      >
        {/* Illustration area */}
        <div className="h-48 bg-secondary/40 border-b border-border/60 relative overflow-hidden flex items-center justify-center px-4">
          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="w-full h-full"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              {currentStep.illustration}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text content */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${step}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground mb-2">
                {currentStep.title}
              </h2>
              <p
                id="tour-step-description"
                className="text-sm text-muted-foreground/80 leading-relaxed"
              >
                {currentStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer: dots + navigation */}
        <div className="px-6 pb-5 flex items-center justify-between gap-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((tourStep, i) => (
              <motion.button
                key={tourStep.title}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}: ${tourStep.title}`}
                className="rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                animate={{
                  width: i === step ? 20 : 8,
                  backgroundColor:
                    i < step
                      ? "oklch(0.78 0.18 195 / 0.5)"
                      : i === step
                        ? "oklch(0.78 0.18 195)"
                        : "oklch(0.25 0.015 240)",
                }}
                transition={{ duration: 0.2 }}
                style={{ height: 8 }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {isFirst ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
                onClick={onClose}
              >
                Skip
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handlePrev}
              >
                Previous
              </Button>
            )}

            <Button
              size="sm"
              className="px-4 text-xs gap-1.5 active:scale-[0.98]"
              onClick={handleNext}
            >
              {isLast ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { TOUR_SEEN_KEY };
