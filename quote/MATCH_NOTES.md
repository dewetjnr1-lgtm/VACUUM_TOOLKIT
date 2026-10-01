# Quote visual lock — match notes (2026-10-01)

**Source of truth:** Christoff attached `christoff-quote-v4-source.html` (STORAGE_KEY `busch_quote_tool_v4`).  
**Shipped as:** `quote/index.html` on Pages (replaced prior modular 26NBQ142 letter app for this URL).

## vs Claude FAIL PDF (`quote-v4-christoff.pdf`)

| FAIL | Fix |
|------|-----|
| Customer name + SPARES OFFER cluttered title stack | Toolkit letterhead + orange rule + centred title + hdr/subj meta grid |
| Black bar section heads (orange “disappeared”) | `.doc-h2` → orange ALL-CAPS + orange underline |
| Empty “3. Scope…” heading with blank body | Omit empty sections; sequential renumber |
| Body “Ord” clipped into fixed footer | `doc-footer-spacer` + `@page` bottom 30mm + z-index |
| Technical Data Images editor chrome on PDF | `#techImagesEditor` / `#offerPhotosEditor` `no-print` |
| Photos only as orphan appendix | Offer photos block with optional captions inside Offer |

## Kept from Christoff v4

- Costing calc UX (`data-out` live updates; no input destroy-on-keystroke)
- Soft Dark staff chrome; white paper
- Blank default; commercial defaults without Hydro seed
- Embedded letterhead + ANZ footer images

## Compromises

1. Prior modular `quote/app.js` + `app.css` (full 26NBQ142 TOC letter) removed from this path — short-offer product is what Christoff opens. Assets folder retained.
2. Letterhead uses embedded Busch Vacuum Solutions logo from Christoff’s file (not dual Busch/Pfeiffer plate from Toolkit chem-flush letter). Meta grid / orange heads match Toolkit spirit.
3. True multi-page “Page X of Y” not implemented (footer image only).
