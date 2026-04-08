import Link from "next/link";
import { getWines } from "@/lib/wineryActions";
import { Plus, Wine, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  red: "#74070E", white: "#C8A255", rosé: "#C47080",
  sparkling: "#B8A840", orange: "#C87840", fortified: "#8B4513", dessert: "#8B6914",
};

export default async function WinesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const wineryId = typeof params.wineryId === "string" ? params.wineryId : undefined;

  let wines: Awaited<ReturnType<typeof getWines>> = [];
  try {
    wines = await getWines({ search, wineryId });
  } catch { /* DB unavailable */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>Wines</h1>
          <p className="text-[13px] text-muted mt-1">{wines.length} wines in the database</p>
        </div>
        <Link
          href="/admin/wines/new"
          className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-cherry text-white text-[13px] font-semibold hover:bg-cherry/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Wine
        </Link>
      </div>

      {/* Search */}
      <form className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-[10px] bg-white border border-card-border/40">
            <Search className="h-4 w-4 text-muted" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search wines or producers..."
              className="flex-1 text-[13px] outline-none bg-transparent"
            />
          </div>
          <button type="submit" className="h-10 px-4 rounded-[10px] bg-foreground text-white text-[12px] font-semibold">Search</button>
        </div>
      </form>

      <div className="bg-white rounded-[12px] border border-card-border/40 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-card-border/30 text-[11px] font-bold text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Wine</th>
              <th className="px-4 py-3">Producer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Appellation</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {wines.map((w) => (
              <tr key={w.id} className="border-b border-card-border/20 hover:bg-butter/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-[3px] h-8 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[w.type] || "#8C7E6E" }} />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{w.name}</p>
                      <p className="text-[10px] text-muted">{w.grapes.join(", ")}{w.vintage ? ` · ${w.vintage}` : ""}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {w.winery ? (
                    <Link href={`/producers/${w.winery.slug}`} className="text-[12px] font-semibold text-cherry hover:underline">
                      {w.winery.name}
                    </Link>
                  ) : (
                    <span className="text-[12px] text-muted">{w.producer}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold capitalize" style={{ color: TYPE_COLORS[w.type] || "#8C7E6E" }}>{w.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] text-muted">{w.appellation || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold text-foreground">{w.priceRange || "—"}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/wines/${w.id}`} className="text-[11px] font-semibold text-cherry hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {wines.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-muted">
                  {search ? `No wines matching "${search}"` : "No wines yet. Add your first one."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
