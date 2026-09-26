# PROOF — collapsed bar layout (no title/hint overlap; full green label)

## Fail
Phone Job CLIENT FEEDBACK REPORT collapsed bars: hint overlapped title (METHOD + Introduction…); green label clipped mid-word (`live on Previe`).

## Fix
- Collapsed `.vt-collapse-bar` → **CSS grid**: arrow | title / hint stacked | live btn. Hint on its **own row under title** — cannot overwrite title.
- Green label shortened to **`on Preview`** (JS sync too); removed `max-width:72px` clip. Off → `off`.
- Arrow / live hit targets stay **44×44**. Applies to all Customer + Job collapsed bars.

## Proof
`collapse-ux-2026-09-26/proof-collapse-bar-layout.png` — PASS at 390px.
