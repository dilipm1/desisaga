"use client";

import Link from "next/link";
import { DATED_FESTIVALS, ANYTIME_RITUALS, getDaysLeft, formatDateLabel, useToday } from "@/lib/festivals";

export default function YearCalendar() {
  const today = useToday();
  const dated = DATED_FESTIVALS.map((f) => ({ festival: f, daysLeft: getDaysLeft(f.date, today) }));

  return (
    <section id="calendar" className="relative py-24 md:py-32 bg-night">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-flame mb-4">
            The festival calendar
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-parchment">
            One hamper for every date worth keeping.
          </h2>
          <p className="mt-5 text-parchment-dim leading-relaxed">
            Festivals run on dates, not seasons. We keep the calendar, so you never
            have to — every hamper is shipped to arrive before its celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {dated.map(({ festival, daysLeft }, i) => {
            const passed = daysLeft < 0;
            const upNext = !passed && dated.findIndex((d) => d.daysLeft >= 0) === i;
            return (
              <Link
                key={festival.id}
                href={`/products?category=${encodeURIComponent(festival.category)}`}
                className={`group relative rounded-lg border p-5 transition-all duration-300 ${
                  passed
                    ? "border-line/50 bg-ember/40 opacity-60"
                    : upNext
                      ? "border-flame/60 bg-ember hover:bg-ember-light warm-shadow"
                      : "border-line bg-ember hover:border-flame/40 hover:bg-ember-light"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-parchment-dim">
                    {formatDateLabel(festival.date)} <span className="opacity-60">{festival.date.slice(0, 4)}</span>
                  </span>
                  {upNext && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-night bg-flame px-2 py-0.5 rounded-sm">
                      Up next
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl text-parchment mt-4 group-hover:text-flame transition-colors">
                  {festival.name}
                </h3>

                <p className="text-sm text-parchment-dim mt-1.5 leading-snug">{festival.ritual}</p>

                <p className="font-mono text-xs mt-4 text-flame">
                  {passed ? "past for this year" : `in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Occasions with no fixed date */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-parchment-dim">
              Occasions, not dates
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANYTIME_RITUALS.map((f) => (
              <Link
                key={f.id}
                href={`/products?category=${encodeURIComponent(f.category)}`}
                className="group rounded-lg border border-line bg-ember/60 p-5 hover:border-flame/40 hover:bg-ember-light transition-all duration-300"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-marigold">Anytime</span>
                <h3 className="font-display text-xl text-parchment mt-3 group-hover:text-flame transition-colors">
                  {f.name}
                </h3>
                <p className="text-sm text-parchment-dim mt-1.5">{f.ritual}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
