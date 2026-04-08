"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createWinery } from "@/lib/wineryActions";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewProducerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createWinery({
        name: fd.get("name") as string,
        slug: fd.get("slug") as string,
        description: fd.get("description") as string || undefined,
        history: fd.get("history") as string || undefined,
        philosophy: fd.get("philosophy") as string || undefined,
        founded: fd.get("founded") ? Number(fd.get("founded")) : undefined,
        owner: fd.get("owner") as string || undefined,
        winemaker: fd.get("winemaker") as string || undefined,
        website: fd.get("website") as string || undefined,
        email: fd.get("email") as string || undefined,
        phone: fd.get("phone") as string || undefined,
        instagram: fd.get("instagram") as string || undefined,
        lat: Number(fd.get("lat")) || 0,
        lng: Number(fd.get("lng")) || 0,
        address: fd.get("address") as string || undefined,
        region: fd.get("region") as string,
        country: fd.get("country") as string,
        featured: fd.get("featured") === "on",
        visitBooking: fd.get("visitBooking") as string || undefined,
        annualBottles: fd.get("annualBottles") ? Number(fd.get("annualBottles")) : undefined,
        vineyardSize: fd.get("vineyardSize") as string || undefined,
        grapeVarieties: (fd.get("grapeVarieties") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
        wineStyles: (fd.get("wineStyles") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
        certifications: (fd.get("certifications") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
      });
      router.push("/admin/producers");
    } catch (err) {
      alert("Failed to create producer. Check all required fields.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/producers" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted mb-4 hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to producers
      </Link>
      <h1 className="text-[22px] font-bold text-foreground mb-6" style={{ fontFamily: "Georgia, serif" }}>Add Producer</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Basic Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Name *</label>
              <input name="name" required value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" placeholder="e.g. Domaine de la Romanée-Conti" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Slug *</label>
              <input name="slug" required defaultValue={slugify(name)} key={name} className="input-field w-full" placeholder="domaine-de-la-romanee-conti" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Founded</label>
              <input name="founded" type="number" className="input-field w-full" placeholder="1232" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Owner</label>
              <input name="owner" className="input-field w-full" placeholder="Owner name" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Winemaker</label>
              <input name="winemaker" className="input-field w-full" placeholder="Head winemaker" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Description</label>
            <textarea name="description" rows={3} className="input-field w-full resize-none" placeholder="Short description of the producer..." />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">History</label>
            <textarea name="history" rows={3} className="input-field w-full resize-none" placeholder="Longer story about the winery..." />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Philosophy</label>
            <input name="philosophy" className="input-field w-full" placeholder="e.g. Organic, Biodynamic, Natural..." />
          </div>
        </section>

        {/* Location */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Region *</label>
              <input name="region" required className="input-field w-full" placeholder="e.g. Burgundy" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Country *</label>
              <input name="country" required className="input-field w-full" placeholder="e.g. France" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Latitude *</label>
              <input name="lat" required type="number" step="any" className="input-field w-full" placeholder="47.1570" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Longitude *</label>
              <input name="lng" required type="number" step="any" className="input-field w-full" placeholder="4.9500" />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Address</label>
              <input name="address" className="input-field w-full" placeholder="Full address" />
            </div>
          </div>
        </section>

        {/* Contact & social */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Contact & Social</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Website</label><input name="website" className="input-field w-full" placeholder="https://..." /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Email</label><input name="email" type="email" className="input-field w-full" placeholder="info@..." /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Phone</label><input name="phone" className="input-field w-full" placeholder="+33..." /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Instagram</label><input name="instagram" className="input-field w-full" placeholder="@handle" /></div>
            <div className="col-span-2"><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Visit Booking URL</label><input name="visitBooking" className="input-field w-full" placeholder="https://booking..." /></div>
          </div>
        </section>

        {/* Production */}
        <section className="bg-white rounded-[12px] border border-card-border/40 p-5 space-y-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Production</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Vineyard Size</label><input name="vineyardSize" className="input-field w-full" placeholder="e.g. 28 hectares" /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Annual Bottles</label><input name="annualBottles" type="number" className="input-field w-full" placeholder="80000" /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Grape Varieties (comma-separated)</label><input name="grapeVarieties" className="input-field w-full" placeholder="Pinot Noir, Chardonnay" /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Wine Styles (comma-separated)</label><input name="wineStyles" className="input-field w-full" placeholder="red, white" /></div>
            <div><label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Certifications (comma-separated)</label><input name="certifications" className="input-field w-full" placeholder="organic, biodynamic" /></div>
            <div className="flex items-center gap-2 pt-5">
              <input name="featured" type="checkbox" id="featured" className="h-4 w-4 accent-cherry" />
              <label htmlFor="featured" className="text-[12px] font-semibold text-foreground/70">Featured Producer</label>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-[10px] bg-cherry text-white text-[14px] font-bold hover:bg-cherry/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Creating..." : "Create Producer"}
        </button>
      </form>
    </div>
  );
}
