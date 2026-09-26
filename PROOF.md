# PROOF — collapsed title priority (no P/V/R crush)

## Fail on bade155
Job bars crushed titles to 1–3 letters (`P`, `V`, `R`, `SAF…`) under FAB `padding-right:120px` + long green label.

## Fix (FAB stays floating)
Keep Preview as `position:fixed` FAB + #49 safe-area padding (bottom/right).
When space tight, per bar:
1. Prefer **full title**
2. **Hide hint** first
3. Shorten live lab to full short words: `on Preview` → `Preview` → `on` → dot-only
4. Light/dot hit stays ≥44×44
5. Title ellipsis **word-boundary last resort** only (never 1-letter crush)

## Proof
`collapse-ux-2026-09-26/proof-title-priority.png` — PASS @390 with padding-right:120; FAB clear of Save; titles readable.
