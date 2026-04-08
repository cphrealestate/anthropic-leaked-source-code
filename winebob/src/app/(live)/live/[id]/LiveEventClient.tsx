"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Radio, ChevronLeft, Users, Wine, Clock, Check, Send,
  Loader2, Trophy, Crown, Sparkles, Eye, BadgeCheck,
  Grape, MapPin, Globe, Tag, Heart, Flame, ThumbsUp,
  Zap, Star, Share2,
} from "lucide-react";
import { getLiveEventById, submitLiveGuess, getCrowdStats, joinLiveEvent } from "@/lib/liveActions";

type EventData = NonNullable<Awaited<ReturnType<typeof getLiveEventById>>>;
type LiveWineWithDetails = EventData["wines"][number];

const POLL_INTERVAL = 2000;

// Reaction emojis for live feedback
const REACTIONS = [
  { emoji: "\ud83c\udf77", label: "Wine" },
  { emoji: "\ud83d\udd25", label: "Fire" },
  { emoji: "\ud83e\udd2f", label: "Mind Blown" },
  { emoji: "\ud83d\udc4f", label: "Clap" },
  { emoji: "\u2764\ufe0f", label: "Love" },
  { emoji: "\ud83e\udd14", label: "Thinking" },
];

// Floating reaction component
function FloatingReaction({ emoji, id }: { emoji: string; id: number }) {
  return (
    <div
      key={id}
      className="absolute pointer-events-none text-[24px]"
      style={{
        bottom: 0,
        left: `${20 + Math.random() * 60}%`,
        animation: "floatUp 2s ease-out forwards",
        opacity: 0,
      }}
    >
      {emoji}
    </div>
  );
}

