"use client";

import { useState } from "react";
import { ArrowRight, Swords, Wine, Sparkles, Globe, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length >= 4) {
      router.push(`/join/${code}`);
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col safe-top safe-bottom">
      {/* ══════════ TOP HALF — Butter zone (Join / Host) ══════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-widget-wine/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-cherry flex items-center justify-center mb-4 float-action">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <path d="M24 4 C24 4 20 16 20 22 L20 38 C20 42 22 44 24 44 C26 44 28 42 28 38 L28 22 C28 16 24 4 24 4 Z" fill="white" opacity="0.9" />
                <path d="M22 2 L26 2 L24 8 Z" fill="white" opacity="0.7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Winebob
            </h1>
            <p className="text-[14px] text-muted mt-2 text-center max-w-[260px]">
              Blind tasting made social. Join an event or host your own.
            </p>
          </div>

          {/* Join with code */}
          <form onSubmit={handleJoin} className="mb-5">
            <label className="text-[13px] font-bold text-foreground uppercase tracking-wide mb-2.5 block">
              Got a code? Join a tasting
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="WINE42"
                maxLength={8}
                className="input-field flex-1 text-center text-xl font-mono font-bold tracking-[0.2em] placeholder:text-muted/30 placeholder:font-normal placeholder:text-base placeholder:tracking-normal"
              />
              <button
                type="submit"
                disabled={joinCode.trim().length < 4}
                className="h-[52px] w-[52px] rounded-2xl bg-cherry text-white flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform float-action flex-shrink-0"
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-[11px] font-medium text-muted">or</span>
            <div className="flex-1 h-px bg-card-border" />
          </div>

          {/* Host CTA */}
          <Link
            href="/arena"
            className="wine-card w-full py-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Swords size={20} className="text-cherry" />
            <span className="font-bold text-[15px] text-foreground">Host a Blind Tasting</span>
          </Link>
          <p className="text-[11px] text-muted mt-2 text-center">
            Sign in required to host events
          </p>
        </div>
      </div>

      {/* ══════════ BOTTOM HALF — Cherry zone (Explore universe) ══════════ */}
      <div className="flex-1 bg-cherry-gradient flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm text-center">
          {/* Feature pills */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/80 text-[11px] font-semibold">
              <Wine className="h-3 w-3" /> 200+ wines
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/80 text-[11px] font-semibold">
              <Globe className="h-3 w-3" /> 16 countries
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/80 text-[11px] font-semibold">
              <Users className="h-3 w-3" /> Live events
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Explore the Universe
          </h2>
          <p className="text-[14px] text-white/60 mb-8 max-w-[280px] mx-auto">
            Browse wines, build your cellar, join live global tastings, and discover new favorites.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs py-4 rounded-2xl bg-white text-cherry font-bold text-[16px] active:scale-[0.98] transition-transform shadow-lg shadow-black/20"
          >
            <Sparkles className="h-5 w-5" />
            Get Started
          </Link>
          <p className="text-[11px] text-white/40 mt-3">
            Free account — takes 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
