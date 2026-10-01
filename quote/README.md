# Busch WA — Quote & Costing (short offer / visual lock)

Phone-first static web tool for Busch WA **spares / short offers** + internal costing.

**Live:** https://dewetjnr1-lgtm.github.io/VACUUM_TOOLKIT/quote/

## Open

Open `index.html` in a modern browser (or the live Pages URL).  
Single-file app (`index.html`) — no build step. Soft Dark phone chrome; **white paper** print.

## Visual lock (2026-10-01)

Matches Toolkit Client feedback letter spirit:

1. **Header** — letterhead logo + orange rule + tidy document title + meta grid (ATTENTION / COMPANY / EMAIL / PHONE / FROM / DATE / SUBJECT / BUSCH REF / YOUR REF). No cluttered customer-name + title stack.
2. **Section heads** — Busch orange (`#FF6A1A`), numbered ALL-CAPS, orange underline (not black bar).
3. **Empty sections omitted** — no heading/body when empty; remaining sections renumber 1,2,3…
4. **Footer safe** — spacer + `@page` bottom margin so body does not print through company footer.
5. **Empty photos** — editor chrome is `no-print`; empty photo set → nothing on PDF.
6. **Offer photos** — attach ≥1 photo into the Offer area with optional caption; zero → block absent.

## Tabs

| Tab | Who | What |
|-----|-----|------|
| **1 Quote Setup** | Staff | Customer / NBQ / commercial / FX / signature |
| **2 Costing** | Staff | Import + local lines; margin; landed → sell. **Never on PDF.** |
| **3 Preview & Print** | Customer view | Paper letter. Offer photos + Technical Data images (staff editors; print only when populated). |

## Hard wall

Internal FX buffer / landed / margin **never** appear on the customer PDF.

## Blank start

New quotes start blank (no Hydro / 26NBQ142 auto-prefill). Use **Open…** for a saved `.buschquote.json`.

## Save

Autosave to `localStorage` (`busch_quote_tool_v4`). **Save As…** downloads JSON.

## Print

Preview → **Print / PDF** (browser Save as PDF).
