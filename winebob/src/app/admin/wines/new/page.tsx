"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createWine, getWineries } from "@/lib/wineryActions";

type WineryOption = { id: string; name: string; region: string };

export default function NewWinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wineries, setWineries] = useState<WineryOption[]>([]);

  useEffect(() => {
    getWineries().then((list) => {
      setWineries(list.map((w) => ({ id: w.id, name: w.name, region: w.region })));
    }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createWine({
        name: fd.get("name") as string,
        wineryId: fd.get("wineryId") as string,
        type: fd.get("type") as string,
        vintage: fd.get("vintage") ? Number(fd.get("vintage")) : undefined,
        grapes: (fd.get("grapes") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
        appellation: fd.get("appellation") as string || undefined,
        description: fd.get("description") as string || undefined,
        priceRange: fd.get("priceRange") as string || undefined,
        abv: fd.get("abv") ? Number(fd.get("abv")) : undefined,
        tastingNotes: fd.get("tastingNotes") as string || undefined,
        foodPairing: fd.get("foodPairing") as string || undefined,
      });
      router.push("/admin/wines");
    } catch {
      alert("Failed to create wine. Check all required fields.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/wines" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted mb-4 hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to wines
      </Link>
      <h1 className="text-[22px] font-bold text-foreground mb-6" style={{ fontFamily: "Georgia, serif" }}>Add Wine</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Wine info */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Wine Details</p>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Producer *</label>
            <select name="wineryId" required className="input-field w-full">
              <option value="">Select a producer...</option>
              {wineries.map((w) => (
                <option key={w.id} value={w.id}>{w.name} ({w.region})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Wine Name *</label>
            <input name="name" required className="input-field w-full" placeholder="e.g. Chambertin Grand Cru" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Type *</label>
              <select name="type" required className="input-field w-full">
                <option value="red">Red</option>
                <option value="white">White</option>
                <option value="rosé">Rosé</option>
                <option value="sparkling">Sparkling</option>
                <option value="orange">Orange</option>
                <option value="dessert">Dessert</option>
                <option value="fortified">Fortified</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Vintage</label>
              <input name="vintage" type="number" className="input-field w-full" placeholder="2020 (blank=NV)" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">ABV %</label>
              <input name="abv" type="number" step="0.1" className="input-field w-full" placeholder="13.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Appellation</label>
              <input name="appellation" className="input-field w-full" placeholder="e.g. Chambertin Grand Cru" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Price Range</label>
              <select name="priceRange" className="input-field w-full">
                <option value="">Unknown</option>
                <option value="budget">Budget (&lt;$15)</option>
                <option value="mid">Mid ($15-40)</option>
                <option value="premium">Premium ($40-100)</option>
                <option value="luxury">Luxury ($100+)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Grape Varieties (comma-separated)</label>
            <input name="grapes" className="input-field w-full" placeholder="Pinot Noir, Chardonnay" />
          </div>
        </section>

        {/* Tasting */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Description & Tasting</p>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Description</label>
            <textarea name="description" rows={2} className="input-field w-full resize-none" placeholder="Short wine description..." />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Tasting Notes</label>
            <textarea name="tastingNotes" rows={2} className="input-field w-full resize-none" placeholder="Professional tasting notes..." />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Food Pairing</label>
            <input name="foodPairing" className="input-field w-full" placeholder="e.g. Aged Comté, roast duck..." />
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-[10px] bg-cherry text-white text-[14px] font-bold hover:bg-cherry/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Creating..." : "Create Wine"}
        </button>
      </form>
    </div>
  );
}
