# What matches sample 26NBQ142 vs still rough

## Matches (spirit / structure) — improved 2026-09-19 polish

- Letter title family: **BUSCH LIQUID RING VACUUM PUMP OFFER** (centred, bold caps)
- **Letterhead:** top-right `assets/letterhead-logos.png` (Part of the BUSCH GROUP + Busch / Pfeiffer) with thin **orange** rule under logos
- Header density: two-column **ATTENTION / COMPANY / FROM | EMAIL / PHONE / DATE** with label min-widths + aligned colons (Word-like)
- **SUBJECT / BUSCH REF / YOUR REF** with same label column alignment; thin grey rules framing header blocks
- Greeting + intro paragraph
- Numbered TOC → Items 2–9; TOC rows as `Item N` / `-` / title with breathing room
- **Section headings:** bright Busch orange (`#FF6600`), bold ALL CAPS, full-width grey rule under each numbered `.sec-h`
- Sub-heads (5.1 / 5.2 / 5.4) also orange caps (sample spirit)
- **Body:** Arial/Helvetica, dark ink on **white paper**; tighter professional spacing
- Scope with **Option A / Option B** style rows — label LEFT (uppercase), **AU$ … + GST** RIGHT, stronger emphasis
- Nett line: **ex Canning Vale WA**
- Commercial block with exchange-rate wording (live sell-side only), payment stages, lead sea/air, validity, warranty
- Signature block (André de Wet style fields)
- **Stationery footer** on paper (+ print): BUSCH ANZ address | phone | email/web · ABN/UST-ID + CBA/NAB bank block · countries line · **Page 1 of —** hint (dense small type)
- Tall page spirit (~sample / A4-ish `min-height`); `@media print` hides app chrome, A4 page
- Demo seed loosely Hydro Australia / LB 0265 A / 26NBQ142 Rev.0
- Hard wall: Preview has no landed / margin % / buffer / raw FX math
- **Images / drawings:** staff Images panel on Preview — add/remove, caption, size S/M/L, frame none/thin/double; JPEG compress (~1200w @0.7) into state/JSON; **only printed when Item 6 drawing section is ticked**; demo seed includes one GA from sample PDF (`assets/demo-drawing1.jpg`)
- Phone chrome: Setup | Costing | Preview big taps; dark + Busch orange; Setup accordion + More — **staff UI stays dark; only paper is white**

## Still rough / deferred

- Pixel-perfect Word metrics (exact label tab stops, multi-page repeating letterhead, true “Page X of Y” across print pages)
- `letterhead-banner.png` is the sample **footer raster** (naming legacy); Preview uses HTML stationery instead of that PNG for crisp type — raster can be swapped in later if desired
- Full legal T&Cs appendix (Item 9 is a short pointer, not 4 pages of clauses)
- Pixel-perfect GA crop / multi-page drawing sheets (v1: optional compressed images with S/M/L + frame)
- Pixel-perfect Option A/B sample dollars (demo ExW is approximate; live FX + buffer will move sells)
- Dual sea+air freight as always-on columns (v1: per-line freight % instead)
- SharePoint / Power Automate
- Per-line FX (one origin per quote in v1)
- RFQ compliance block (5.5) and full Item 5.3 dossier wording — abbreviated
- Yellow budgetary highlight band on the * note (sample has it; Preview uses plain note)
- Exact sample orange rule weight / logo crop vs Word PDF extract

## Hard wall check

Preview DOM is built from sell totals + letter/commercial text only. Staff calc chips stay on Costing. FX strip stays on Setup. Forbidden-token probe remains in `renderPreview()`.
