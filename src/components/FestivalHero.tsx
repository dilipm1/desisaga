"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useNextFestival, formatDateLabel } from "@/lib/festivals";
import { ToranGarland, SpinningMandala, FloatingRangoli } from "@/components/FestiveHero";

export default function FestivalHero() {
  const next = useNextFestival();
  const festival = next?.festival;
  const name = festival?.name ?? "the next festival";
  const year = festival ? festival.date.slice(0, 4) : "2026";

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Night canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-night via-[#240D0C] to-[#2B0E09]" />
      {/* Warm light wells */}
      <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-flame/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-kumkum/10 blur-[120px]" />

      {/* Ambient ritual detail */}
      <SpinningMandala className="right-[-220px] top-[-120px] w-[560px] h-[560px] hidden md:block" />
      <FloatingRangoli />

      {/* Signature: the toran doorway garland */}
      <ToranGarland />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 pt-36 pb-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="animate-rise font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-flame mb-8 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse inline-block" />
            Next on the calendar
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-parchment">
            <span className="animate-rise block">Send the</span>
            <span className="animate-rise stagger-1 text-flame-gradient block">festival</span>
            <span className="animate-rise stagger-2 block">home.</span>
          </h1>

          <p className="animate-rise stagger-3 mt-8 text-base md:text-lg text-parchment-dim leading-relaxed max-w-md">
            Pre-curated hampers for every Indian festival and ritual — packed with the
            items your family will actually use, and delivered before the celebration.
          </p>

          <div className="animate-rise stagger-4 mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            {/* Date stamp: the countdown as a datum */}
            <div className="inline-flex items-center gap-5 border border-line rounded-lg bg-ember/60 px-5 py-4">
              <div className="min-w-24">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-parchment-dim">Days until</p>
                <p className="font-mono text-4xl md:text-5xl font-bold text-flame tabular-nums leading-none mt-1.5">
                  {next?.daysLeft ?? "--"}
                </p>
              </div>
              <div className="h-11 w-px bg-line" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-parchment-dim">On the calendar</p>
                <p className="font-mono text-sm text-parchment mt-1.5">
                  {name}
                  <br />
                  {festival ? `${formatDateLabel(festival.date)} · ${year}` : " —"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={festival ? `/products?category=${encodeURIComponent(festival.category)}` : "/products"}
                className="inline-flex items-center justify-center gap-2 bg-flame text-night font-semibold px-7 py-4 text-sm rounded-md hover:bg-marigold transition-colors warm-shadow"
              >
                Shop {festival ? festival.name : "hampers"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#calendar"
                className="inline-flex items-center justify-center gap-2 border border-line text-parchment-dim font-medium px-7 py-4 text-sm rounded-md hover:border-flame hover:text-parchment transition-colors"
              >
                <CalendarDays className="w-4 h-4" /> The year of festivals
              </Link>
            </div>
          </div>

          {/* Ritual vocabulary */}
          {festival && (
            <p className="animate-rise stagger-6 mt-10 font-mono text-xs text-parchment-dim/80">
              <span className="text-flame">What&rsquo;s inside</span>
              <span className="mx-2">·</span>
              {festival.items.join("  ·  ")}
            </p>
          )}
        </div>
      </div>

      {/* Fade into the night below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-night to-transparent" />
    </section>
  );
}
