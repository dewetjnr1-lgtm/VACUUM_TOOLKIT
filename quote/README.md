# Busch WA — Quote & Costing (v1)

Phone-first static web tool for Busch WA offer letters + internal costing.  
**Not a Claude clone.** UX follows Desi lock; customer letter follows sample **26NBQ142 Rev.0** (Hydro Australia / LB 0265 A).

## Open

Open `index.html` in a modern browser (Chrome / Edge / Safari).  
No build step. Files: `index.html`, `app.css`, `app.js`.

For local serving (optional, helps some FX CORS cases):

```bash
cd /workspace/quoting/app && python3 -m http.server 8765
# then http://localhost:8765/
```

## Tabs

| Tab | Who | What |
|-----|-----|------|
| **Setup** | Staff | Customer / Attn / NBQ / Date, country→FX, margin, buffer **0.15**. *More* accordion for commercial, defaults, letter body, signature. Internal FX strip (live + buffered + stamp) — **never on PDF**. |
| **Costing** | Staff | Starts empty (+ demo seed on first run). **Add import** / **Add local**. Collapsed rows. Yellow = edit. Flags: Include \| Option \| Exclude. `Sell = Landed ÷ (1 − margin)`. |
| **Preview** | Customer view | Paper letter in the 26NBQ142 family. Tickable sections. **Images / drawings** panel (staff): add photos/GA with size S/M/L + frame; they print under Item 6 **only when that section is ticked**. AUD + GST options, ex Canning Vale. **Hard wall:** no cost / landed / margin / raw or buffered FX in the letter DOM. |

## FX

1. Pick **country of origin** → currency map.  
2. Fetch **Frankfurter** `https://api.frankfurter.dev/v2` (AUD per 1 foreign).  
3. Fallback **open.er-api.com**.  
4. Costing uses **buffered** rate = live × (1 + buffer). Default buffer **0.15**.  
5. Cache last good rate in `localStorage`. Manual override if both fail.  
6. Letter commercial “exchange rate” wording uses **live** rate only (AUD sell). AUD origin = rate 1, buffer off.

## Save / open

- **Autosave** to `localStorage` (`busch-wa-quote-v1`).  
- **Save** downloads JSON. **Open** loads JSON. **New** blanks. **Demo** reseeds Hydro / LB 0265 A.

## Print

Preview → **Print / PDF**. Blocked if customer empty or zero Include lines (reason shown inline). Use browser print → Save as PDF.

## Sample lock

See `/workspace/quoting/SAMPLE_QUOTE_LOCK.md` and `MATCH_NOTES.md` in this folder.

## Images

Optional drawings live in quote JSON (compressed JPEG data URLs). Demo ships `assets/demo-drawing1.jpg` / `demo-drawing2.jpg` extracted from sample 26NBQ142 pages 3–4. Tick **6. Vacuum pump drawing** on Preview to show them on paper/print; untick to hide.
