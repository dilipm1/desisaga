"use client";

import { useNextFestival, formatDateLabel } from "@/lib/festivals";

export function AnimatedDiya({ className = "", delay = 0, size = 60 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="30" cy="62" rx="22" ry="6" fill="#8B4513" opacity="0.3" />
        <path d="M12 50 C12 50 14 62 30 62 C46 62 48 50 48 50 L45 45 L15 45 Z" fill="url(#diyaBase)" />
        <path d="M15 45 L45 45 L43 40 L17 40 Z" fill="#CD853F" />
        <ellipse cx="30" cy="40" rx="13" ry="3" fill="#DEB887" />
        <ellipse cx="30" cy="41" rx="10" ry="2" fill="#B8860B" opacity="0.6" />
        <line x1="30" y1="38" x2="30" y2="28" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="30" cy="22" rx="8" ry="10" fill="#FF6B00" opacity="0.15">
          <animate attributeName="rx" values="8;10;8" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
          <animate attributeName="ry" values="10;12;10" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
        </ellipse>
        <path d="M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z" fill="#FF8C00">
          <animate attributeName="d" values="M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z;M30 14 C25 19 23 25 30 28 C37 25 35 19 30 14Z;M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z" dur="1.2s" repeatCount="indefinite" begin={`${delay}s`} />
        </path>
        <path d="M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z" fill="#FFD700">
          <animate attributeName="d" values="M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z;M30 17 C27 21 26 24 30 27 C34 24 33 21 30 17Z;M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z" dur="1s" repeatCount="indefinite" begin={`${delay}s`} />
        </path>
        <ellipse cx="30" cy="23" rx="1.5" ry="3" fill="#FFFACD">
          <animate attributeName="ry" values="3;4;3" dur="0.8s" repeatCount="indefinite" begin={`${delay}s`} />
        </ellipse>
        <defs>
          <linearGradient id="diyaBase" x1="30" y1="50" x2="30" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CD853F" />
            <stop offset="1" stopColor="#8B4513" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function SpinningMandala({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-[spin_120s_linear_infinite]">
        <circle cx="200" cy="200" r="195" stroke="#E9B44C" strokeWidth="0.5" opacity="0.12" />
        <circle cx="200" cy="200" r="180" stroke="#E9B44C" strokeWidth="0.3" opacity="0.08" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 200 + 140 * Math.cos(angle);
          const y1 = 200 + 140 * Math.sin(angle);
          const x2 = 200 + 180 * Math.cos(angle);
          const y2 = 200 + 180 * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E9B44C" strokeWidth="0.3" opacity="0.1" />
              <circle cx={x2} cy={y2} r="3" fill="#E9B44C" opacity="0.06" />
            </g>
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 200 + 120 * Math.cos(angle);
          const cy = 200 + 120 * Math.sin(angle);
          return (
            <path
              key={`petal-${i}`}
              d={`M200,200 Q${cx + 15},${cy - 15} ${cx} ${cy} Q${cx - 15},${cy + 15} 200,200`}
              fill="none"
              stroke="#E9B44C"
              strokeWidth="0.4"
              opacity="0.08"
            />
          );
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const cx = 200 + 80 * Math.cos(angle);
          const cy = 200 + 80 * Math.sin(angle);
          return (
            <circle key={`dot-${i}`} cx={cx} cy={cy} r="2" fill="#E9B44C" opacity="0.05" />
          );
        })}
        <circle cx="200" cy="200" r="60" stroke="#E9B44C" strokeWidth="0.3" opacity="0.06" />
        <circle cx="200" cy="200" r="40" stroke="#E9B44C" strokeWidth="0.4" opacity="0.08" />
        <circle cx="200" cy="200" r="15" fill="#E9B44C" opacity="0.04" />
      </svg>
    </div>
  );
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANGOLI_COLORS = ["#E9B44C", "#E8731F", "#F4A236", "#FF6B00", "#D66012"];
const rand = mulberry32(2026);
const RANGOLI_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: rand() * 100,
  y: rand() * 100,
  size: 3 + rand() * 10,
  color: RANGOLI_COLORS[Math.floor(rand() * RANGOLI_COLORS.length)],
  delay: rand() * 8,
  duration: 9 + rand() * 12,
}));

