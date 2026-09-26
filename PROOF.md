# PROOF — collapse follow-on (reminders / persist / all / flash + Desi tints)

Base: `4865087` (PR #43). Cool Dark 1 / Light 1 only — no yellow.

## Extras
1. Collapsed bar one-line reminder (`.vt-collapse-hint`) from key fields, e.g. Details → `HIO · Wet plant`.
2. Open/closed remembered per Customer / Job + section id (`localStorage` key `vt-collapse-v2`).
3. Collapse all / Expand all on Customer and Job.
4. Green-light flip: dot pulse + Saved-chip flash.

## Colour tokens (Desi exact)
| | ON | ON fill | OFF/danger | OFF ring/hollow |
|---|---|---|---|---|
| Dark | `#3DDB9A` | `#0F2E22` | `#E85A6B` | `#4A2028` |
| Light | `#1A9F68` | soft `#D5EBE1` | `#C43B4E` | `#E8C8CD` |

## Non-regress (#43)
Collapse-after-Save only · letterEmail/contactName on Customer · Dark/Light toggle · sticky Preview · BA · letterhead · UNIFIED.
