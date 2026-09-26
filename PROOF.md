# PROOF — phone collapsed titles wrap (no mid-word cut)

## Fail on e5915e9
Phone bars still mid-word truncated (`EQUIPM`, `FINDIN`, `RECOM`, `PARTS/`, `CLOSIN`) under FAB padding + nowrap.

## Fix
- Collapsed titles: `white-space:normal` + up to **2-line wrap** (`line-clamp:2`) — **no mid-word ellipsis**
- Phone (`max-width:999px`): hide hints; live lab icon-only; fixed **44px** light column
- Preview stays **floating** FAB + #49 `padding-bottom` / `padding-right:120px`
- Wider layouts: word-boundary hint fit still available; title stays full (wrap)

## Proof
`collapse-ux-2026-09-26/proof-title-wrap.png` — PASS @390: PHOTOS / SAFETY / PARTS/MATERIALS / OUTSTANDING (+ full list) readable; FAB float clear of Save.
