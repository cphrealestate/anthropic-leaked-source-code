"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { wineRegions } from "@/data/wineRegions";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

type WineRegionMapProps = {
  onRegionClick?: (region: string, country: string) => void;
  regionCounts?: Record<string, number>;
  height?: string;
  className?: string;
};

export function WineRegionMap({ onRegionClick, regionCounts, height = "100%", className = "" }: WineRegionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  const handleRegionClick = useCallback((region: string, country: string) => {
    onRegionClick?.(region, country);
  }, [onRegionClick]);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: "Winebob",
        sources: {
          "mapbox-streets": { type: "vector", url: "mapbox://mapbox.mapbox-streets-v8" },
          "mapbox-terrain": { type: "vector", url: "mapbox://mapbox.mapbox-terrain-v2" },
          "mapbox-dem": { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512, maxzoom: 14 },
        },
        terrain: { source: "mapbox-dem", exaggeration: 1.3 },
        layers: [
          // Background
          { id: "bg", type: "background", paint: { "background-color": "#110E0A" } },
          // Hillshade for 3D terrain feel
          { id: "hillshade", type: "hillshade", source: "mapbox-terrain", "source-layer": "hillshade", paint: { "hillshade-shadow-color": "#0A0806", "hillshade-highlight-color": "#2A2418", "hillshade-accent-color": "#1A1610", "hillshade-exaggeration": 0.3 } },
          // Water
          { id: "water", type: "fill", source: "mapbox-streets", "source-layer": "water", paint: { "fill-color": "#141C28" } },
          // Land use (parks, forests etc)
          { id: "landuse", type: "fill", source: "mapbox-streets", "source-layer": "landuse", paint: { "fill-color": ["match", ["get", "class"], "park", "#141A10", "agriculture", "#16140E", "wood", "#121610", "#12100C"], "fill-opacity": 0.5 } },
          // Buildings (subtle at zoom)
          { id: "buildings", type: "fill", source: "mapbox-streets", "source-layer": "building", minzoom: 12, paint: { "fill-color": "#1A1814", "fill-opacity": 0.6 } },
          // Roads — tertiary
          { id: "roads-tertiary", type: "line", source: "mapbox-streets", "source-layer": "road", filter: ["in", "class", "street", "street_limited"], minzoom: 10, paint: { "line-color": "#1E1A14", "line-width": 0.5 } },
          // Roads — secondary
          { id: "roads-secondary", type: "line", source: "mapbox-streets", "source-layer": "road", filter: ["in", "class", "secondary", "tertiary"], minzoom: 8, paint: { "line-color": "#221E16", "line-width": 0.8 } },
          // Roads — primary
          { id: "roads-primary", type: "line", source: "mapbox-streets", "source-layer": "road", filter: ["in", "class", "primary", "trunk"], paint: { "line-color": "#2A2418", "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 10, 1.5] } },
          // Roads — motorway
          { id: "roads-motorway", type: "line", source: "mapbox-streets", "source-layer": "road", filter: ["==", "class", "motorway"], paint: { "line-color": "#302818", "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 10, 2] } },
          // Admin boundaries
          { id: "admin-0", type: "line", source: "mapbox-streets", "source-layer": "admin", filter: ["==", "admin_level", 0], paint: { "line-color": "#3A3020", "line-width": 0.8, "line-opacity": 0.5 } },
          { id: "admin-1", type: "line", source: "mapbox-streets", "source-layer": "admin", filter: ["==", "admin_level", 1], minzoom: 4, paint: { "line-color": "#2A2418", "line-width": 0.4, "line-opacity": 0.3, "line-dasharray": [3, 2] } },
          // Place labels — countries
          { id: "labels-country", type: "symbol", source: "mapbox-streets", "source-layer": "place_label", filter: ["==", "class", "country"], layout: { "text-field": ["get", "name_en"], "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 5, 13], "text-transform": "uppercase", "text-letter-spacing": 0.15, "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"] }, paint: { "text-color": "#5A4E3A", "text-opacity": 0.7 } },
          // Place labels — cities
          { id: "labels-city", type: "symbol", source: "mapbox-streets", "source-layer": "place_label", filter: ["in", "class", "city"], layout: { "text-field": ["get", "name_en"], "text-size": ["interpolate", ["linear"], ["zoom"], 4, 9, 8, 13], "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"] }, paint: { "text-color": "#4A4030", "text-opacity": 0.5, "text-halo-color": "#110E0A", "text-halo-width": 1 } },
          // Place labels — towns (at higher zoom)
          { id: "labels-town", type: "symbol", source: "mapbox-streets", "source-layer": "place_label", filter: ["in", "class", "town", "village"], minzoom: 8, layout: { "text-field": ["get", "name_en"], "text-size": 10, "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"] }, paint: { "text-color": "#3A3428", "text-opacity": 0.4, "text-halo-color": "#110E0A", "text-halo-width": 1 } },
        ],
      } as mapboxgl.StyleSpecification,
      center: [12, 44],
      zoom: 3.5,
      minZoom: 1.5,
      maxZoom: 14,
      attributionControl: false,
      pitch: 20,
      bearing: 0,
    });

    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 8,
      className: "wb-popup",
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add wine region polygons
      map.current.addSource("wine-regions", {
        type: "geojson",
        data: wineRegions as GeoJSON.FeatureCollection,
      });

      // Fill
      map.current.addLayer({
        id: "wine-regions-fill",
        type: "fill",
        source: "wine-regions",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.45, 0.2],
        },
      });

      // Border
      map.current.addLayer({
        id: "wine-regions-border",
        type: "line",
        source: "wine-regions",
        paint: {
          "line-color": ["get", "color"],
          "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 2, 1],
          "line-opacity": 0.6,
        },
      });

      // Labels
      map.current.addLayer({
        id: "wine-regions-label",
        type: "symbol",
        source: "wine-regions",
        layout: {
          "text-field": ["get", "name"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 3, 8, 6, 12, 8, 14],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#E0D4C0",
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0.5, 5, 0.8],
          "text-halo-color": "rgba(0,0,0,0.7)",
          "text-halo-width": 1.2,
        },
      });

      let hoveredId: string | number | null = null;

      map.current.on("mousemove", "wine-regions-fill", (e) => {
        if (!map.current || !e.features?.length) return;
        map.current.getCanvas().style.cursor = "pointer";

        if (hoveredId !== null) {
          map.current.setFeatureState({ source: "wine-regions", id: hoveredId }, { hover: false });
        }
        hoveredId = e.features[0].id ?? null;
        if (hoveredId !== null) {
          map.current.setFeatureState({ source: "wine-regions", id: hoveredId }, { hover: true });
        }

        const props = e.features[0].properties;
        if (props && popup.current && map.current) {
          const count = regionCounts?.[props.name] ?? 0;
          popup.current
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family:system-ui,sans-serif">
                <p style="font-size:13px;font-weight:700;color:#F0E8D8;margin:0">${props.name}</p>
                <p style="font-size:10px;color:#8A7E6A;margin:2px 0 0">${props.country} · ${props.grapes}</p>
                ${count > 0 ? `<p style="font-size:11px;font-weight:600;color:#E8A08A;margin:3px 0 0">${count} wines</p>` : ""}
              </div>
            `)
            .addTo(map.current);
        }
      });

      map.current.on("mouseleave", "wine-regions-fill", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
        if (hoveredId !== null) {
          map.current.setFeatureState({ source: "wine-regions", id: hoveredId }, { hover: false });
        }
        hoveredId = null;
        popup.current?.remove();
      });

      map.current.on("click", "wine-regions-fill", (e) => {
        if (!e.features?.length) return;
        const props = e.features[0].properties;
        if (props) handleRegionClick(props.name, props.country);
      });
    });

    return () => { popup.current?.remove(); map.current?.remove(); };
  }, [handleRegionClick, regionCounts]);

  // ── Fallback without token ──
  if (!MAPBOX_TOKEN) {
    const regions = wineRegions.features.map((f) => f.properties);
    return (
      <div className={`bg-[#1C1A16] flex flex-col items-center justify-center ${className}`} style={{ height }}>
        <p style={{ color: "#8A7E6A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          Wine Regions of the World
        </p>
        <div className="flex flex-wrap justify-center gap-2 px-6 max-w-lg">
          {regions.map((r) => (
            <button
              key={r.name}
              onClick={() => handleRegionClick(r.name, r.country)}
              className="px-3 py-1.5 rounded-[8px] text-[11px] font-semibold active:scale-95 transition-transform"
              style={{ background: `${r.color}30`, color: `${r.color}`, border: `1px solid ${r.color}40` }}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .wb-popup .mapboxgl-popup-content {
          background: rgba(20,18,14,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .wb-popup .mapboxgl-popup-tip { border-top-color: rgba(20,18,14,0.92); }
        .mapboxgl-ctrl { display: none !important; }
      `}</style>
      <div ref={mapContainer} className={className} style={{ height }} />
    </>
  );
}
