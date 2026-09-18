"use client";

import React, { useState } from "react";
import { Sparkles, Scissors } from "lucide-react";

interface SewingMachineAnimationProps {
  compact?: boolean;
  className?: string;
}

export default function SewingMachineAnimation({ compact = false, className = "" }: SewingMachineAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<"normal" | "fast">("normal");

  return (
    <div 
      className={`relative ${compact ? "rounded-2xl sm:rounded-3xl p-3.5 sm:p-5" : "rounded-3xl p-5 sm:p-6"} bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl border border-indigo-700/40 overflow-hidden ${className}`}
    >
      {/* Background Ambience Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Atelier Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />

      {/* Top Header inside Card */}
      <div className={`relative z-10 flex items-center justify-between ${compact ? "mb-2.5 pb-2.5" : "mb-4 pb-3"} border-b border-indigo-800/60`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles size={14} className="animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold tracking-tight text-white">Atelier Crafting</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isPlaying ? "Aktif Menjahit" : "Jeda"}
              </span>
            </div>
            <p className={`text-[10px] text-indigo-300/80 truncate ${compact ? "hidden sm:block" : ""}`}>Presisi jahitan digital JahitFlow</p>
          </div>
        </div>

        {/* Play/Speed Mini Controls */}
        <div className="flex items-center gap-1.5 bg-indigo-900/80 p-1 rounded-xl border border-indigo-700/60">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
              isPlaying 
                ? "bg-indigo-600 text-white shadow-xs" 
                : "text-indigo-300 hover:text-white"
            }`}
            title={isPlaying ? "Jeda animasi" : "Putar animasi"}
          >
            {isPlaying ? "Pause" : "Jahit"}
          </button>
          <button
            type="button"
            onClick={() => setSpeed(speed === "normal" ? "fast" : "normal")}
            className="text-[10px] font-bold px-2 py-1 rounded-lg text-amber-300 hover:bg-indigo-800 transition"
            title="Ubah kecepatan jahitan"
          >
            {speed === "normal" ? "1x" : "2x ⚡"}
          </button>
        </div>
      </div>

      {/* SVG Sewing Machine Canvas */}
      <div className="relative z-10 flex items-center justify-center py-2">
        <svg
          viewBox="0 0 360 210"
          className="w-full max-w-[340px] sm:max-w-[360px] h-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Machine Body Metallic Gradient */}
            <linearGradient id="machineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="40%" stopColor="#3730A3" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            {/* Brass / Gold Accents Gradient */}
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Steel / Chrome Plate Gradient */}
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Fabric Emerald Silk Gradient */}
            <linearGradient id="fabricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065F46" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Drop Shadow for Needle */}
            <filter id="stitchGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FCD34D" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* BASE TABLE PLATFORM */}
          {/* Main Heavy Base Plate */}
          <rect x="25" y="165" width="310" height="24" rx="6" fill="url(#machineGrad)" stroke="#6366F1" strokeWidth="1.5" />
          <rect x="25" y="186" width="310" height="4" fill="#1E1B4B" />
          
          {/* Base Polish Highlight Line */}
          <line x1="32" y1="168" x2="328" y2="168" stroke="#818CF8" strokeWidth="1" strokeOpacity="0.6" />

          {/* Measuring Ruler Markings on Base Plate */}
          {[45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300].map((xPos, idx) => (
            <line 
              key={idx} 
              x1={xPos} 
              y1="172" 
              x2={xPos} 
              y2={idx % 3 === 0 ? "180" : "176"} 
              stroke="#A5B4FC" 
              strokeWidth={idx % 3 === 0 ? "1.2" : "0.75"} 
              strokeOpacity="0.5" 
            />
          ))}

          {/* Needle Throat Plate (Silver Metal Under Needle) */}
          <rect x="95" y="163" width="55" height="4" rx="1.5" fill="url(#chromeGrad)" stroke="#64748B" strokeWidth="0.5" />
          <circle cx="122" cy="165" r="1.5" fill="#0F172A" />

          {/* ====================================================
              MOVING FABRIC (KAIN BERGERAK)
          ==================================================== */}
          <g className={isPlaying ? (speed === "normal" ? "animate-fabric-move" : "animate-fabric-move-fast") : ""}>
            {/* Fabric Cloth Rectangle */}
            <path 
              d="M10 156 Q70 154 130 156 T250 156 L248 163 Q180 161 120 163 T10 163 Z" 
              fill="url(#fabricGrad)" 
              stroke="#34D399" 
              strokeWidth="0.8" 
            />
            {/* Fabric Fold Texture Lines */}
            <path d="M20 158 Q60 157 100 158" stroke="#6EE7B7" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M140 158 Q190 157 240 158" stroke="#6EE7B7" strokeWidth="0.5" strokeOpacity="0.6" />
          </g>

          {/* LIVE GOLDEN STITCH LINE (Garis Jahitan Emas Muncul) */}
          <g filter="url(#stitchGlow)">
            {/* Stitches already done on left side of needle (x: 10 to 122) */}
            <line 
              x1="18" 
              y1="159" 
              x2="122" 
              y2="159" 
              stroke="#FDE047" 
              strokeWidth="2.2" 
              strokeDasharray="4 3" 
              strokeLinecap="round"
              className={isPlaying ? (speed === "normal" ? "animate-stitch-feed" : "animate-stitch-feed-fast") : ""} 
            />
          </g>

          {/* ====================================================
              SEWING MACHINE BODY (C-Arm & Pillar)
          ==================================================== */}
          {/* Vertical Rear Pillar (Right Side) */}
          <path 
            d="M245 165 L245 75 Q245 45 220 45 L135 45 Q105 45 105 75 L105 105 Q105 112 112 112 L132 112 Q138 112 138 105 L138 78 Q138 68 150 68 L218 68 Q228 68 228 78 L228 165 Z" 
            fill="url(#machineGrad)" 
            stroke="#6366F1" 
            strokeWidth="2" 
          />

          {/* Machine Body Metallic Highlight / Rim */}
          <path 
            d="M241 163 L241 77 Q241 50 220 50 L140 50" 
            stroke="#818CF8" 
            strokeWidth="1.2" 
            strokeOpacity="0.6" 
            strokeLinecap="round" 
          />

          {/* JahitFlow Emblem / Brand Badge on Machine Body */}
          <rect x="155" y="76" width="60" height="18" rx="4" fill="#1E1B4B" stroke="url(#brassGrad)" strokeWidth="1" />
          <text x="185" y="89" fill="#FDE68A" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">
            JAHITFLOW
          </text>

          {/* ====================================================
              THREAD SPOOL ON TOP (Gulungan Benang Emas)
          ==================================================== */}
          {/* Spool Spindle Pin */}
          <rect x="200" y="24" width="3" height="22" fill="url(#chromeGrad)" />
          {/* Spool Cap */}
          <ellipse cx="201.5" cy="24" rx="6" ry="2" fill="url(#brassGrad)" />
          {/* Thread Coil Cylinder */}
          <rect x="195" y="26" width="13" height="15" rx="1.5" fill="url(#brassGrad)" />
          {/* Thread Windings Lines */}
          <line x1="195" y1="29" x2="208" y2="29" stroke="#78350F" strokeWidth="0.8" />
          <line x1="195" y1="33" x2="208" y2="33" stroke="#78350F" strokeWidth="0.8" />
          <line x1="195" y1="37" x2="208" y2="37" stroke="#78350F" strokeWidth="0.8" />

          {/* Thread Line Traveling to Machine Head */}
          <path 
            d="M195 30 Q160 20 125 35 T116 55 L116 100" 
            stroke="#FDE047" 
            strokeWidth="1" 
            strokeOpacity="0.85" 
            strokeDasharray="2 1" 
          />

          {/* Tension Dial (Knob Benang) */}
          <circle cx="160" cy="56" r="6" fill="url(#brassGrad)" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="160" cy="56" r="3" fill="#1E1B4B" />
          <line x1="160" y1="52" x2="160" y2="55" stroke="#FDE68A" strokeWidth="1" />

          {/* Stitch Length Adjustment Dial */}
          <circle cx="236" cy="115" r="5" fill="url(#brassGrad)" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="236" cy="115" r="2" fill="#1E1B4B" />

          {/* ====================================================
              HANDWHEEL ON RIGHT (Roda Putar Bergerak)
          ==================================================== */}
          <g 
            className={isPlaying ? (speed === "normal" ? "animate-wheel-spin" : "animate-wheel-spin-fast") : ""} 
            style={{ transformOrigin: "258px 90px" }}
          >
            {/* Wheel Rim */}
            <rect x="252" y="65" width="12" height="50" rx="6" fill="url(#brassGrad)" stroke="#78350F" strokeWidth="1" />
            <rect x="254" y="70" width="8" height="40" rx="4" fill="#1E1B4B" />
            {/* Wheel Spokes / Grip Ribs */}
            <line x1="254" y1="78" x2="262" y2="78" stroke="#FDE68A" strokeWidth="1.5" />
            <line x1="254" y1="90" x2="262" y2="90" stroke="#FDE68A" strokeWidth="1.5" />
            <line x1="254" y1="102" x2="262" y2="102" stroke="#FDE68A" strokeWidth="1.5" />
          </g>

          {/* ====================================================
              NEEDLE HEAD MECHANISM (Jarum & Sepatu Penindas)
          ==================================================== */}
          {/* Static Presser Foot Bar & Foot */}
          <rect x="127" y="112" width="3.5" height="42" fill="url(#chromeGrad)" stroke="#475569" strokeWidth="0.5" />
          {/* Presser Foot (Sepatu Jahit) */}
          <path d="M124 154 L134 154 L136 157 L122 157 Z" fill="url(#chromeGrad)" stroke="#334155" strokeWidth="0.8" />

          {/* ANIMATED NEEDLE BAR & NEEDLE (Jarum Naik-Turun Ritmis) */}
          <g 
            className={isPlaying ? (speed === "normal" ? "animate-needle-punch" : "animate-needle-punch-fast") : ""}
          >
            {/* Needle Bar */}
            <rect x="120" y="105" width="3" height="42" fill="url(#chromeGrad)" stroke="#334155" strokeWidth="0.5" />
            {/* Needle Clamp Screw */}
            <rect x="118.5" y="138" width="6" height="4" rx="1" fill="url(#brassGrad)" />
            {/* Fine Sewing Needle */}
            <line x1="121.5" y1="142" x2="121.5" y2="162" stroke="#E2E8F0" strokeWidth="1.4" strokeLinecap="round" />
            {/* Needle Eye */}
            <circle cx="121.5" cy="159" r="0.6" fill="#020617" />

            {/* Sparkle of Needle Puncturing Fabric */}
            <circle cx="121.5" cy="160" r="1.5" fill="#FDE047" className="animate-ping" opacity="0.6" />
          </g>

          {/* Little Atelier Work Light (Lampu Kerja Mini Penjahit) */}
          <path d="M136 112 L132 120 L138 120 Z" fill="url(#brassGrad)" />
          {/* Light Beam Cone */}
          <polygon points="132,120 115,165 142,165 138,120" fill="#FEF08A" opacity="0.12" />

        </svg>
      </div>

      {/* Bottom Mini Metric Inside Animation Box (Hanya muncul jika tidak compact) */}
      {!compact && (
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 mt-2 border-t border-indigo-800/60 text-center">
          <div className="bg-indigo-900/60 rounded-xl p-2 border border-indigo-800/40">
            <p className="text-[10px] text-indigo-300 font-medium">Jarum Presisi</p>
            <p className="text-xs font-black text-amber-300">Organ No. 11/14</p>
          </div>
          <div className="bg-indigo-900/60 rounded-xl p-2 border border-indigo-800/40">
            <p className="text-[10px] text-indigo-300 font-medium">Kerapatan Jahit</p>
            <p className="text-xs font-black text-emerald-300">2.5 mm Standar</p>
          </div>
          <div className="bg-indigo-900/60 rounded-xl p-2 border border-indigo-800/40">
            <p className="text-[10px] text-indigo-300 font-medium">Tegangan Benang</p>
            <p className="text-xs font-black text-indigo-200">Auto Balance ✓</p>
          </div>
        </div>
      )}
    </div>
  );
}
