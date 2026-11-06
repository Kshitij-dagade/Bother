"use client";

import React from "react";

interface TickerProps {
  onSelectPrompt?: (prompt: string) => void;
}

const prompts = [
  { topic: "Career", text: "How do you leave a stable role when you have zero backup plan?", count: "34 shared" },
  { topic: "Friendship", text: "Why is making close friends harder after 25?", count: "58 shared" },
  { topic: "Moving", text: "Moved to Chicago alone and struggling with weekend loneliness.", count: "21 shared" },
  { topic: "Milestones", text: "Am I the only one who feels behind on life timelines?", count: "91 shared" },
  { topic: "Burnout", text: "Recovering from startup burnout without taking a 6-month gap.", count: "46 shared" },
  { topic: "Decisions", text: "How do you tell genuine gut feeling from just fear?", count: "39 shared" },
  { topic: "Creative", text: "Paralyzed by creative perfectionism on my first side project.", count: "28 shared" },
  { topic: "Family", text: "Setting emotional boundaries with parents without guilt.", count: "63 shared" },
];

export default function Ticker({ onSelectPrompt }: TickerProps) {
  return (
    <div className="w-full bg-surface-white border-y border-border-subtle py-3.5 overflow-hidden relative">
      {/* Side blur fades for seamless look */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-surface-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-surface-white to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        <div className="shrink-0 pl-6 pr-4 flex items-center gap-2 border-r border-border-subtle z-20 bg-surface-white">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="font-label-sm text-[12px] uppercase tracking-wider text-primary font-bold whitespace-nowrap">
            Live Figuring Out
          </span>
        </div>

        <div className="flex overflow-hidden select-none">
          <div className="flex shrink-0 items-center gap-3 animate-marquee">
            {[...prompts, ...prompts].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt && onSelectPrompt(item.text)}
                className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-background-warm-ivory border border-border-subtle hover:border-primary/40 hover:bg-surface-container transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-white text-primary border border-border-subtle/80">
                  {item.topic}
                </span>
                <span className="font-body-sm text-body-sm text-primary group-hover:text-primary-container font-medium">
                  &ldquo;{item.text}&rdquo;
                </span>
                <span className="text-[11px] text-text-muted">
                  • {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
