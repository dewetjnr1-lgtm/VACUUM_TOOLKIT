# PROOF — FAB safe area + word-boundary collapsed hints

## Fail (Quack GOLD on b38cf26)
1. Preview FAB covered Save + lower bar green lights.
2. Collapsed hints mid-word ellipsis (`Introduction to BUS…`, `All the works were c…`).

## Fix
- Phone + `body.cj-live-open`: form col `padding-bottom:108px` + `padding-right:120px` so Save and live lights clear the FAB (44×44+ hits kept).
- `vtHintClip` ends on **word boundary**; `vtHintFitEl` / `vtHintsFitAll` fit or hide hints (no CSS mid-char ellipsis). #47 stacked title/hint kept.
- #48 letter type scale untouched.

## Proof
`collapse-ux-2026-09-26/proof-fab-safe-area.png` — PASS (save∩FAB=false, light∩FAB=false, midWordHint=false)
