"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Wine, BadgeCheck, Radio, Users, Star,
  ArrowRight, CheckCircle2, Sparkles, Trophy, Eye, Mic,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { createSommelierProfile } from "@/lib/liveActions";

const EXPERTISE_OPTIONS = [
  "French", "Italian", "Spanish", "Portuguese", "German", "Austrian",
  "New World", "Natural", "Biodynamic", "Sparkling", "Champagne",
  "Burgundy", "Bordeaux", "Rh\u00f4ne", "Piedmont", "Tuscany", "Rioja",
];

const CERT_OPTIONS = [
  "WSET Level 1", "WSET Level 2", "WSET Level 3", "WSET Diploma",
  "Court of Master Sommeliers - Intro", "Court of Master Sommeliers - Certified",
  "Court of Master Sommeliers - Advanced", "Master Sommelier",
  "Wine & Spirit Education Trust", "Certified Wine Educator",
];

const BENEFITS = [
  { icon: Radio, title: "Go Live Anytime", desc: "Host blind tasting sessions with real-time audience interaction" },
  { icon: Users, title: "Build Your Audience", desc: "Grow a following of wine enthusiasts who love your style" },
  { icon: Trophy, title: "Gamified Engagement", desc: "Viewers compete with hints, scores, and leaderboards" },
  { icon: TrendingUp, title: "Track Your Impact", desc: "See your stats grow — events hosted, viewers, and ratings" },
];

const STEPS = [
  { num: 1, title: "Create Your Profile", desc: "Add your name, bio, and expertise areas" },
  { num: 2, title: "Set Up a Tasting", desc: "Choose wines, prepare hints, and schedule your event" },
  { num: 3, title: "Go Live", desc: "Host your session while viewers guess along in real time" },
];

