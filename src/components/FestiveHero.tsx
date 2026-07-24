"use client";

import { useEffect, useState } from "react";

export function AnimatedDiya({ className = "", delay = 0, size = 60 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Diya base */}
        <ellipse cx="30" cy="62" rx="22" ry="6" fill="#8B4513" opacity="0.3" />
        <path d="M12 50 C12 50 14 62 30 62 C46 62 48 50 48 50 L45 45 L15 45 Z" fill="url(#diyaBase)" />
        <path d="M15 45 L45 45 L43 40 L17 40 Z" fill="#CD853F" />
        <ellipse cx="30" cy="40" rx="13" ry="3" fill="#DEB887" />
        {/* Oil pool */}
        <ellipse cx="30" cy="41" rx="10" ry="2" fill="#B8860B" opacity="0.6" />
        {/* Wick */}
        <line x1="30" y1="38" x2="30" y2="28" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" />
        {/* Flame outer glow */}
        <ellipse cx="30" cy="22" rx="8" ry="10" fill="#FF6B00" opacity="0.15">
          <animate attributeName="rx" values="8;10;8" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
          <animate attributeName="ry" values="10;12;10" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="1.5s" repeatCount="indefinite" begin={`${delay}s`} />
        </ellipse>
        {/* Flame middle */}
        <path d="M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z" fill="#FF8C00">
          <animate attributeName="d" values="M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z;M30 14 C25 19 23 25 30 28 C37 25 35 19 30 14Z;M30 16 C26 20 24 26 30 28 C36 26 34 20 30 16Z" dur="1.2s" repeatCount="indefinite" begin={`${delay}s`} />
        </path>
        {/* Flame inner */}
        <path d="M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z" fill="#FFD700">
          <animate attributeName="d" values="M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z;M30 17 C27 21 26 24 30 27 C34 24 33 21 30 17Z;M30 19 C28 22 27 25 30 27 C33 25 32 22 30 19Z" dur="1s" repeatCount="indefinite" begin={`${delay}s`} />
        </path>
        {/* Flame core */}
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
        {/* Outer ring */}
        <circle cx="200" cy="200" r="195" stroke="#D4A017" strokeWidth="0.5" opacity="0.15" />
        <circle cx="200" cy="200" r="180" stroke="#D4A017" strokeWidth="0.3" opacity="0.1" />
        {/* Petal layers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 200 + 140 * Math.cos(angle);
          const y1 = 200 + 140 * Math.sin(angle);
          const x2 = 200 + 180 * Math.cos(angle);
          const y2 = 200 + 180 * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A017" strokeWidth="0.3" opacity="0.12" />
              <circle cx={x2} cy={y2} r="3" fill="#D4A017" opacity="0.08" />
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
              stroke="#D4A017"
              strokeWidth="0.4"
              opacity="0.1"
            />
          );
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const cx = 200 + 80 * Math.cos(angle);
          const cy = 200 + 80 * Math.sin(angle);
          return (
            <circle key={`dot-${i}`} cx={cx} cy={cy} r="2" fill="#D4A017" opacity="0.06" />
          );
        })}
        {/* Inner circles */}
        <circle cx="200" cy="200" r="60" stroke="#D4A017" strokeWidth="0.3" opacity="0.08" />
        <circle cx="200" cy="200" r="40" stroke="#D4A017" strokeWidth="0.4" opacity="0.1" />
        <circle cx="200" cy="200" r="15" fill="#D4A017" opacity="0.05" />
      </svg>
    </div>
  );
}

export function FloatingRangoli() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; delay: number; duration: number }>>([]);

  useEffect(() => {
    const colors = ["#D4A017", "#EA580C", "#B8860B", "#FF6B00", "#CD853F", "#F59E0B"];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
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
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={p.color} opacity="0.15" />
            ) : p.id % 3 === 1 ? (
              <circle cx="10" cy="10" r="8" fill={p.color} opacity="0.1" />
            ) : (
              <path d="M10 2 L13 8 L10 14 L7 8 Z M2 10 L8 7 L14 10 L8 13 Z" fill={p.color} opacity="0.12" />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}

export function ToranGarland() {
  const marigoldPositions = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: 4 + (i * 92) / 14,
    droop: 8 + Math.sin((i / 14) * Math.PI) * 12,
  }));

  return (
    <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden pointer-events-none z-10">
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
        {/* String */}
        <path
          d={`M0 4 ${marigoldPositions.map((m) => `Q${m.x + 2} ${m.droop} ${m.x + 4} 4`).join(" ")}`}
          fill="none"
          stroke="#D4A017"
          strokeWidth="0.15"
          opacity="0.4"
        />
        {/* Marigold flowers */}
        {marigoldPositions.map((m) => (
          <g key={m.id}>
            <circle cx={m.x + 2} cy={m.droop - 1} r="1.2" fill="#FF8C00" opacity="0.5" />
            <circle cx={m.x + 2} cy={m.droop - 1} r="0.7" fill="#FFD700" opacity="0.6" />
            <circle cx={m.x + 2} cy={m.droop + 0.5} r="0.3" fill="#228B22" opacity="0.3" />
          </g>
        ))}
        {/* Leaf accents */}
        {marigoldPositions.filter((_, i) => i % 2 === 0).map((m) => (
          <path
            key={`leaf-${m.id}`}
            d={`M${m.x} ${m.droop + 1} Q${m.x + 1} ${m.droop + 3} ${m.x + 2} ${m.droop + 1}`}
            fill="#228B22"
            opacity="0.2"
          />
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
  const [nextFestival, setNextFestival] = useState<{ name: string; date: string; daysLeft: number } | null>(null);

  useEffect(() => {
    const festivals = [
      { name: "Raksha Bandhan", date: "2026-08-22", emoji: "\uD83C\uDF80" },
      { name: "Ganesh Chaturthi", date: "2026-08-26", emoji: "\uD83D\uDC18" },
      { name: "Navratri", date: "2026-10-15", emoji: "\uD83D\uDC83" },
      { name: "Diwali", date: "2026-11-08", emoji: "\uD83D\uDD6F" },
      { name: "Holi", date: "2027-03-04", emoji: "\uD83C\uDFA8" },
    ];

    const now = new Date();
    for (const f of festivals) {
      const fDate = new Date(f.date);
      const diff = Math.ceil((fDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        setNextFestival({ name: f.name, date: f.date, daysLeft: diff });
        break;
      }
    }
  }, []);

  if (!nextFestival) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-gold/15 backdrop-blur-sm border border-gold/20 rounded-full px-4 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
      <span className="text-xs font-medium text-gold-light">
        {nextFestival.name} in {nextFestival.daysLeft} days
      </span>
    </div>
  );
}
