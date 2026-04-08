"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Play, Eye, Flag, Radio, Users, Wine,
  Check, Sparkles, Crown, Trophy, Copy, Share2,
  BarChart3, Clock, Zap, CheckCircle2,
} from "lucide-react";
import {
  getLiveEventById, startLiveEvent, releaseHint,
  revealLiveWine, completeLiveEvent,
} from "@/lib/liveActions";

type EventData = NonNullable<Awaited<ReturnType<typeof getLiveEventById>>>;

export function LiveHostClient({ event: initialEvent }: { event: EventData }) {
  const router = useRouter();
  const [event, setEvent] = useState(initialEvent);
  const [isPending, startTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-refresh
  useEffect(() => {
    if (event.status === "completed") return;
    const id = setInterval(async () => {
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    }, 3000);
    return () => clearInterval(id);
  }, [event.id, event.status]);

  function handleStart() {
    startTransition(async () => {
      await startLiveEvent(event.id);
      router.refresh();
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    });
  }

  function handleReleaseHint(hintId: string) {
    startTransition(async () => {
      await releaseHint(hintId);
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    });
  }

  function handleRevealWine(position: number) {
    startTransition(async () => {
      await revealLiveWine(event.id, position);
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await completeLiveEvent(event.id);
      const data = await getLiveEventById(event.id);
      if (data) setEvent(data);
    });
  }

  function copyJoinCode() {
    if (event.joinCode) {
      navigator.clipboard.writeText(event.joinCode).catch(() => {});
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  }

  // Current wine = first unrevealed
  const currentWineIdx = event.wines.findIndex((w) => !w.revealed);
  const currentWine = currentWineIdx >= 0 ? event.wines[currentWineIdx] : null;
  const allRevealed = event.wines.every((w) => w.revealed);

  // Guess count for current wine
  const currentGuessCount = currentWine
    ? event.guesses.filter((g) => g.winePosition === currentWine.position).length
    : 0;

  // Total stats
  const totalGuesses = event.guesses.length;
  const avgGuessesPerWine = event.wines.filter((w) => w.revealed).length > 0
    ? Math.round(totalGuesses / event.wines.filter((w) => w.revealed).length)
    : currentGuessCount;

  return (
    <div className="min-h-dvh" style={{ background: "#0F0D0B" }}>
      <div className="container-app pt-5 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/live" className="inline-flex items-center gap-1 text-[13px] font-semibold touch-target" style={{ color: "#7A7068" }}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-3">
            {event.status === "live" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(220, 40, 50, 0.1)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[11px] font-bold text-red-400 uppercase">Live</span>
              </div>
            )}
            <span className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "#7A7068" }}>
              <Users className="h-3.5 w-3.5" /> {event.participants.length}
            </span>
          </div>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}>
          {event.title}
        </h1>
        <p className="text-[13px] mb-5" style={{ color: "#7A7068" }}>Host Control Panel</p>

        {/* Join Code (for private events) */}
        {event.joinCode && (
          <button
            onClick={copyJoinCode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl mb-5 active:scale-[0.98] transition-transform"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex-1 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>Join Code</p>
              <p className="text-[18px] font-bold font-mono tracking-widest" style={{ color: "#FAF6EF" }}>{event.joinCode}</p>
            </div>
            {copiedCode ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <Copy className="h-5 w-5" style={{ color: "#7A7068" }} />
            )}
          </button>
        )}

        {/* Live Stats Bar */}
        {event.status === "live" && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-2xl p-3 text-center" style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[20px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{event.participants.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>Viewers</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[20px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{currentGuessCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>Guesses</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[20px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>
                {currentWine?.position ?? event.wines.length}/{event.wines.length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#7A7068" }}>Wine</p>
            </div>
          </div>
        )}

        {/* Status: Scheduled */}
        {event.status === "scheduled" && (
          <div
            className="rounded-[24px] p-8 text-center mb-6"
            style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(220, 40, 50, 0.08)" }}
            >
              <Users className="h-8 w-8 text-red-400/50" />
            </div>
            <p className="text-[22px] font-bold tabular-nums mb-1" style={{ color: "#FAF6EF" }}>
              {event.participants.length}
            </p>
            <p className="text-[14px] mb-6" style={{ color: "#7A7068" }}>
              participant{event.participants.length !== 1 ? "s" : ""} waiting
            </p>
            <button
              onClick={handleStart}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-bold text-white active:scale-[0.98] transition-transform touch-target disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 4px 20px rgba(220, 40, 50, 0.4)",
              }}
            >
              <Play className="h-5 w-5" /> {isPending ? "Starting..." : "Go Live"}
            </button>
          </div>
        )}

        {/* Wine flight with hints */}
        {event.status === "live" && (
          <div className="space-y-4">
            {/* Flight progress bar */}
            <div className="flex items-center gap-1.5 mb-2">
              {event.wines.map((w) => (
                <div
                  key={w.id}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: w.revealed
                      ? "#22C55E"
                      : w.id === currentWine?.id
                        ? "#DC2626"
                        : "rgba(255,255,255,0.08)",
                    boxShadow: w.id === currentWine?.id ? "0 0 8px rgba(220, 40, 50, 0.4)" : "none",
                  }}
                />
              ))}
            </div>

            {event.wines.map((lw) => {
              const isCurrent = lw.id === currentWine?.id;
              const unreveledHints = lw.hints.filter((h) => !h.revealed);
              const revealedHints = lw.hints.filter((h) => h.revealed);
              const nextHint = unreveledHints[0];
              const guessCount = event.guesses.filter((g) => g.winePosition === lw.position).length;

              return (
                <div
                  key={lw.id}
                  className="rounded-[20px] p-4 transition-all"
                  style={{
                    background: "#1C1916",
                    border: isCurrent
                      ? "1.5px solid rgba(220, 40, 50, 0.4)"
                      : "1px solid rgba(255,255,255,0.05)",
                    opacity: !isCurrent && !lw.revealed ? 0.35 : 1,
                    boxShadow: isCurrent ? "0 0 20px rgba(220, 40, 50, 0.08)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-[12px] font-bold"
                        style={lw.revealed
                          ? { background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }
                          : isCurrent
                            ? { background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)", color: "white" }
                            : { background: "rgba(255,255,255,0.05)", color: "#7A7068" }
                        }
                      >
                        {lw.revealed ? <Check className="h-4 w-4" strokeWidth={3} /> : lw.position}
                      </div>
                      <div>
                        <span className="text-[14px] font-bold" style={{ color: "#FAF6EF" }}>
                          {lw.wine?.name ?? "Wine"}
                        </span>
                        <p className="text-[11px]" style={{ color: "#7A7068" }}>
                          {lw.wine?.producer}{lw.wine?.vintage ? ` \u00b7 ${lw.wine.vintage}` : ""}
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: "rgba(220, 40, 50, 0.1)" }}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                        </span>
                        <span className="text-[10px] font-bold text-red-400">Current</span>
                      </div>
                    )}
                    {lw.revealed && (
                      <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Revealed
                      </span>
                    )}
                  </div>

                  {/* Hints */}
                  {isCurrent && (
                    <div className="space-y-2 mt-3">
                      {/* Released hints */}
                      {revealedHints.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                          style={{ background: "rgba(34, 197, 94, 0.06)", border: "1px solid rgba(34, 197, 94, 0.1)" }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                          <span className="text-[12px] flex-1" style={{ color: "#EDE4D4" }}>{h.content}</span>
                          <span className="text-[10px] capitalize" style={{ color: "#7A7068" }}>{h.hintType}</span>
                        </div>
                      ))}

                      {/* Next hint to release */}
                      {nextHint && (
                        <button
                          onClick={() => handleReleaseHint(nextHint.id)}
                          disabled={isPending}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3.5 rounded-xl active:scale-[0.98] transition-all touch-target"
                          style={{
                            border: "2px dashed rgba(220, 40, 50, 0.25)",
                            background: "rgba(220, 40, 50, 0.03)",
                          }}
                        >
                          <Sparkles className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <span className="text-[13px] font-semibold text-red-400 text-left flex-1">
                            {isPending ? "Releasing..." : `Drop Hint #${nextHint.position}`}
                          </span>
                          <span className="text-[11px] max-w-[120px] truncate" style={{ color: "#7A7068" }}>
                            &ldquo;{nextHint.content}&rdquo;
                          </span>
                        </button>
                      )}

                      {/* Unrevealed hints remaining */}
                      {unreveledHints.length > 1 && (
                        <p className="text-[11px] text-center" style={{ color: "#7A7068" }}>
                          {unreveledHints.length - 1} more hint{unreveledHints.length > 2 ? "s" : ""} remaining
                        </p>
                      )}

                      {/* Reveal wine button */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-3.5 w-3.5" style={{ color: "#7A7068" }} />
                          <span className="text-[12px] font-semibold tabular-nums" style={{ color: "#7A7068" }}>
                            {guessCount} guesses
                          </span>
                        </div>
                        <button
                          onClick={() => handleRevealWine(lw.position)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white active:scale-95 transition-transform disabled:opacity-50 touch-target"
                          style={{
                            background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                            boxShadow: "0 2px 10px rgba(220, 40, 50, 0.25)",
                          }}
                        >
                          <Eye className="h-4 w-4" /> {isPending ? "Revealing..." : "Reveal Wine"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Revealed wine stats */}
                  {lw.revealed && (
                    <div className="flex items-center gap-3 mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                        {event.guesses.filter((g) => g.winePosition === lw.position).length} guesses
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                        {lw.hints.length} hints used
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Finish button */}
            {allRevealed && (
              <button
                onClick={handleComplete}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-bold text-white active:scale-[0.98] transition-transform touch-target disabled:opacity-50 mt-4"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                  boxShadow: "0 4px 20px rgba(220, 40, 50, 0.4)",
                }}
              >
                <Flag className="h-5 w-5" /> {isPending ? "Finishing..." : "End Tasting"}
              </button>
            )}
          </div>
        )}

        {/* Completed */}
        {event.status === "completed" && (
          <div
            className="rounded-[24px] p-8 text-center"
            style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(245, 158, 11, 0.1)" }}
            >
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-[18px] font-bold" style={{ color: "#FAF6EF" }}>Tasting Complete</h2>
            <div className="flex items-center justify-center gap-4 mt-3 mb-6">
              <div className="text-center">
                <p className="text-[18px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{event.participants.length}</p>
                <p className="text-[10px] font-semibold" style={{ color: "#7A7068" }}>Participants</p>
              </div>
              <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <p className="text-[18px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{event.wines.length}</p>
                <p className="text-[10px] font-semibold" style={{ color: "#7A7068" }}>Wines</p>
              </div>
              <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <p className="text-[18px] font-bold tabular-nums" style={{ color: "#FAF6EF" }}>{totalGuesses}</p>
                <p className="text-[10px] font-semibold" style={{ color: "#7A7068" }}>Guesses</p>
              </div>
            </div>
            <Link
              href="/live"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-[15px] font-bold text-white active:scale-[0.98] transition-transform touch-target"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 4px 14px rgba(220, 40, 50, 0.3)",
              }}
            >
              Back to Live Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