export default function BecomeSommelierPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [step, setStep] = useState<"intro" | "form">("intro");

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  function toggleExpertise(item: string) {
    setExpertise((prev) => prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]);
  }

  function toggleCert(item: string) {
    setCertifications((prev) => prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setError("Display name is required"); return; }
    setError("");

    startTransition(async () => {
      try {
        await createSommelierProfile({
          displayName: displayName.trim(),
          bio: bio.trim() || undefined,
          expertise,
          certifications,
        });
        router.push("/sommeliers");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create profile");
      }
    });
  }

  // ============ INTRO / LANDING ============
  if (step === "intro") {
    return (
      <div className="min-h-screen pb-28">
        {/* Back button */}
        <div className="container-app pt-6">
          <Link
            href="/sommeliers"
            className="inline-flex items-center gap-1 text-[12px] font-semibold touch-target"
            style={{ color: "#7A7068" }}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 20%, rgba(220, 40, 50, 0.1) 0%, transparent 60%)",
            }}
          />
          <div className="container-app pt-6 pb-8 relative text-center">
            <div
              className="h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-fade-in-up"
              style={{
                background: "linear-gradient(135deg, rgba(220, 40, 50, 0.15) 0%, rgba(220, 40, 50, 0.05) 100%)",
                boxShadow: "0 0 60px rgba(220, 40, 50, 0.1)",
              }}
            >
              <Mic className="h-9 w-9 text-red-400/70" />
            </div>
            <h1
              className="text-[28px] font-bold tracking-tight mb-3 animate-fade-in-up"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}
            >
              Become a Sommelier
            </h1>
            <p className="text-[15px] leading-relaxed max-w-[300px] mx-auto animate-fade-in-up" style={{ color: "#7A7068" }}>
              Host live blind tasting events, share your knowledge, and build a community of wine lovers.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="container-app">
          <div className="grid grid-cols-2 gap-3 mb-8">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="rounded-[20px] p-4 animate-fade-in-up"
                style={{
                  background: "#1C1916",
                  border: "1px solid rgba(255,255,255,0.05)",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(220, 40, 50, 0.08)" }}
                >
                  <b.icon className="h-5 w-5 text-red-400/60" />
                </div>
                <h3 className="text-[13px] font-bold mb-1" style={{ color: "#FAF6EF" }}>{b.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "#7A7068" }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <h2 className="text-[14px] font-bold uppercase tracking-wide mb-4" style={{ color: "#7A7068" }}>
              How It Works
            </h2>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  className="flex items-start gap-4 rounded-[20px] p-4 animate-fade-in-up"
                  style={{
                    background: "#1C1916",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animationDelay: `${(i + 4) * 80}ms`,
                  }}
                >
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-[14px] font-bold flex-shrink-0"
                    style={{
                      background: i === 0
                        ? "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)"
                        : "rgba(255,255,255,0.05)",
                      color: i === 0 ? "white" : "#7A7068",
                    }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold" style={{ color: "#FAF6EF" }}>{s.title}</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7A7068" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div
            className="rounded-[20px] p-5 mb-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(220, 40, 50, 0.06) 0%, rgba(220, 40, 50, 0.02) 100%)",
              border: "1px solid rgba(220, 40, 50, 0.08)",
            }}
          >
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-[13px] italic leading-relaxed" style={{ color: "#EDE4D4" }}>
              &ldquo;Hosting on Winebob is amazing — the live guessing makes it way more
              engaging than any tasting I&apos;ve ever done.&rdquo;
            </p>
            <p className="text-[11px] font-semibold mt-2" style={{ color: "#7A7068" }}>
              — Community Sommelier
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep("form")}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-bold text-white active:scale-[0.98] transition-transform touch-target"
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
              boxShadow: "0 4px 20px rgba(220, 40, 50, 0.4)",
            }}
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </button>

          <p className="text-center text-[11px] mt-3" style={{ color: "#7A7068" }}>
            Free to join — no commitments required
          </p>
        </div>
      </div>
    );
  }

  // ============ PROFILE FORM ============
  return (
    <div className="min-h-screen pb-28">
      <div className="container-app pt-6">
        <button
          onClick={() => setStep("intro")}
          className="inline-flex items-center gap-1 text-[12px] font-semibold touch-target mb-6"
          style={{ color: "#7A7068" }}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full" style={{ width: "33%", background: "#DC2626" }} />
          </div>
          <span className="text-[11px] font-bold" style={{ color: "#7A7068" }}>Step 1 of 1</span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
              boxShadow: "0 4px 14px rgba(220, 40, 50, 0.3)",
            }}
          >
            <Wine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1
              className="text-[22px] font-bold tracking-tight"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}
            >
              Your Profile
            </h1>
            <p className="text-[13px]" style={{ color: "#7A7068" }}>
              This is how viewers will see you
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Display Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide block mb-2" style={{ color: "#7A7068" }}>
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you'll appear to viewers"
              className="w-full touch-target rounded-2xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all"
              style={{
                background: "#1C1916",
                border: "1.5px solid rgba(255,255,255,0.08)",
                color: "#FAF6EF",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(220, 40, 50, 0.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide block mb-2" style={{ color: "#7A7068" }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell viewers about your wine journey, what regions excite you, how long you've been in the industry..."
              rows={3}
              className="w-full rounded-2xl px-4 py-3.5 text-[15px] font-medium outline-none resize-none transition-all"
              style={{
                background: "#1C1916",
                border: "1.5px solid rgba(255,255,255,0.08)",
                color: "#FAF6EF",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(220, 40, 50, 0.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <p className="text-[11px] mt-1.5" style={{ color: "#7A7068" }}>
              A good bio helps viewers know what to expect from your tastings
            </p>
          </div>

          {/* Expertise */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide block mb-2" style={{ color: "#7A7068" }}>
              Expertise Areas
            </label>
            <p className="text-[12px] mb-3" style={{ color: "#7A7068" }}>
              Select the regions and styles you know best
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleExpertise(item)}
                  className="px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95"
                  style={expertise.includes(item)
                    ? {
                        background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(220, 40, 50, 0.25)",
                      }
                    : {
                        background: "#1C1916",
                        color: "#7A7068",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                  }
                >
                  {expertise.includes(item) && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide block mb-2" style={{ color: "#7A7068" }}>
              Certifications
            </label>
            <p className="text-[12px] mb-3" style={{ color: "#7A7068" }}>
              Optional — verified certifications build trust with viewers
            </p>
            <div className="flex flex-wrap gap-2">
              {CERT_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleCert(item)}
                  className="px-3 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95 flex items-center gap-1.5"
                  style={certifications.includes(item)
                    ? {
                        background: "rgba(220, 40, 50, 0.12)",
                        color: "#EF4444",
                        border: "1px solid rgba(220, 40, 50, 0.3)",
                      }
                    : {
                        background: "#1C1916",
                        color: "#7A7068",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                  }
                >
                  <BadgeCheck className="h-3 w-3" />
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl p-3" style={{ background: "rgba(220, 40, 50, 0.1)", border: "1px solid rgba(220, 40, 50, 0.2)" }}>
              <p className="text-red-400 text-[13px] font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-bold text-white active:scale-[0.98] transition-transform touch-target disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
              boxShadow: "0 4px 20px rgba(220, 40, 50, 0.4)",
            }}
          >
            {isPending ? (
              <>Creating your profile...</>
            ) : (
              <>
                Create Sommelier Profile <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
