# Aged Galaxidi travel-map — source manifest

Asset: `assets/map-galaxidi-aged.png` (580×360) — antique-styled town map for the in-game travel screen.

## Provenance
- Source: Google Maps roadmap (terrain request), embed view centred on Galaxidi.
  - Center: lat 38.3762, lon 22.3865 · zoom 15
  - Captured: 2026-06-13 via Playwright headless screenshot → `inspiration/gmaps-galaxidi-plate.png` (1160×720)
- Processing: `~/age_map.py` (deterministic, seed=1860). Crop UI margins → centre-crop to 580×360 →
  duotone (ink-brown / parchment) → noise+blotch parchment overlay → radial vignette → fibre streaks → ink border.
  Slight 0.6px blur softens modern Google labels into faded-ink annotations.

## Notes / caveats
- Modern POI labels/pins are de-emphasised, not removed (no Google Static Maps API key available for `labels:off|poi:off`).
- Geography matches existing `MAP_LOCATIONS` nodes: town centre-left, Άγ. Γεώργιος island top-right, harbour centre.
- Source is Google-derived; this is an internal restyled asset for a personal/family game, not republished base map data.

## Files
- `inspiration/gmaps-galaxidi-plate.png` — raw capture (archived source)
- `assets/map-galaxidi-aged.png` — final aged asset (wired into `index.html` map-bg)
- `assets/map-galaxidi-old.png` — previous AI-illustrated map (kept as fallback)

---

# v2 — Ancient chart (gpt-image-2 style-transfer) — 2026-06-14

Asset: `assets/map-galaxidi-ancient.png` (580×360) — now the active `map-bg`.

## Provenance
- Base: `inspiration/gmaps-galaxidi-plate.png` (real Google Maps Galaxidi).
- Style-transferred via OpenAI **gpt-image-2** `/v1/images/edits` (quality=high, 1536×1024):
  pass 1 → antique portolan/vellum chart preserving coastline (`inspiration/ancient-map-gptimage-v1.png`);
  pass 2 → text-removal to strip baked modern labels (`inspiration/ancient-map-clean-base.png`).
- Cropped to 580×360, slight contrast/colour boost.

## Ancient naming (per user: replace gameplay labels)
Title banner → «ΧΑΡΤΗΣ ΧΑΛΕΙΟΥ» (Chaleion = ancient town on the Galaxidi site; Crissaean Gulf, Ozolian Locris).
Node labels rewritten to ancient/archaic Greek: Οίκος · Λιμήν · Μουσείον · Ελαιοτριβείον · Ναός ·
Σπήλαιον · Σκοπιά · Νεκρόπολις · Ελπίς · Ιερά Νήσος. Coordinates re-tuned to this art and verified in-engine.