// Wine flight progress bar
function FlightProgress({ wines, currentPosition }: { wines: EventData["wines"]; currentPosition: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {wines.map((w, i) => (
        <div key={w.id} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full h-1.5 rounded-full transition-all duration-500"
            style={{
              background: w.revealed
                ? "#22C55E"
                : w.position === currentPosition
                  ? "#DC2626"
                  : "rgba(255,255,255,0.08)",
              boxShadow: w.position === currentPosition ? "0 0 8px rgba(220, 40, 50, 0.4)" : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ============ MAIN COMPONENT ============

export function LiveEventClient({ event: initialEvent }: { event: EventData }) {
  const router = useRouter();
  const [event, setEvent] = useState(initialEvent);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  // Guess form
  const [form, setForm] = useState({ grape: "", region: "", country: "", vintage: "", producer: "", type: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [guessSubmitted, setGuessSubmitted] = useState(false);

  // Crowd stats
  const [crowd, setCrowd] = useState<{ stats: Record<string, Record<string, number>>; totalGuesses: number } | null>(null);

  // Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string }[]>([]);
  const reactionCounter = useRef(0);

  // Current wine tracking
  const currentWineIdx = event.wines.findIndex((w) => !w.revealed);
  const currentWine = currentWineIdx >= 0 ? event.wines[currentWineIdx] : null;
  const lastRevealed = [...event.wines].reverse().find((w) => w.revealed);
  const revealedHints = currentWine?.hints.filter((h) => h.revealed) ?? [];

  // Check localStorage for existing session
  useEffect(() => {
    const storedPid = localStorage.getItem(`live-${event.id}-pid`);
    const storedToken = localStorage.getItem(`live-${event.id}-token`);
    if (storedPid && storedToken) {
      setParticipantId(storedPid);
      setSessionToken(storedToken);
      setJoined(true);
    }
  }, [event.id]);

  // Polling
  const fetchEvent = useCallback(async () => {
    try {
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    } catch { /* silent */ }
  }, [event.id]);

  useEffect(() => {
    if (event.status !== "live" && event.status !== "scheduled") return;
    const id = setInterval(fetchEvent, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchEvent, event.status]);

  // Fetch crowd stats for current wine
  useEffect(() => {
    if (!currentWine || !event.showCrowdStats) return;
    getCrowdStats(event.id, currentWine.position).then(setCrowd).catch(() => {});
  }, [event.id, currentWine?.position, event.showCrowdStats, guessSubmitted]);

  // Reset form on wine change
  const prevWineRef = useRef(currentWine?.position);
  useEffect(() => {
    if (currentWine?.position !== prevWineRef.current) {
      prevWineRef.current = currentWine?.position;
      setForm({ grape: "", region: "", country: "", vintage: "", producer: "", type: "", notes: "" });
      setGuessSubmitted(false);
    }
  }, [currentWine?.position]);

  // Clean up old reactions
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFloatingReactions((prev) => prev.slice(-10));
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

  function addReaction(emoji: string) {
    reactionCounter.current += 1;
    setFloatingReactions((prev) => [...prev, { id: reactionCounter.current, emoji }]);
  }

  // ---- Join handler ----
  async function handleJoin() {
    if (!joinName.trim()) { setJoinError("Name is required"); return; }
    setJoinError("");
    try {
      const result = await joinLiveEvent({
        eventId: event.id,
        displayName: joinName.trim(),
        joinCode: event.isPublic ? undefined : joinCode.toUpperCase(),
      });
      setParticipantId(result.participantId);
      setSessionToken(result.sessionToken);
      setJoined(true);
      localStorage.setItem(`live-${event.id}-pid`, result.participantId);
      localStorage.setItem(`live-${event.id}-token`, result.sessionToken);
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join");
    }
  }

  // ---- Submit guess ----
  async function handleSubmitGuess() {
    if (!participantId || !sessionToken || !currentWine) return;
    setSubmitting(true);
    try {
      await submitLiveGuess({
        eventId: event.id,
        participantId,
        sessionToken,
        winePosition: currentWine.position,
        guessedGrape: form.grape || undefined,
        guessedRegion: form.region || undefined,
        guessedCountry: form.country || undefined,
        guessedVintage: form.vintage ? parseInt(form.vintage, 10) : undefined,
        guessedProducer: form.producer || undefined,
        guessedType: form.type || undefined,
        notes: form.notes || undefined,
      });
      setGuessSubmitted(true);
    } catch { /* silent */ }
    setSubmitting(false);
  }

  const sommelier = event.sommelier;

  // ============ NOT JOINED — Join screen ============
  if (!joined) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ background: "#0F0D0B" }}>
        <div className="px-5 pt-5">
          <Link href="/live" className="inline-flex items-center gap-1 text-[13px] font-semibold touch-target" style={{ color: "#7A7068" }}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center animate-fade-in-up">
            {/* Event status indicator */}
            {event.status === "live" && (
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-[12px] font-bold text-red-400 uppercase tracking-wider">Live Now</span>
              </div>
            )}

            {/* Sommelier */}
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center text-[16px] font-bold"
                style={{
                  background: "rgba(220, 40, 50, 0.15)",
                  color: "#EF4444",
                  boxShadow: "0 0 0 2px rgba(255,255,255,0.1)",
                }}
              >
                {sommelier.displayName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold" style={{ color: "#FAF6EF" }}>{sommelier.displayName}</span>
                  {sommelier.verified && <BadgeCheck className="h-4 w-4 text-red-400" />}
                </div>
                {sommelier.expertise.length > 0 && (
                  <p className="text-[11px] font-medium" style={{ color: "#7A7068" }}>
                    {sommelier.expertise.slice(0, 3).join(" \u00b7 ")}
                  </p>
                )}
              </div>
            </div>

            <h1 className="text-[26px] font-bold tracking-tight mb-2" style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}>
              {event.title}
            </h1>
            {event.description && <p className="text-[14px] mb-6" style={{ color: "#7A7068" }}>{event.description}</p>}

            {/* Event meta */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#7A7068" }}>
                <Wine className="h-3.5 w-3.5" /> {event.wines.length} wines
              </span>
              <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#7A7068" }}>
                <Users className="h-3.5 w-3.5" /> {event.participants.length} joined
              </span>
            </div>

            {/* Join form */}
            <div
              className="rounded-[24px] p-5 text-left"
              style={{
                background: "#1C1916",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Your name"
                className="w-full mb-3 touch-target rounded-2xl px-4 py-3.5 text-[15px] font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  color: "#FAF6EF",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              {!event.isPublic && (
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Join code"
                  className="w-full mb-3 touch-target rounded-2xl px-4 py-3.5 text-center font-mono font-bold tracking-widest text-[15px] outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                    color: "#FAF6EF",
                  }}
                />
              )}
              {joinError && <p className="text-red-400 text-[13px] mb-3">{joinError}</p>}
              <button
                onClick={handleJoin}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[15px] font-bold text-white active:scale-[0.98] transition-transform touch-target"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                  boxShadow: "0 4px 14px rgba(220, 40, 50, 0.35)",
                }}
              >
                <Zap className="h-4 w-4" /> Join Live Tasting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ SCHEDULED — Waiting with countdown ============
  if (event.status === "scheduled") {
    const date = new Date(event.scheduledAt);
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{ background: "#0F0D0B" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(220, 40, 50, 0.06) 0%, transparent 60%)" }}
        />
        <div className="relative text-center">
          <div
            className="h-24 w-24 rounded-3xl flex items-center justify-center mb-6 mx-auto"
            style={{ background: "rgba(220, 40, 50, 0.08)" }}
          >
            <Clock className="h-12 w-12 text-red-400/50 animate-pulse" />
          </div>
          <h1 className="text-[24px] font-bold tracking-tight" style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}>
            {event.title}
          </h1>
          <p className="text-[15px] mt-2" style={{ color: "#7A7068" }}>
            Starts {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-[22px] font-bold mt-1 text-red-400">
            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Users className="h-4 w-4" style={{ color: "#7A7068" }} />
            <p className="text-[13px] font-semibold" style={{ color: "#7A7068" }}>
              {event.participants.length} people waiting
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[12px] font-medium" style={{ color: "#7A7068" }}>Waiting for sommelier to start...</span>
          </div>
        </div>
      </div>
    );
  }

  // ============ COMPLETED — Scoreboard ============
  if (event.status === "completed") {
    const scoreMap = new Map<string, number>();
    for (const g of event.guesses) {
      scoreMap.set(g.participantId, (scoreMap.get(g.participantId) ?? 0) + (g.score ?? 0));
    }
    const ranked = event.participants
      .map((p) => ({ ...p, totalScore: scoreMap.get(p.id) ?? 0 }))
      .sort((a, b) => b.totalScore - a.totalScore);

    const MEDALS = [
      { bg: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", text: "text-white" },
      { bg: "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)", text: "text-white" },
      { bg: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", text: "text-white" },
    ];

    return (
      <div className="min-h-dvh" style={{ background: "#0F0D0B" }}>
        <div className="container-app pt-8 pb-28">
          <Link href="/live" className="inline-flex items-center gap-1 text-[13px] font-semibold mb-6 touch-target" style={{ color: "#7A7068" }}>
            <ChevronLeft className="h-4 w-4" /> Back to Live
          </Link>

          <div className="text-center mb-8 animate-fade-in-up">
            <div
              className="h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-cheers"
              style={{ background: "rgba(245, 158, 11, 0.1)" }}
            >
              <Trophy className="h-10 w-10 text-amber-400" />
            </div>
            <h1 className="text-[26px] font-bold tracking-tight" style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}>
              Tasting Complete!
            </h1>
            <p className="mt-1" style={{ color: "#7A7068" }}>{event.title}</p>

            {/* Final stats */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-[22px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{event.wines.length}</p>
                <p className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>Wines</p>
              </div>
              <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <p className="text-[22px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{ranked.length}</p>
                <p className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>Tasters</p>
              </div>
              <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <p className="text-[22px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{event.guesses.length}</p>
                <p className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>Guesses</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-[24px] overflow-hidden" style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>Leaderboard</h2>
            </div>
            {ranked.slice(0, 20).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3.5 px-4 py-3.5"
                style={{
                  borderBottom: i < ranked.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  background: p.id === participantId ? "rgba(220, 40, 50, 0.06)" : "transparent",
                }}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={i < 3
                    ? { background: MEDALS[i].bg, color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "#7A7068" }
                  }
                >
                  {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className="text-[14px] font-semibold flex-1 truncate"
                  style={{ color: p.id === participantId ? "#EF4444" : "#FAF6EF" }}
                >
                  {p.displayName}{p.id === participantId ? " (you)" : ""}
                </span>
                <span className="text-[15px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>
                  {p.totalScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============ LIVE — Main experience ============
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#0F0D0B" }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link href="/live" className="touch-target">
          <ChevronLeft className="h-5 w-5" style={{ color: "#7A7068" }} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[12px] font-bold text-red-400 uppercase tracking-wider">Live</span>
        </div>
        <span className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "#7A7068" }}>
          <Users className="h-3.5 w-3.5" /> {event.participants.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container-app py-4">
          {/* Sommelier info */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{
                background: "rgba(220, 40, 50, 0.15)",
                color: "#EF4444",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.06)",
              }}
            >
              {sommelier.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold" style={{ color: "#EDE4D4" }}>{sommelier.displayName}</span>
                {sommelier.verified && <BadgeCheck className="h-3.5 w-3.5 text-red-400" />}
              </div>
            </div>
          </div>

          {/* Wine Flight Progress */}
          <div className="mb-4">
            <FlightProgress wines={event.wines} currentPosition={currentWine?.position ?? 0} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#7A7068" }}>
                Wine {currentWine?.position ?? "?"} of {event.wines.length}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: "#7A7068" }}>
                {event.wines.filter((w) => w.revealed).length} revealed
              </span>
            </div>
          </div>

          {/* Latest hint — prominent */}
          {revealedHints.length > 0 && (
            <div className="mb-4 animate-scale-in">
              <div
                className="rounded-[24px] p-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(220, 40, 50, 0.15) 0%, rgba(220, 40, 50, 0.05) 100%)",
                  border: "1px solid rgba(220, 40, 50, 0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="h-4 w-4 text-red-400/60" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-red-400/60">
                    Hint #{revealedHints.length}
                  </span>
                  <span className="text-[10px] font-semibold capitalize text-red-400/40 ml-auto">
                    {revealedHints[revealedHints.length - 1].hintType}
                  </span>
                </div>
                <p className="text-[18px] font-bold leading-snug" style={{ color: "#FAF6EF" }}>
                  {revealedHints[revealedHints.length - 1].content}
                </p>
              </div>
            </div>
          )}

          {/* Previous hints — collapsed */}
          {revealedHints.length > 1 && (
            <div className="space-y-2 mb-5">
              {revealedHints.slice(0, -1).reverse().map((hint) => (
                <div
                  key={hint.id}
                  className="rounded-[16px] px-4 py-3 flex items-start gap-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span className="text-[11px] font-bold mt-0.5" style={{ color: "#7A7068" }}>#{hint.position}</span>
                  <p className="text-[13px] flex-1" style={{ color: "#7A7068" }}>{hint.content}</p>
                  <span className="text-[10px] font-semibold capitalize flex-shrink-0" style={{ color: "rgba(122, 112, 104, 0.5)" }}>
                    {hint.hintType}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Crowd stats */}
          {event.showCrowdStats && crowd && crowd.totalGuesses > 0 && (
            <div
              className="rounded-[20px] p-4 mb-5"
              style={{
                background: "#1C1916",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-3.5 w-3.5" style={{ color: "#7A7068" }} />
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>
                  Crowd Pulse
                </span>
                <span className="text-[10px] font-semibold ml-auto tabular-nums" style={{ color: "#7A7068" }}>
                  {crowd.totalGuesses} guesses
                </span>
              </div>
              <div className="space-y-3">
                {Object.entries(crowd.stats).map(([field, values]) => (
                  <div key={field}>
                    <span className="text-[10px] font-bold uppercase tracking-wide capitalize" style={{ color: "#7A7068" }}>{field}</span>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {Object.entries(values).slice(0, 3).map(([val, pct]) => (
                        <span
                          key={val}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{
                            background: "rgba(220, 40, 50, 0.08)",
                            color: "#EF4444",
                          }}
                        >
                          {val} <span style={{ opacity: 0.5 }}>{pct}%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last revealed wine */}
          {lastRevealed?.revealed && lastRevealed.wine && (
            <div
              className="rounded-[20px] p-4 mb-5"
              style={{
                background: "rgba(34, 197, 94, 0.06)",
                border: "1px solid rgba(34, 197, 94, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-bold text-green-400 uppercase tracking-wide">
                  Wine #{lastRevealed.position} Revealed
                </span>
              </div>
              <h3 className="text-[16px] font-bold" style={{ color: "#FAF6EF" }}>{lastRevealed.wine.name}</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "#7A7068" }}>
                {[lastRevealed.wine.producer, lastRevealed.wine.vintage ? String(lastRevealed.wine.vintage) : "", [lastRevealed.wine.region, lastRevealed.wine.country].filter(Boolean).join(", ")].filter(Boolean).join(" \u00b7 ")}
              </p>
            </div>
          )}

          {/* No hints yet */}
          {currentWine && revealedHints.length === 0 && (
            <div
              className="rounded-[24px] flex flex-col items-center justify-center py-12 text-center mb-5"
              style={{
                background: "#1C1916",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Loader2 className="h-6 w-6 text-red-400/60 animate-spin mb-3" />
              <p className="text-[14px] font-semibold" style={{ color: "#FAF6EF" }}>Sommelier is tasting...</p>
              <p className="text-[12px] mt-1" style={{ color: "#7A7068" }}>Hints will appear here</p>
            </div>
          )}

          {/* Reactions area */}
          <div className="relative mb-4" style={{ minHeight: 40 }}>
            {floatingReactions.map((r) => (
              <FloatingReaction key={r.id} emoji={r.emoji} id={r.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section: Reactions + Guess Form */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#141210" }}>
        {/* Reaction bar */}
        <div className="container-app pt-2.5 pb-1">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {REACTIONS.map((r) => (
              <button
                key={r.label}
                onClick={() => addReaction(r.emoji)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-[18px] active:scale-90 transition-transform flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Guess form */}
        {currentWine && !currentWine.revealed && (
          <div className="container-app py-3 safe-bottom">
            {guessSubmitted && (
              <div className="flex items-center justify-center gap-2 py-1.5 mb-2 text-[12px] font-semibold text-green-400">
                <Check className="h-3.5 w-3.5" /> Guess submitted — update anytime
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={form.grape}
                onChange={(e) => setForm((f) => ({ ...f, grape: e.target.value }))}
                placeholder="Grape"
                className="flex-1 py-2.5 px-3 rounded-xl text-[13px] font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#FAF6EF",
                }}
              />
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                placeholder="Region"
                className="flex-1 py-2.5 px-3 rounded-xl text-[13px] font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#FAF6EF",
                }}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="Country"
                className="flex-1 py-2.5 px-3 rounded-xl text-[13px] font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#FAF6EF",
                }}
              />
              <input
                type="text"
                value={form.vintage}
                onChange={(e) => setForm((f) => ({ ...f, vintage: e.target.value }))}
                placeholder="Year"
                className="w-20 py-2.5 px-3 rounded-xl text-[13px] font-medium text-center outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#FAF6EF",
                }}
              />
              <button
                onClick={handleSubmitGuess}
                disabled={submitting}
                className="h-[42px] w-[42px] rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                  boxShadow: "0 2px 10px rgba(220, 40, 50, 0.3)",
                }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Send className="h-4 w-4 text-white" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
