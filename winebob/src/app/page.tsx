"use client";

import { useState } from "react";
import { ArrowRight, Wine, Sparkles, Globe, Users, MapPin, Grape, Radio, Trophy, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length >= 4) router.push(`/join/${code}`);
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F5]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, #74070E 0%, #5A0509 55%, #3A0306 100%)" }} />
        {/* Subtle grape cluster decoration */}
        <div className="absolute top-8 right-8 text-[120px] opacity-[0.04] pointer-events-none select-none">🍇</div>
        <div className="absolute bottom-12 left-8 text-[80px] opacity-[0.04] pointer-events-none select-none rotate-12">🍷</div>

        <div className="relative z-10 px-5 pt-14 pb-16 max-w-lg mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-[10px] bg-white/15 flex items-center justify-center">
              <Wine className="h-5 w-5 text-white" />
            </div>
            <span className="text-[20px] font-bold text-white tracking-tight font-serif">Winebob</span>
          </div>

          {/* Headline */}
          <h1 className="text-[36px] md:text-[44px] font-bold text-white tracking-tight leading-[1.08] font-serif">
            Blind tasting,<br />made social.
          </h1>
          <p className="text-[16px] text-white/55 mt-4 max-w-[320px] leading-relaxed">
            Host tastings with friends, explore wine regions on an interactive map, and discover your palate.
          </p>

          {/* Join code */}
          <form onSubmit={handleJoin} className="mt-8">
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Got a code?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="WINE42"
                maxLength={8}
                className="flex-1 h-12 rounded-[10px] bg-white/10 border border-white/10 text-center text-[18px] font-mono font-bold tracking-[0.2em] text-white placeholder:text-white/20 placeholder:font-normal placeholder:text-[14px] placeholder:tracking-normal focus:outline-none focus:bg-white/15 focus:border-white/20 transition-colors"
              />
              <button
                type="submit"
                disabled={joinCode.trim().length < 4}
                className="h-12 w-12 rounded-[10px] bg-white text-cherry flex items-center justify-center disabled:opacity-20 hover:bg-white/90 transition-colors flex-shrink-0"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          {/* Quick actions */}
          <div className="flex gap-2 mt-5">
            <Link href="/arena" className="flex-1 h-11 rounded-[10px] bg-white/10 border border-white/[0.08] flex items-center justify-center gap-2 text-[13px] font-semibold text-white/80 hover:bg-white/15 transition-colors">
              <Trophy className="h-4 w-4" /> Host Tasting
            </Link>
            <Link href="/explore" className="flex-1 h-11 rounded-[10px] bg-white/10 border border-white/[0.08] flex items-center justify-center gap-2 text-[13px] font-semibold text-white/80 hover:bg-white/15 transition-colors">
              <MapPin className="h-4 w-4" /> Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is Winebob ── */}
      <section className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-6 text-center">What you can do</h2>

        <div className="space-y-3">
          <FeatureCard
            icon={<Trophy className="h-5 w-5 text-cherry" />}
            bg="bg-cherry/8"
            title="Blind Tasting Arena"
            desc="Host competitive tastings. Guests guess grape, region, vintage — see who has the best palate."
            href="/arena"
          />
          <FeatureCard
            icon={<MapPin className="h-5 w-5 text-emerald-600" />}
            bg="bg-emerald-50"
            title="Interactive Wine Map"
            desc="Explore 28 wine regions. Discover producers, browse wines, book experiences at wineries."
            href="/explore"
          />
          <FeatureCard
            icon={<Radio className="h-5 w-5 text-purple-600" />}
            bg="bg-purple-50"
            title="Live Sommelier Events"
            desc="Join real-time tastings hosted by sommeliers. Guess along, compete, and learn together."
            href="/live"
          />
          <FeatureCard
            icon={<Grape className="h-5 w-5 text-amber-600" />}
            bg="bg-amber-50"
            title="Your Wine Journey"
            desc="Track tastings, build your cellar, discover your taste profile. Your personal wine passport."
            href="/journey"
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-5 pb-12 max-w-lg mx-auto">
        <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 text-center">How it works</h2>
        <div className="bg-white rounded-[14px] border border-card-border/60 overflow-hidden divide-y divide-card-border/30">
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="h-8 w-8 rounded-[8px] bg-cherry text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0">1</span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">Pick your wines</p>
              <p className="text-[11px] text-muted">Choose from our database or add your own</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="h-8 w-8 rounded-[8px] bg-cherry/8 text-cherry flex items-center justify-center text-[13px] font-bold flex-shrink-0">2</span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">Share the code</p>
              <p className="text-[11px] text-muted">Friends join instantly — no account needed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="h-8 w-8 rounded-[8px] bg-cherry/8 text-cherry flex items-center justify-center text-[13px] font-bold flex-shrink-0">3</span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">Taste & guess</p>
              <p className="text-[11px] text-muted">Grape, region, vintage — who has the best palate?</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="px-5 pb-12 max-w-lg mx-auto">
        <div className="rounded-[14px] p-6 text-center" style={{ background: "linear-gradient(135deg, #74070E 0%, #5A0509 100%)" }}>
          <Sparkles className="h-6 w-6 text-white/40 mx-auto mb-3" />
          <h3 className="text-[18px] font-bold text-white font-serif mb-1">Ready to taste?</h3>
          <p className="text-[13px] text-white/50 mb-5">Free to join. No credit card needed.</p>
          <div className="flex gap-2 max-w-[320px] mx-auto">
            <Link href="/login?callbackUrl=/arena" className="flex-1 h-11 rounded-[10px] bg-white text-cherry flex items-center justify-center gap-2 text-[13px] font-bold hover:bg-white/90 transition-colors">
              Sign Up Free
            </Link>
            <Link href="/explore" className="flex-1 h-11 rounded-[10px] bg-white/15 text-white flex items-center justify-center gap-2 text-[13px] font-semibold hover:bg-white/20 transition-colors">
              Explore First
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 pb-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <div className="flex items-center gap-2">
            <Wine className="h-3.5 w-3.5 text-cherry/40" />
            <span className="font-semibold">Winebob</span>
          </div>
          <div className="flex gap-4">
            <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
            <Link href="/arena" className="hover:text-foreground transition-colors">Arena</Link>
            <Link href="/live" className="hover:text-foreground transition-colors">Live</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, bg, title, desc, href }: { icon: React.ReactNode; bg: string; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group flex items-start gap-4 p-4 rounded-[14px] bg-white border border-card-border/60 hover:border-cherry/20 transition-all">
      <div className={`h-10 w-10 rounded-[10px] ${bg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
        <p className="text-[12px] text-muted mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted/30 group-hover:text-cherry/50 transition-colors flex-shrink-0 mt-1" />
    </Link>
  );
}
