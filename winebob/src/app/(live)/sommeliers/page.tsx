import { getAllSommeliers } from "@/lib/liveActions";
import Link from "next/link";
import { BadgeCheck, Star, Wine, Users, ChevronRight, Sparkles, Radio } from "lucide-react";

export const dynamic = "force-dynamic";

const EXPERTISE_COLORS: Record<string, string> = {
  italian: "rgba(34, 197, 94, 0.1)",
  french: "rgba(59, 130, 246, 0.1)",
  spanish: "rgba(249, 115, 22, 0.1)",
  natural: "rgba(34, 197, 94, 0.1)",
  sparkling: "rgba(245, 158, 11, 0.1)",
  biodynamic: "rgba(168, 85, 247, 0.1)",
  champagne: "rgba(245, 158, 11, 0.1)",
  burgundy: "rgba(220, 40, 50, 0.1)",
  bordeaux: "rgba(220, 40, 50, 0.1)",
  default: "rgba(220, 40, 50, 0.08)",
};

const EXPERTISE_TEXT_COLORS: Record<string, string> = {
  italian: "#22C55E",
  french: "#3B82F6",
  spanish: "#F97316",
  natural: "#22C55E",
  sparkling: "#F59E0B",
  biodynamic: "#A855F7",
  champagne: "#F59E0B",
  burgundy: "#EF4444",
  bordeaux: "#EF4444",
  default: "#EF4444",
};

function getExpBg(exp: string) { return EXPERTISE_COLORS[exp.toLowerCase()] ?? EXPERTISE_COLORS.default; }
function getExpText(exp: string) { return EXPERTISE_TEXT_COLORS[exp.toLowerCase()] ?? EXPERTISE_TEXT_COLORS.default; }

export default async function SommeliersPage() {
  const sommeliers = await getAllSommeliers();

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(220, 40, 50, 0.08) 0%, transparent 60%)" }}
        />
        <div className="container-app pt-8 pb-4 relative">
          <div className="flex items-end justify-between">
            <div>
              <h1
                className="text-[28px] font-bold tracking-tight"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)", color: "#FAF6EF" }}
              >
                Sommeliers
              </h1>
              <p className="text-[14px] mt-0.5" style={{ color: "#7A7068" }}>
                Our community of wine experts
              </p>
            </div>
            <Link
              href="/sommeliers/become"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-white active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 2px 10px rgba(220, 40, 50, 0.3)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Become a Som
            </Link>
          </div>
        </div>
      </div>

      {/* Sommelier list */}
      <div className="container-app mt-4">
        {sommeliers.length === 0 ? (
          <div
            className="rounded-[24px] p-8 text-center"
            style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(220, 40, 50, 0.08)" }}
            >
              <Wine className="h-7 w-7 text-red-400/40" />
            </div>
            <p className="text-[17px] font-bold" style={{ color: "#FAF6EF" }}>No sommeliers yet</p>
            <p className="mt-2 text-[14px] max-w-[240px] mx-auto" style={{ color: "#7A7068" }}>
              Be the first to create a sommelier profile and host live tastings.
            </p>
            <Link
              href="/sommeliers/become"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-2xl text-[14px] font-bold text-white active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 4px 14px rgba(220, 40, 50, 0.3)",
              }}
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sommeliers.map((som) => (
              <div
                key={som.id}
                className="rounded-[20px] p-4"
                style={{ background: "#1C1916", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {som.avatar ? (
                      <img src={som.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.08)" }} />
                    ) : (
                      <div
                        className="h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold"
                        style={{ background: "rgba(220, 40, 50, 0.1)", color: "#EF4444" }}
                      >
                        {som.displayName.charAt(0)}
                      </div>
                    )}
                    {som.verified && (
                      <div
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ background: "#DC2626" }}
                      >
                        <BadgeCheck className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[15px] truncate" style={{ color: "#FAF6EF" }}>
                        {som.displayName}
                      </h3>
                      {som.verified && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: "rgba(220, 40, 50, 0.1)", color: "#EF4444" }}
                        >
                          Verified
                        </span>
                      )}
                    </div>

                    {som.bio && (
                      <p className="text-[12px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: "#7A7068" }}>
                        {som.bio}
                      </p>
                    )}

                    {/* Expertise badges */}
                    {som.expertise.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {som.expertise.slice(0, 4).map((exp) => (
                          <span
                            key={exp}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize"
                            style={{ background: getExpBg(exp), color: getExpText(exp) }}
                          >
                            {exp}
                          </span>
                        ))}
                        {som.expertise.length > 4 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#7A7068" }}>
                            +{som.expertise.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                        <Radio className="h-3 w-3" /> {som.totalEvents} events
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7A7068" }}>
                        <Users className="h-3 w-3" /> {som.totalViewers} viewers
                      </span>
                      {som.ratingCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" /> {som.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Certifications */}
                    {som.certifications.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {som.certifications.slice(0, 3).map((cert) => (
                          <span
                            key={cert}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1"
                            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#7A7068" }}
                          >
                            <BadgeCheck className="h-2.5 w-2.5" /> {cert}
                          </span>
                        ))}
                        {som.certifications.length > 3 && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ color: "#7A7068" }}>
                            +{som.certifications.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