export function FloatingRangoli() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {RANGOLI_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
            {p.id % 3 === 0 ? (
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={p.color} opacity="0.14" />
            ) : p.id % 3 === 1 ? (
              <circle cx="10" cy="10" r="8" fill={p.color} opacity="0.1" />
            ) : (
              <path d="M10 2 L13 8 L10 14 L7 8 Z M2 10 L8 7 L14 10 L8 13 Z" fill={p.color} opacity="0.11" />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── ToranGarland: the signature — a marigold & mango-leaf doorway garland ─── */

const TORAN_W = 1440;

function Marigold({ r = 11 }: { r?: number }) {
  return (
    <g>
      <circle r={r * 1.05} fill="#D66012" opacity="0.95" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        const px = Math.cos(a) * r * 0.55;
        const py = Math.sin(a) * r * 0.55;
        return <circle key={i} cx={px} cy={py} r={r * 0.38} fill="#E8731F" />;
      })}
      <circle r={r * 0.5} fill="#F4A236" />
      <circle r={r * 0.18} fill="#FFD97A" />
    </g>
  );
}

function MangoLeaf() {
  return (
    <g>
      <path d="M0 0 C-5 7 -5 16 0 20 C5 16 5 7 0 0 Z" fill="#5D8A46" opacity="0.8" />
      <path d="M0 2 L0 18" stroke="#3E6B30" strokeWidth="0.7" opacity="0.7" />
    </g>
  );
}

export function ToranGarland({ className = "" }: { className?: string }) {
  const knots = Array.from({ length: 13 }, (_, i) => {
    const x = (i + 0.5) * (TORAN_W / 13);
    const t = x / TORAN_W;
    const y = 14 + Math.sin(Math.PI * t) * 26;
    const sway = (i % 2 === 0 ? 1 : -1) * (2 + (i % 3));
    const dur = 4 + (i % 4) * 0.8;
    return { x, y, sway, dur };
  });

  return (
    <div className={`absolute top-0 left-0 right-0 h-24 md:h-32 overflow-hidden pointer-events-none z-20 ${className}`}>
      <svg viewBox={`0 0 ${TORAN_W} 150`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        {/* String */}
        <path
          d={`M0 14 Q ${TORAN_W / 2} 40 ${TORAN_W} 14`}
          fill="none"
          stroke="#C8B395"
          strokeWidth="1.5"
          opacity="0.35"
        />
        {/* Mango leaves hanging between flowers */}
        {knots.map((k, i) => {
          if (i % 3 !== 0) return null;
          const lx = k.x + 16;
          const rx = k.x - 16;
          return (
            <g key={`leaf-${i}`}>
              <g transform={`translate(${lx} ${k.y + 2})`}>
                <animateTransform attributeName="transform" type="rotate"
                  values={`-4 0 0;4 0 0;-4 0 0`} dur={`${5 + i}s`} repeatCount="indefinite" />
                <MangoLeaf />
              </g>
              <g transform={`translate(${rx} ${k.y + 2})`}>
                <animateTransform attributeName="transform" type="rotate"
                  values={`4 0 0;-4 0 0;4 0 0`} dur={`${6 + i * 0.7}s`} repeatCount="indefinite" />
                <MangoLeaf />
              </g>
            </g>
          );
        })}
        {/* Marigold clusters */}
        {knots.map((k, i) => (
          <g key={`fl-${i}`} transform={`translate(${k.x} ${k.y})`}>
            <animateTransform attributeName="transform" type="rotate"
              values={`${-k.sway} 0 0;${k.sway} 0 0;${-k.sway} 0 0`}
              dur={`${k.dur}s`} repeatCount="indefinite" />
            <Marigold r={i === 0 || i === knots.length - 1 ? 13 : 10.5} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" fill="currentColor" />
    </svg>
  );
}

export function FestivalCountdown() {
  const next = useNextFestival();

  if (!next) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-ember border border-line rounded-full px-4 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
      <span className="font-mono text-xs text-parchment-dim">
        {next.festival.name} · {formatDateLabel(next.festival.date)} · {next.daysLeft} days
      </span>
    </div>
  );
}
