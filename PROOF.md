# PROOF — preview type scale + default-collapsed (#45 candidate)

## Fail
Phone LIVE PREVIEW of chem-flush letter on main `1b06fc5` looked uneven: body larger than orange section titles (inverted hierarchy); header meta / sign-off / footer sizes felt random vs body.

Also: first open with no `vt-collapse-v2` fold state left Customer + Job sections open.

## Fix 1 — Letter type scale (Preview ≡ PDF)
CSS (`.cj-fb-letter`):
- Orange section titles `.fb-sec-letter` **14.5px / 800** — above body
- Body / lists **12.5px**
- Header meta values **11.5px**; labels **10.5px / 700** (slightly smaller than values)
- Sign-off **11.5px** (name **12.5px**); footer tag/web **10px**

jsPDF mirror:
- `custFbLetterSecHead` **11.5pt** (was 10 = body)
- Meta labels **8.5pt** bold, values **9pt** (body stays **10pt**)

## Fix 2 — Default all collapsibles CLOSED
`vtCollapseRestore`: missing key in scope map → `is-collapsed`. Remembered `true`/`false` in `vt-collapse-v2` unchanged. Collapse/Expand all, Save auto-collapse, hints, green-light, live tints untouched.

## Proof
- `collapse-ux-2026-09-26/proof-preview-type-scale.png` — phone-scaled letter hierarchy
- Fail reference: `collapse-ux-2026-09-26/fail-preview-fonts-uneven.png`
