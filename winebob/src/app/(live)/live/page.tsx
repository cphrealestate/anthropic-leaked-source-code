import { getUpcomingLiveEvents } from "@/lib/liveActions";
import Link from "next/link";
import {
  Radio, Calendar, Users, Wine, BadgeCheck, Clock, Plus,
  Flame, Sparkles, Star, Filter, ChevronRight, Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (diff < 0) return "Starting soon";
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `in ${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
}

function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case "beginner": return { label: "Beginner", bg: "bg-emerald-500/10", text: "text-emerald-400" };
    case "intermediate": return { label: "Intermediate", bg: "bg-amber-500/10", text: "text-amber-400" };
    case "advanced": return { label: "Advanced", bg: "bg-red-500/10", text: "text-red-400" };
    case "expert": return { label: "Expert", bg: "bg-purple-500/10", text: "text-purple-400" };
    default: return { label: difficulty, bg: "bg-white/5", text: "text-white/60" };
  }
}

export default async function LiveEventsPage() {
  const events = await getUpcomingLiveEvents();

  const liveNow = events.filter((e) => e.status === "live");
  const upcoming = events.filter((e) => e.status === "scheduled");

  return (
    <div className="min-h-screen pb-28">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(220, 40, 50, 0.12) 0%, transparent 60%)",
          }}
        />
        <div className="container-app pt-8 pb-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
                >
                  <Radio className="h-4 w-4 text-white" />
                </div>
                <h1
                  className="text-[28px] font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    color: "#FAF6EF",
                  }}
                >
                  Live Tastings
                </h1>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "#7A7068" }}>
                Join expert sommeliers for real-time blind tasting sessions.
                <br />
                Guess, compete, and learn together.
              </p>
            </div>
            <Link
              href="/live/create"
              className="h-12 w-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 4px 20px rgba(220, 40, 50, 0.4), 0 0 60px rgba(220, 40, 50, 0.1)",
              }}
            >
              <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Quick Stats Bar */}
          {(liveNow.length > 0 || upcoming.length > 0) && (
            <div className="flex items-center gap-4 mt-5">
              {liveNow.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(220, 40, 50, 0.1)" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-[12px] font-bold text-red-400">{liveNow.length} Live Now</span>
                </div>
              )}
              {upcoming.length > 0 && (
                <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#7A7068" }}>
                  <Calendar className="h-3.5 w-3.5" />
                  {upcoming.length} upcoming
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#7A7068" }}>
                <Users className="h-3.5 w-3.5" />
                {events.reduce((sum, e) => sum + e._count.participants, 0)} tasters
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Now — Prominent Cards */}
      {liveNow.length > 0 && (
        <section className="container-app mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4.5 w-4.5 text-red-500" />
            <h2 className="text-[16px] font-bold" style={{ color: "#FAF6EF" }}>Happening Now</h2>
          </div>
          <div className="space-y-4">
            {liveNow.map((event) => {
              const diff = getDifficultyBadge(event.difficulty);
              return (
                <Link
                  key={event.id}
                  href={`/live/${event.id}`}
                  className="block rounded-[24px] p-[1px] active:scale-[0.98] transition-transform"
                  style={{
                    background: "linear-gradient(135deg, rgba(220, 40, 50, 0.6) 0%, rgba(220, 40, 50, 0.1) 50%, rgba(220, 40, 50, 0.4) 100%)",
                  }}
                >
                  <div
                    className="rounded-[23px] p-5"
                    style={{ background: "linear-gradient(135deg, #1C1916 0%, #141210 100%)" }}
                  >
                    {/* Live badge + viewers */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Live</span>
                        </div>
                        <span className={`${diff.bg} ${diff.text} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                          {diff.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-white/40" />
                        <span className="text-[13px] font-bold text-white/60 tabular-nums">
                          {event._count.participants}
                        </span>
                      </div>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-[20px] font-bold leading-tight" style={{ color: "#FAF6EF" }}>
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-[13px] mt-1.5 line-clamp-2" style={{ color: "#7A7068" }}>
                        {event.description}
                      </p>
                    )}

                    {/* Sommelier + wine count */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {event.sommelier.avatar ? (
                          <img src={event.sommelier.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" />
                        ) : (
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold ring-2 ring-white/10"
                            style={{ background: "rgba(220, 40, 50, 0.15)", color: "#EF4444" }}
                          >
                            {event.sommelier.displayName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold" style={{ color: "#EDE4D4" }}>
                              {event.sommelier.displayName}
                            </span>
                            {event.sommelier.verified && <BadgeCheck className="h-3.5 w-3.5 text-red-400" />}
                          </div>
                          {event.sommelier.expertise.length > 0 && (
                            <span className="text-[10px] font-medium" style={{ color: "#7A7068" }}>
                              {event.sommelier.expertise.slice(0, 2).join(" & ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <Wine className="h-3.5 w-3.5 text-red-400/60" />
                        <span className="text-[12px] font-bold" style={{ color: "#EDE4D4" }}>{event._count.wines} wines</span>
                      </div>
                    </div>

                    {/* Join CTA */}
                    <div
                      className="mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                        boxShadow: "0 4px 14px rgba(220, 40, 50, 0.3)",
                      }}
                    >
                      <Zap className="h-4 w-4 text-white" />
                      <span className="text-[14px] font-bold text-white">Join Now</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="container-app mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" style={{ color: "#7A7068" }} />
            <h2 className="text-[16px] font-bold" style={{ color: "#FAF6EF" }}>Upcoming</h2>
          </div>
        </div>

        {upcoming.length === 0 && liveNow.length === 0 ? (
          <div
            className="rounded-[24px] p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #1C1916 0%, #141210 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Animated empty state */}
            <div className="relative mx-auto mb-6" style={{ width: 80, height: 80 }}>
              <div
                className="absolute inset-0 rounded-3xl animate-pulse"
                style={{ background: "rgba(220, 40, 50, 0.08)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Radio className="h-8 w-8" style={{ color: "rgba(220, 40, 50, 0.4)" }} />
              </div>
            </div>
            <h3 className="text-[18px] font-bold mb-2" style={{ color: "#FAF6EF" }}>
              No upcoming tastings
            </h3>
            <p className="text-[14px] leading-relaxed max-w-[260px] mx-auto mb-6" style={{ color: "#7A7068" }}>
              Be the first to host a live tasting session for the community.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/live/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[14px] font-bold text-white active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                  boxShadow: "0 4px 14px rgba(220, 40, 50, 0.3)",
                }}
              >
                <Plus className="h-4 w-4" /> Host a Tasting
              </Link>
              <Link
                href="/sommeliers/become"
                className="inline-flex items-center gap-1 text-[13px] font-semibold active:opacity-70 transition-opacity"
                style={{ color: "rgba(220, 40, 50, 0.7)" }}
              >
                Become a Sommelier <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((event) => {
              const date = new Date(event.scheduledAt);
              const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              const countdown = getRelativeTime(date);
              const diff = getDifficultyBadge(event.difficulty);

              return (
                <Link
                  key={event.id}
                  href={`/live/${event.id}`}
                  className="block rounded-[20px] p-4 active:scale-[0.98] transition-transform"
                  style={{
                    background: "#1C1916",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Date Block */}
                    <div
                      className="flex-shrink-0 rounded-2xl p-3 text-center min-w-[60px]"
                      style={{ background: "rgba(220, 40, 50, 0.08)" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wide text-red-400/70">
                        {dateStr.split(",")[0]}
                      </p>
                      <p className="text-[22px] font-bold leading-tight" style={{ color: "#FAF6EF" }}>
                        {date.getDate()}
                      </p>
                      <p className="text-[10px] font-semibold" style={{ color: "#7A7068" }}>
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Countdown badge */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(220, 40, 50, 0.1)", color: "#EF4444" }}
                        >
                          <Clock className="h-2.5 w-2.5" /> {countdown}
                        </span>
                        <span className={`${diff.bg} ${diff.text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                          {diff.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-[15px] leading-tight line-clamp-1" style={{ color: "#FAF6EF" }}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: "#7A7068" }}>
                          {event.description}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                          <Clock className="h-3 w-3" /> {timeStr}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                          <Wine className="h-3 w-3" /> {event._count.wines} wines
                        </span>
                        {event.maxParticipants && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                            <Users className="h-3 w-3" /> {event._count.participants}/{event.maxParticipants}
                          </span>
                        )}
                      </div>

                      {/* Sommelier */}
                      <div className="flex items-center gap-2 mt-2.5">
                        {event.sommelier.avatar ? (
                          <img src={event.sommelier.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                        ) : (
                          <div
                            className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: "rgba(220, 40, 50, 0.15)", color: "#EF4444" }}
                          >
                            {event.sommelier.displayName.charAt(0)}
                          </div>
                        )}
                        <span className="text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                          {event.sommelier.displayName}
                        </span>
                        {event.sommelier.verified && <BadgeCheck className="h-3 w-3 text-red-400" />}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Become a Sommelier CTA */}
      <section className="container-app mt-8">
        <Link
          href="/sommeliers/become"
          className="block rounded-[24px] p-5 active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, rgba(220, 40, 50, 0.08) 0%, rgba(220, 40, 50, 0.02) 100%)",
            border: "1px solid rgba(220, 40, 50, 0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(220, 40, 50, 0.1)" }}
            >
              <Sparkles className="h-6 w-6 text-red-400/60" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold" style={{ color: "#FAF6EF" }}>
                Host Your Own Tastings
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "#7A7068" }}>
                Share your expertise and build your audience as a Winebob Sommelier.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#7A7068" }} />
          </div>
        </Link>
      </section>
    </div>
  );
}
