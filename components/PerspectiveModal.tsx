"use client";

import React, { useEffect } from "react";

export interface PerspectiveCardData {
  category: string;
  categoryBg?: string;
  categoryText?: string;
  perspectivesCount: string;
  title: string;
  description: string;
  tags?: string[];
  reflections: Array<{
    author: string;
    role: string;
    time: string;
    quote: string;
    whatHelped: string;
    likes: number;
  }>;
}

interface PerspectiveModalProps {
  card: PerspectiveCardData | null;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

export default function PerspectiveModal({
  card,
  onClose,
  onJoinWaitlist,
}: PerspectiveModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (card) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [card, onClose]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border-subtle z-10 my-8 overflow-hidden transform transition-all">
        {/* Subtle top ambient tint */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary-container via-tertiary-fixed-dim to-primary-container" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                card.categoryBg || "bg-background-warm-ivory text-primary border border-border-subtle"
              }`}
            >
              {card.category}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                check_circle
              </span>
              {card.perspectivesCount}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background-warm-ivory text-text-muted hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 leading-snug">
          {card.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {card.description}
        </p>

        {/* Live Reflections Feed */}
        <div className="space-y-4 mb-6 max-h-[380px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-text-muted font-semibold pb-1 border-b border-border-subtle">
            <span>Community Perspectives</span>
            <span>Real Lived Experiences</span>
          </div>

          {card.reflections.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-background-warm-ivory/80 border border-border-subtle hover:border-primary/20 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-surface-white font-label-sm text-[11px] flex items-center justify-center font-bold">
                    {item.author[0]}
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    {item.author}
                  </span>
                  <span className="text-xs text-text-muted">• {item.role}</span>
                </div>
                <span className="text-xs text-text-muted">{item.time}</span>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface mb-3 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle/60 text-xs">
                <div className="flex items-center gap-1.5 text-on-tertiary-container font-medium">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                    lightbulb
                  </span>
                  <span><strong>What helped:</strong> {item.whatHelped}</span>
                </div>
                <span className="text-text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                  {item.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 rounded-2xl bg-surface-container/60 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="font-label-sm text-label-sm text-primary font-semibold">
              Want to explore all {card.perspectivesCount}?
            </p>
            <p className="text-xs text-text-muted">
              Join the waitlist to receive access to this topic channel.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onJoinWaitlist();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary-container text-surface-white font-label-sm text-label-sm hover:bg-primary transition shadow-sm whitespace-nowrap"
          >
            Join waitlist for this topic
          </button>
        </div>
      </div>
    </div>
  );
}
