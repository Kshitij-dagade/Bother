"use client";

import React, { useState, useEffect } from "react";
import { addWaitlistEntry, updateWaitlistNote, fetchWaitlistCount } from "@/lib/waitlist";
import Confetti from "@/components/Confetti";
import Ticker from "@/components/Ticker";
import PerspectiveModal, { PerspectiveCardData } from "@/components/PerspectiveModal";
import { heroCardsData, dilemmaCardsData } from "@/lib/dilemmasData";

export default function Home() {
  // Hero Form State
  const [heroEmail, setHeroEmail] = useState("");
  const [heroError, setHeroError] = useState(false);
  const [isHeroSubmitted, setIsHeroSubmitted] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroDocId, setHeroDocId] = useState<string | null>(null);
  const [snippetText, setSnippetText] = useState("");
  const [snippetDisabled, setSnippetDisabled] = useState(false);
  const [snippetLoading, setSnippetLoading] = useState(false);

  // Bottom Form State
  const [bottomEmail, setBottomEmail] = useState("");
  const [bottomSuccess, setBottomSuccess] = useState(false);
  const [bottomLoading, setBottomLoading] = useState(false);

  // Dynamic Firestore waitlist count
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCount() {
      const count = await fetchWaitlistCount();
      if (isMounted && count !== null) {
        setWaitlistCount(count);
      }
    }
    loadCount();
    return () => {
      isMounted = false;
    };
  }, []);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

  // Enhancements: Scroll Progress, Confetti, Perspective Modal, Interactive Steps
  const [scrollProgress, setScrollProgress] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [activeModalCard, setActiveModalCard] = useState<PerspectiveCardData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Step 1 interactive demo state
  const [step1Anonymous, setStep1Anonymous] = useState(false);
  // Step 3 interactive demo outcome tab
  const [step3View, setStep3View] = useState<"action" | "outcome">("outcome");

  // Track scroll progress for sleek header bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Number(currentProgress.toFixed(1)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers for Hero form
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroEmail.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setHeroError(true);
      return;
    }
    setHeroError(false);
    setHeroLoading(true);

    try {
      const docId = await addWaitlistEntry(trimmed, "hero");
      setHeroDocId(docId);
      setIsHeroSubmitted(true);
      setConfettiActive(true);
      setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setIsHeroSubmitted(true);
      setConfettiActive(true);
      setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));
    } finally {
      setHeroLoading(false);
    }
  };

  const setDemoState = (state: "default" | "error" | "success") => {
    if (state === "default") {
      setIsHeroSubmitted(false);
      setHeroError(false);
      setHeroEmail("");
      setHeroDocId(null);
      setSnippetText("");
      setSnippetDisabled(false);
      setConfettiActive(false);
    } else if (state === "error") {
      setIsHeroSubmitted(false);
      setHeroError(true);
      setHeroEmail("not-an-email");
      setConfettiActive(false);
    } else if (state === "success") {
      setIsHeroSubmitted(true);
      setHeroError(false);
      setSnippetText("");
      setSnippetDisabled(false);
      setConfettiActive(true);
    }
  };

  const resetHeroForm = () => {
    setDemoState("default");
  };

  const submitSnippet = async () => {
    if (snippetText.trim() && heroDocId) {
      setSnippetLoading(true);
      try {
        await updateWaitlistNote(heroDocId, snippetText);
      } catch (err) {
        console.error("Error saving note to Firebase:", err);
      } finally {
        setSnippetLoading(false);
      }
    }

    setSnippetText("Thanks for your response! We have noted this down.");
    setSnippetDisabled(true);
    setTimeout(() => {
      resetHeroForm();
    }, 1800);
  };

  const handleCopyInviteLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + "?ref=early-access");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleTickerPromptSelect = (prompt: string) => {
    // Scroll to hero waitlist card and populate note or input
    const waitlistCard = document.getElementById("waitlist-card");
    if (waitlistCard) {
      waitlistCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (isHeroSubmitted) {
      setSnippetText(`Figuring out: "${prompt}"`);
    }
  };

  // Handler for Bottom Waitlist
  const handleBottomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = bottomEmail.trim();
    if (trimmed) {
      setBottomLoading(true);
      try {
        await addWaitlistEntry(trimmed, "bottom");
        setConfettiActive(true);
        setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));
      } catch (err) {
        console.error("Bottom waitlist submission error:", err);
        setConfettiActive(true);
        setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));
      } finally {
        setBottomLoading(false);
      }
      setBottomEmail("");
      setBottomSuccess(true);
    }
  };

  // Handler for FAQ toggle
  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  const faqs = [
    {
      id: 1,
      question: "What is BOTHER?",
      answer:
        "BOTHER is a planned social platform where people can share real-life problems, find people in similar situations, and learn from others' experiences. Rather than focusing on status or performance, it centers on the authentic dilemmas we spend our days trying to untangle.",
    },
    {
      id: 2,
      question: "Is BOTHER free?",
      answer:
        "Yes. The intended consumer experience is free to use. BOTHER plans to support the platform through clearly labelled brand advertising and relevant sponsored solutions, rather than charging consumer subscriptions.",
    },
    {
      id: 3,
      question: "Do I need to share personal details?",
      answer:
        "No. The waitlist only needs your email so we can inform you about beta access. Inside the upcoming platform, the experience is being designed to let users choose what they share, including fully anonymous submissions for sensitive topics.",
    },
    {
      id: 4,
      question: "When will it launch?",
      answer:
        "We're currently working toward our initial alpha/beta launch with community cohorts. Waitlist members will be invited in rollout waves as new problem spaces are opened.",
    },
    {
      id: 5,
      question: "Will brands be allowed to advertise?",
      answer:
        "BOTHER plans to include clearly labelled sponsored solutions that may help with relevant problems. Paid placement must never be presented as an independent community endorsement, and user trust remains paramount.",
    },
  ];

  // Filtered FAQs based on search input
  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );


  const researchTopics = [
    "Career pivot without plan",
    "Making friends in late 20s",
    "Feeling behind in life",
    "Overcoming creative burnout",
    "Solo relocation",
  ];

  return (
    <>
      {/* Celebration Confetti */}
      <Confetti trigger={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Perspective Detail Modal */}
      <PerspectiveModal
        card={activeModalCard}
        onClose={() => setActiveModalCard(null)}
        onJoinWaitlist={() => {
          const el = document.getElementById("waitlist-card");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />

      {/* Header with Scroll Progress Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-warm-ivory/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(40,36,74,0.04)]">
        {/* Subtle reading progress bar */}
        <div
          className="h-[2.5px] bg-secondary-container transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="h-20 max-w-[1200px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center">
            <a
              className="inline-flex items-center transition-opacity hover:opacity-85 group"
              data-path="waitlist-landing"
              href="#"
              aria-label="bother home"
            >
              <img
                src="/logo.png"
                alt="bother."
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </a>
          </div>
          <div className="flex items-center gap-space-lg">
            <nav className="flex items-center gap-space-md" data-active-classes="text-primary font-label-md">
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
                data-path="our-idea"
                href="#how-it-works"
              >
                Our idea
              </a>
              <a
                className="hidden sm:inline-block font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
                href="#real-dilemmas"
              >
                Real dilemmas
              </a>
              <a
                className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
                href="#faq-section"
              >
                FAQ
              </a>
            </nav>
            <a
              className="inline-flex items-center justify-center bg-primary-container text-surface-white font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(40,36,74,0.08)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              data-path="waitlist-landing"
              href="#waitlist-bottom"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("waitlist-bottom");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => {
                  document.getElementById("bottom-email-input")?.focus();
                }, 500);
              }}
            >
              Join the waitlist
            </a>
            {/* Profile Avatar Icon */}
            <div
              className="w-8 h-8 rounded-full bg-surface-white border border-border-subtle shadow-[0_1px_4px_rgba(40,36,74,0.08)] flex items-center justify-center text-primary/70 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
              title="Early Member"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-background-warm-ivory min-h-screen">
        <div className="flex flex-col w-full">
          {/* Top Ambient Background Glow Elements with gentle drifting float */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-40 right-1/4 w-[540px] h-[540px] bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow"></div>
            <div className="absolute top-64 -left-32 w-[460px] h-[460px] bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse"></div>

            {/* 1. HERO SECTION */}
            <section className="max-w-[1160px] mx-auto px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Column: Copy & Form */}
                <div className="lg:col-span-7 flex flex-col items-start">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-white border border-border-subtle shadow-sm mb-6 hover:shadow-md transition-shadow">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                      A new kind of social network
                    </span>
                  </div>
                  <h1 className="font-display-hero text-display-hero text-primary tracking-tight mb-6">
                    You&apos;re not the <br className="hidden sm:inline" />
                    <span className="relative inline-block">
                      <span>only one</span>
                      <svg
                        className="absolute -bottom-2 left-0 w-full h-2 text-secondary-container/40"
                        viewBox="0 0 100 12"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,8 Q50,0 100,8"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                        />
                      </svg>
                    </span>
                    .
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                    Everyone has something they&apos;re trying to figure out. BOTHER helps you find people who&apos;ve been through it, share experiences, and discover what actually helped.
                  </p>

                  {/* Interactive Email Waitlist Box */}
                  <div
                    className="w-full max-w-xl bg-surface-white rounded-2xl p-4 sm:p-5 border border-border-subtle shadow-[0_4px_24px_-4px_rgba(40,36,74,0.07)] transition-all duration-300 relative"
                    id="waitlist-card"
                  >
                    {/* State: Default & Input */}
                    {!isHeroSubmitted ? (
                      <form className="space-y-3" id="hero-waitlist-form" onSubmit={handleHeroSubmit}>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                              <span className="material-symbols-outlined text-[20px]">mail</span>
                            </span>
                            <input
                              className="w-full h-12 pl-10 pr-4 text-on-surface bg-background-warm-ivory/60 border border-border-subtle rounded-xl font-body-md text-body-md placeholder:text-text-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition"
                              id="hero-email-input"
                              placeholder="Your email address"
                              type="email"
                              value={heroEmail}
                              onChange={(e) => {
                                setHeroEmail(e.target.value);
                                if (heroError) setHeroError(false);
                              }}
                            />
                          </div>
                          <button
                            className="h-12 px-7 bg-primary-container text-surface-white font-label-md text-label-md rounded-xl hover:bg-primary transition duration-200 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                            id="hero-submit-btn"
                            type="submit"
                            disabled={heroLoading}
                          >
                            <span>{heroLoading ? "Joining..." : "Join the waitlist"}</span>
                            <span className="material-symbols-outlined text-[18px]">
                              {heroLoading ? "hourglass_empty" : "arrow_forward"}
                            </span>
                          </button>
                        </div>
                        {/* Inline Validation Error Notice */}
                        {heroError && (
                          <div className="flex items-center gap-2 text-secondary text-sm font-medium pt-1" id="hero-validation-error">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>Enter a valid email address.</span>
                          </div>
                        )}
                      </form>
                    ) : (
                      /* State: Success Card */
                      <div className="flex flex-col items-start gap-4 py-2 animate-fadeIn" id="hero-success-state">
                        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/30 text-on-tertiary-container flex items-center justify-center shadow-sm">
                              <span className="material-symbols-outlined text-[22px] font-bold">check</span>
                            </div>
                            <div>
                              <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                                You&apos;re in. Spot reserved!
                              </h4>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                We&apos;ll email you when rollout wave 1 commences.
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-semibold">
                            Waitlist #1,428
                          </div>
                        </div>

                        {/* Referral Share Row */}
                        <div className="w-full p-3 rounded-xl bg-surface-container/60 border border-border-subtle flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <span className="material-symbols-outlined text-[18px] text-primary">share</span>
                            <span>Invite a friend to unlock earlier access:</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyInviteLink}
                            className="px-3 py-1.5 rounded-lg bg-surface-white border border-border-subtle text-primary font-semibold hover:bg-background-warm-ivory transition shadow-xs flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {copiedLink ? "done" : "content_copy"}
                            </span>
                            <span>{copiedLink ? "Link copied!" : "Copy link"}</span>
                          </button>
                        </div>

                        {/* Research Question Modal / Expansion */}
                        <div className="w-full bg-background-warm-ivory rounded-xl p-4 border border-border-subtle mt-1">
                          <label
                            className="block font-label-md text-label-md text-primary mb-1.5"
                            htmlFor="research-snippet"
                          >
                            Optional: What&apos;s something you&apos;ve been trying to figure out lately?
                          </label>

                          {/* Quick topic suggestion chips */}
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {researchTopics.map((topic, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSnippetText(topic)}
                                className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-white border border-border-subtle text-text-muted hover:text-primary hover:border-primary/30 transition"
                              >
                                + {topic}
                              </button>
                            ))}
                          </div>

                          <textarea
                            className="w-full p-3 rounded-lg bg-surface-white border border-border-subtle text-on-surface font-body-sm text-body-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary mb-3 disabled:opacity-75"
                            id="research-snippet"
                            placeholder="Tell us a little about it..."
                            rows={2}
                            value={snippetText}
                            onChange={(e) => setSnippetText(e.target.value)}
                            disabled={snippetDisabled}
                          />
                          <div className="flex items-center justify-between">
                            <button
                              className="font-label-sm text-label-sm text-text-muted hover:text-on-surface transition cursor-pointer"
                              onClick={resetHeroForm}
                              type="button"
                            >
                              Skip for now
                            </button>
                            <button
                              className="px-4 py-2 bg-primary-container text-surface-white rounded-lg font-label-sm text-label-sm hover:bg-primary transition disabled:opacity-50 cursor-pointer"
                              onClick={submitSnippet}
                              disabled={snippetDisabled || snippetLoading}
                              type="button"
                            >
                              {snippetLoading ? "Sending..." : "Send note"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Demo Controls for Reviewer */}
                    <div className="pt-3 mt-3 border-t border-border-subtle/80 flex items-center justify-between text-xs text-text-muted">
                      <span>Preview states:</span>
                      <div className="flex gap-2">
                        <button
                          className={`hover:text-primary underline cursor-pointer ${!isHeroSubmitted && !heroError ? "font-semibold text-primary" : ""}`}
                          onClick={() => setDemoState("default")}
                          type="button"
                        >
                          Default
                        </button>
                        <button
                          className={`hover:text-primary underline cursor-pointer ${heroError ? "font-semibold text-primary" : ""}`}
                          onClick={() => setDemoState("error")}
                          type="button"
                        >
                          Error
                        </button>
                        <button
                          className={`hover:text-primary underline cursor-pointer ${isHeroSubmitted ? "font-semibold text-primary" : ""}`}
                          onClick={() => setDemoState("success")}
                          type="button"
                        >
                          Success
                        </button>
                      </div>
                    </div>
                    {/* Microcopy */}
                    <p className="font-body-sm text-body-sm text-text-muted mt-3">
                      Free for everyone. Be among the first to try it. • We&apos;ll only use your email to share BOTHER launch updates. No spam.
                    </p>
                  </div>

                  {/* Secondary CTA anchor */}
                  <div className="mt-8 flex items-center gap-6">
                    <a
                      className="group inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-secondary transition"
                      href="#how-it-works"
                    >
                      <span>See how it works</span>
                      <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-y-0.5">
                        south
                      </span>
                    </a>
                    <div className="h-4 w-px bg-border-subtle"></div>
                    <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                      <span>
                        {waitlistCount !== null
                          ? `${waitlistCount.toLocaleString()} early thinker${waitlistCount === 1 ? "" : "s"} waiting`
                          : "1,420+ early thinkers waiting"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Motif (Layered Thought Cluster) with rich micro-interactions */}
                <div className="lg:col-span-5 relative">
                  <div className="relative w-full max-w-[440px] mx-auto lg:max-w-none py-6">
                    {/* Category overline pill */}
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                        Things people are figuring out
                      </span>
                      <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">touch_app</span>
                        Click to preview
                      </span>
                    </div>

                    {/* Stacked Overlapping Cards with rich spring-like hover and click physics */}
                    <div className="relative space-y-4">
                      {/* Card 1 */}
                      <div
                        onClick={() => setActiveModalCard(heroCardsData.career)}
                        className="group bg-surface-white rounded-2xl p-5 border border-border-subtle shadow-[0_8px_24px_-4px_rgba(40,36,74,0.06)] transform -rotate-1 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_16px_32px_-6px_rgba(40,36,74,0.12)] hover:border-outline-variant/60 active:scale-[0.98] card-spring-transition cursor-pointer relative"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-background-warm-ivory text-primary font-label-sm text-label-sm border border-border-subtle group-hover:border-primary/20 group-hover:bg-surface-container transition-colors">
                            Career
                          </span>
                          <span className="font-label-sm text-label-sm text-text-muted flex items-center gap-1 group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim group-hover:scale-110 group-hover:text-on-tertiary-container transition-transform duration-200">
                              check_circle
                            </span>
                            34 perspectives
                          </span>
                        </div>
                        <p className="font-headline-sm text-headline-sm text-primary font-bold mb-2 group-hover:text-primary-container transition-colors">
                          &ldquo;I want to quit my job, but I&apos;m scared I&apos;ll regret it.&rdquo;
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Navigating the gap between emotional burnout and financial caution when you have zero backup plan.
                        </p>
                        <div className="pt-3 mt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted group-hover:text-primary">
                          <span>Latest: 4-month runway calculation</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </div>
                      </div>

                      {/* Card 2 (Accented Coral) */}
                      <div
                        onClick={() => setActiveModalCard(heroCardsData.friendships)}
                        className="group bg-surface-white rounded-2xl p-5 border border-border-subtle shadow-[0_12px_28px_-6px_rgba(40,36,74,0.09)] transform translate-x-4 rotate-1 hover:translate-x-3 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_20px_36px_-6px_rgba(174,48,37,0.14)] hover:border-secondary-container/40 active:scale-[0.98] card-spring-transition relative z-10 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm group-hover:bg-secondary-fixed/90 transition-colors">
                            Life &amp; Friendships
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary-container font-semibold group-hover:text-secondary transition-colors">
                            Active topic
                          </span>
                        </div>
                        <p className="font-headline-sm text-headline-sm text-primary font-bold mb-2 group-hover:text-secondary transition-colors">
                          &ldquo;Why is making friends harder after college?&rdquo;
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-text-muted font-body-sm text-body-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:scale-125 transition-transform"></span>
                          <span>19 people sharing what changed in their late 20s</span>
                        </div>
                      </div>

                      {/* Card 3 */}
                      <div
                        onClick={() => setActiveModalCard(heroCardsData.relationships)}
                        className="group bg-surface-white rounded-2xl p-5 border border-border-subtle shadow-[0_6px_20px_-4px_rgba(40,36,74,0.05)] transform -translate-x-2 -rotate-1 hover:translate-x-0 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_14px_28px_-4px_rgba(40,36,74,0.11)] hover:border-outline-variant/60 active:scale-[0.98] card-spring-transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-background-warm-ivory text-primary font-label-sm text-label-sm border border-border-subtle group-hover:border-primary/20 group-hover:bg-surface-container transition-colors">
                            Relationships
                          </span>
                          <span className="font-label-sm text-label-sm text-text-muted">Anonymous post</span>
                        </div>
                        <p className="font-headline-sm text-headline-sm text-primary font-bold group-hover:text-primary-container transition-colors">
                          &ldquo;I have people around me, but I still feel alone sometimes.&rdquo;
                        </p>
                      </div>

                      {/* Card 4 (Ghosted preview bottom) */}
                      <div
                        onClick={() => setActiveModalCard(heroCardsData.moving)}
                        className="group bg-surface-white/90 backdrop-blur rounded-2xl p-4 border border-border-subtle shadow-sm opacity-85 hover:opacity-100 transform translate-y-1 hover:-translate-y-0.5 hover:shadow-md hover:border-outline-variant/50 active:scale-[0.99] card-spring-transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded bg-background-warm-ivory text-text-muted font-label-sm text-label-sm group-hover:bg-surface-container group-hover:text-primary transition-colors">
                            Moving
                          </span>
                          <span className="font-label-sm text-label-sm text-text-muted">Seattle &rarr; Chicago</span>
                        </div>
                        <p className="font-body-md text-body-md text-primary font-medium group-hover:text-primary-container transition-colors">
                          &ldquo;I moved to a new city and haven&apos;t found my people yet.&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Soft background card indicator */}
                    {/* <div className="absolute -bottom-4 right-8 bg-surface-white/80 border border-border-subtle px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-surface-white transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">verified</span>
                      <span className="font-label-sm text-label-sm text-primary">No medical jargon. Real life.</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* LIVE TICKER STRIP: Interactive Stream of Real Dilemmas */}
          {/* <Ticker onSelectPrompt={handleTickerPromptSelect} /> */}

          {/* 2. RELATABLE PROBLEM STRIP */}
          <section className="w-full bg-surface-white border-b border-border-subtle py-20 lg:py-28" id="real-dilemmas">
            <div className="max-w-[1160px] mx-auto px-6 lg:px-8">
              <div className="max-w-2xl mb-14">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                  Real Dilemmas
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2 mb-4">
                  Some things are harder to figure out alone.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Everyday, grounded topics that don&apos;t fit into generic advice columns or clinical check-lists. Click to explore perspectives.
                </p>
              </div>

              {/* Dilemma Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dilemmaCardsData.map((dilemma, idx) => {
                  const iconName =
                    idx === 0 ? "work" : idx === 1 ? "explore" : idx === 2 ? "pace" : "filter_list";
                  return (
                    <div
                      key={dilemma.title}
                      onClick={() => setActiveModalCard(dilemma)}
                      className="bg-background-warm-ivory rounded-2xl p-6 border border-border-subtle flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-surface-white border border-border-subtle flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-surface-white group-hover:scale-110 group-hover:shadow-sm transition-all duration-200">
                          <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-text-muted group-hover:text-primary transition-colors">
                          {dilemma.category}
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary mt-2 mb-3 group-hover:text-primary-container transition-colors font-bold">
                          &ldquo;{dilemma.title}&rdquo;
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          {dilemma.description}
                        </p>
                      </div>
                      <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                        <span className="group-hover:text-primary font-medium transition-colors">
                          {dilemma.perspectivesCount}
                        </span>
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Preview</span>
                          <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                            north_east
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. HOW IT WORKS WITH INTERACTIVE MINI WIDGETS */}
          <section className="max-w-[1160px] mx-auto px-6 lg:px-8 py-24 lg:py-32 scroll-mt-20" id="how-it-works">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                The Process
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2 mb-4">
                A problem is easier when you don&apos;t face it alone.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                No endless scrolls or unhelpful debates. Just shared context and genuine outcomes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 with Interactive Anonymous/Public Toggle */}
              <div className="group bg-surface-white rounded-2xl p-7 sm:p-8 border border-border-subtle shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-surface-white font-label-md text-label-md flex items-center justify-center group-hover:scale-105 group-hover:bg-primary transition-all duration-200 shadow-sm font-bold">
                      1
                    </span>
                    <span className="material-symbols-outlined text-text-muted text-[24px] group-hover:text-primary transition-colors">
                      stylus_note
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 group-hover:text-primary-container transition-colors">
                    Share what&apos;s bothering you
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    Say what&apos;s going on, ask a question, or explain what you&apos;re trying to figure out. You can choose how much to share and post anonymously whenever needed.
                  </p>

                  {/* Interactive Mini-Demo 1: Privacy Switcher */}
                  <div className="p-3.5 rounded-xl bg-background-warm-ivory border border-border-subtle mb-2">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-text-muted font-medium">Interactive Demo:</span>
                      <button
                        type="button"
                        onClick={() => setStep1Anonymous(!step1Anonymous)}
                        className="px-2.5 py-1 rounded-md bg-surface-white border border-border-subtle text-primary font-semibold hover:bg-surface-container transition flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {step1Anonymous ? "visibility_off" : "visibility"}
                        </span>
                        <span>{step1Anonymous ? "Anonymous Mode" : "Public Mode"}</span>
                      </button>
                    </div>
                    <div className="text-xs text-primary font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-surface-white flex items-center justify-center text-[10px] font-bold">
                        {step1Anonymous ? "?" : "J"}
                      </div>
                      <span>{step1Anonymous ? "Anonymous Figurer • Location Hidden" : "Jane Doe • Austin, TX"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-text-muted flex items-center gap-2 group-hover:text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim group-hover:text-on-tertiary-container transition-colors">
                    lock_open
                  </span>
                  <span>Granular privacy &amp; visibility controls</span>
                </div>
              </div>

              {/* Step 2 with Interactive Matching Radar Visual */}
              <div className="group bg-surface-white rounded-2xl p-7 sm:p-8 border border-border-subtle shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-surface-white font-label-md text-label-md flex items-center justify-center group-hover:scale-105 group-hover:bg-primary transition-all duration-200 shadow-sm font-bold">
                      2
                    </span>
                    <span className="material-symbols-outlined text-text-muted text-[24px] group-hover:text-primary transition-colors">
                      diversity_3
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 group-hover:text-primary-container transition-colors">
                    Find people who&apos;ve been there
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    Connect with people experiencing something similar right now and people who have lived through it before and came out the other side.
                  </p>

                  {/* Interactive Mini-Demo 2: Match Preview */}
                  <div className="p-3.5 rounded-xl bg-background-warm-ivory border border-border-subtle mb-2">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-on-tertiary-container font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
                        94% Situation Match
                      </span>
                      <span className="text-text-muted font-medium">14 peers found</span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-surface-white border border-border-subtle text-primary font-medium">
                        Career Pivot
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-white border border-border-subtle text-primary font-medium">
                        Late 20s
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-white border border-border-subtle text-primary font-medium">
                        Solo Journey
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-text-muted flex items-center gap-2 group-hover:text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim group-hover:text-on-tertiary-container transition-colors">
                    hub
                  </span>
                  <span>Matched by shared problem attributes</span>
                </div>
              </div>

              {/* Step 3 with Interactive Outcome Timeline Tab */}
              <div className="group bg-surface-white rounded-2xl p-7 sm:p-8 border border-border-subtle shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-surface-white font-label-md text-label-md flex items-center justify-center group-hover:scale-105 group-hover:bg-primary transition-all duration-200 shadow-sm font-bold">
                      3
                    </span>
                    <span className="material-symbols-outlined text-text-muted text-[24px] group-hover:text-primary transition-colors">
                      task_alt
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 group-hover:text-primary-container transition-colors">
                    Learn what people tried
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    Compare perspectives, explore possible approaches, and come back to share what actually happened so the next person has a clearer path forward.
                  </p>

                  {/* Interactive Mini-Demo 3: Retrospective Outcome */}
                  <div className="p-3.5 rounded-xl bg-background-warm-ivory border border-border-subtle mb-2">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStep3View("action")}
                          className={`px-2 py-0.5 rounded font-semibold transition ${step3View === "action"
                            ? "bg-primary text-surface-white"
                            : "text-text-muted hover:text-primary"
                            }`}
                        >
                          Action
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep3View("outcome")}
                          className={`px-2 py-0.5 rounded font-semibold transition ${step3View === "outcome"
                            ? "bg-primary text-surface-white"
                            : "text-text-muted hover:text-primary"
                            }`}
                        >
                          Outcome
                        </button>
                      </div>
                      <span className="text-text-muted text-[11px] font-medium">96% helpful</span>
                    </div>
                    <p className="text-xs text-primary font-medium leading-relaxed">
                      {step3View === "action"
                        ? "“Negotiated a 4-day trial with manager to balance interviewing.”"
                        : "“Landed new role in 45 days without burnout. Retrospective logged!”"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-text-muted flex items-center gap-2 group-hover:text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim group-hover:text-on-tertiary-container transition-colors">
                    update
                  </span>
                  <span>Outcome logging &amp; retrospective views</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. DIFFERENTIATION SECTION */}
          <section className="w-full bg-background-warm-ivory py-20 lg:py-28 border-t border-border-subtle">
            <div className="max-w-[1160px] mx-auto px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                  The Difference
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2 mb-4">
                  More than answers. Real experiences.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  How BOTHER is intentionally built differently from traditional search results and endless forum threads.
                </p>
              </div>

              {/* 3 Side-by-side comparative cards with subtle interactive contrast */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {/* Comparison 1 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-3.5 bg-background-warm-ivory rounded-xl border border-border-subtle group-hover:border-border-subtle/80 transition-colors">
                      <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-1">
                        Traditional Internet
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">close</span>
                        Generic, one-size-fits-all answers
                      </p>
                    </div>
                    <div className="flex justify-center text-text-muted group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-y-0.5 transition-transform duration-200">
                        arrow_downward
                      </span>
                    </div>
                    <div className="p-4 bg-primary-container text-surface-white rounded-xl group-hover:bg-primary transition-all duration-200 shadow-sm">
                      <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider uppercase block mb-1">
                        With BOTHER
                      </span>
                      <p className="font-headline-sm text-headline-sm font-semibold flex items-start gap-2">
                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          check_circle
                        </span>
                        Experiences from people who have been there.
                      </p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                    Contextual nuance over superficial SEO listicles.
                  </p>
                </div>

                {/* Comparison 2 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-3.5 bg-background-warm-ivory rounded-xl border border-border-subtle group-hover:border-border-subtle/80 transition-colors">
                      <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-1">
                        Traditional Internet
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">close</span>
                        Endless, chaotic comment threads
                      </p>
                    </div>
                    <div className="flex justify-center text-text-muted group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-y-0.5 transition-transform duration-200">
                        arrow_downward
                      </span>
                    </div>
                    <div className="p-4 bg-primary-container text-surface-white rounded-xl group-hover:bg-primary transition-all duration-200 shadow-sm">
                      <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider uppercase block mb-1">
                        With BOTHER
                      </span>
                      <p className="font-headline-sm text-headline-sm font-semibold flex items-start gap-2">
                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          check_circle
                        </span>
                        Discoverable problems and useful approaches.
                      </p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                    Clear indexing by problem type instead of rage-farming algorithms.
                  </p>
                </div>

                {/* Comparison 3 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-3.5 bg-background-warm-ivory rounded-xl border border-border-subtle group-hover:border-border-subtle/80 transition-colors">
                      <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-1">
                        Traditional Internet
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">close</span>
                        Advice with no follow-up or closure
                      </p>
                    </div>
                    <div className="flex justify-center text-text-muted group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-y-0.5 transition-transform duration-200">
                        arrow_downward
                      </span>
                    </div>
                    <div className="p-4 bg-primary-container text-surface-white rounded-xl group-hover:bg-primary transition-all duration-200 shadow-sm">
                      <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider uppercase block mb-1">
                        With BOTHER
                      </span>
                      <p className="font-headline-sm text-headline-sm font-semibold flex items-start gap-2">
                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          check_circle
                        </span>
                        A chance to see what people tried &amp; how it went.
                      </p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                    Real outcomes and retrospective reflection loops.
                  </p>
                </div>
              </div>

              {/* Prominent Callout Quote Box */}
              <div className="w-full bg-primary-container text-surface-white rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.005]">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-tertiary-fixed/15 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[38px] mb-4">
                    format_quote
                  </span>
                  <blockquote className="font-headline-md text-headline-md font-bold tracking-tight text-surface-white mb-6 leading-snug">
                    &ldquo;BOTHER is built around the problem, the people who understand it, and the experiences that may help.&rdquo;
                  </blockquote>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-white/10 text-primary-fixed-dim font-label-sm text-label-sm border border-surface-white/15">
                    <span>Human-centered social platform</span>
                    <span>•</span>
                    <span>Problem-first design</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. COMMUNITY PROMISE & PRIVACY */}
          <section className="max-w-[1160px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column Copy */}
              <div className="lg:col-span-5">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                  Integrity &amp; Trust
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2 mb-6">
                  Be honest. Be human. Be respectful.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
                  Some problems are personal. BOTHER is being designed to give people a more comfortable way to share what they&apos;re figuring out, find understanding, and learn from others.
                </p>
                <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                  People should be able to choose what they share and whether they participate publicly or anonymously, subject to transparent community safety guidelines.
                </p>
              </div>

              {/* Right Column Trust Cards (3 Cards) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Card 1 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-outline-variant/60 transition-all duration-200 flex items-start gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-background-warm-ivory border border-border-subtle flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary-container group-hover:text-surface-white transition-all duration-200">
                    <span className="material-symbols-outlined text-[22px]">visibility_off</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1 group-hover:text-primary-container transition-colors font-bold">
                      You choose what to share
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Public or anonymous options are baked into the core structure. You control your profile visibility and can participate in sensitive discussions without tying your name to the prompt.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-outline-variant/60 transition-all duration-200 flex items-start gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-background-warm-ivory border border-border-subtle flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary-container group-hover:text-surface-white transition-all duration-200">
                    <span className="material-symbols-outlined text-[22px]">campaign</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1 group-hover:text-primary-container transition-colors font-bold">
                      Sponsored content will be clearly labelled
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Monetization will never rely on covert shilling. If a brand solution or tool is sponsored, it will be conspicuously labelled so community discussions remain authentic and unmanipulated.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="group bg-surface-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-outline-variant/60 transition-all duration-200 flex items-start gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-background-warm-ivory border border-border-subtle flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary-container group-hover:text-surface-white transition-all duration-200">
                    <span className="material-symbols-outlined text-[22px]">medical_services</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1 group-hover:text-primary-container transition-colors font-bold">
                      Community recommendations are not medical advice
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      BOTHER is an empathetic forum for lived human experience, never a clinical diagnosis service or substitute for qualified mental health or medical professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. WAITLIST CTA SECTION */}
          <section className="max-w-[1160px] mx-auto px-6 lg:px-8 pb-20" id="waitlist-bottom">
            <div className="w-full bg-primary-container text-surface-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-primary-container shadow-2xl relative overflow-hidden">
              {/* Ambient Backdrops with float */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary-container/25 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none animate-float-reverse"></div>

              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-white/10 text-surface-white text-xs font-semibold uppercase tracking-wider mb-6 border border-surface-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                  <span>Early Access Wave 1</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-surface-white mb-4">
                  Be there from the beginning.
                </h2>
                <p className="font-body-lg text-body-lg text-surface-container-high max-w-xl mx-auto mb-8 leading-relaxed">
                  We&apos;re building a place for the things people are trying to figure out together. Join the waitlist and be among the first to try BOTHER.
                </p>

                {/* Inline CTA Form with Coral Button */}
                <form className="max-w-md mx-auto mb-4" id="bottom-waitlist-form" onSubmit={handleBottomSubmit}>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      className="w-full h-12 px-4 rounded-xl text-primary bg-surface-white border border-transparent font-body-md text-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container shadow-sm"
                      id="bottom-email-input"
                      placeholder="Your email address"
                      required
                      type="email"
                      value={bottomEmail}
                      onChange={(e) => setBottomEmail(e.target.value)}
                    />
                    <button
                      className="h-12 px-7 bg-secondary-container text-surface-white font-label-md text-label-md rounded-xl hover:opacity-95 transition duration-200 shadow-md font-semibold whitespace-nowrap active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                      id="bottom-submit-btn"
                      type="submit"
                      disabled={bottomLoading}
                    >
                      {bottomLoading ? "Joining..." : "Join the waitlist"}
                    </button>
                  </div>
                  {bottomSuccess && (
                    <div className="text-tertiary-fixed font-label-sm text-label-sm mt-3 animate-fadeIn flex items-center justify-center gap-1.5" id="bottom-success-msg">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>You&apos;re on the list! We&apos;ll reach out soon.</span>
                    </div>
                  )}
                </form>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                  Free for everyone. No spam, ever.
                </p>
              </div>
            </div>
          </section>

          {/* 7. FAQ SECTION WITH INTERACTIVE SEARCH */}
          <section className="max-w-[840px] mx-auto px-6 lg:px-8 py-20 lg:py-28 border-t border-border-subtle" id="faq-section">
            <div className="text-center mb-8">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                Answers
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2 mb-3">
                Frequently asked questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                Everything you might want to know about our approach, security, and roadmap.
              </p>
            </div>

            {/* Quick search input */}
            <div className="max-w-md mx-auto mb-10 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search questions (e.g. free, launch, privacy...)"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-white border border-border-subtle text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-container shadow-xs placeholder:text-text-muted transition"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Accordion Wrapper */}
            <div className="space-y-4" id="faq-accordion">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = activeFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-surface-white rounded-2xl border border-border-subtle overflow-hidden hover:border-outline-variant/70 hover:shadow-sm transition duration-200"
                    >
                      <button
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none group cursor-pointer"
                        onClick={() => toggleFaq(faq.id)}
                        type="button"
                      >
                        <span className="font-headline-sm text-headline-sm text-primary font-semibold group-hover:text-secondary transition duration-200">
                          {faq.question}
                        </span>
                        <span
                          className={`material-symbols-outlined text-primary text-[24px] transition-transform duration-300 ease-out shrink-0 group-hover:scale-110 ${isOpen ? "rotate-180 text-secondary" : "rotate-0"
                            }`}
                          id={`faq-icon-${faq.id}`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div
                          className="px-5 sm:px-6 pb-6 text-on-surface-variant font-body-md text-body-md leading-relaxed border-t border-border-subtle/50 pt-4 animate-fadeIn"
                          id={`faq-ans-${faq.id}`}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  No matching questions found for &ldquo;{faqSearch}&rdquo;. Try another keyword!
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-background-warm-ivory py-16 shadow-[0_-1px_8px_rgba(40,36,74,0.03)] border-t border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg pb-space-lg">
            <div className="space-y-space-xs">
              <a href="#" className="inline-block transition-opacity hover:opacity-85" aria-label="bother home">
                <img
                  src="/logo.png"
                  alt="bother."
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </a>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Everyone has something.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-space-lg" data-active-classes="text-primary font-label-sm">
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
                data-path="privacy-policy"
                href="#"
              >
                Privacy
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
                data-path="terms-of-service"
                href="#"
              >
                Terms
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
                data-path="contact"
                href="#"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-text-muted font-body-sm text-body-sm">
            <p>BOTHER is in development.</p>
            <p>© 2025 bother. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
