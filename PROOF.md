# PROOF — section body matches signature (beats body-too-big fail)

## Why #46 still looked wrong
CSS already had body 11 ≤ meta 13, but dense section paragraphs optically dominated sparse meta + signature. Fail: `/workspace/qa/fail-letter-body-too-big.png`.

## Fix (Preview ≡ PDF)
| Band | CSS | jsPDF |
|------|-----|-------|
| Orange section headings | **17px / 800** (unchanged) | **13.5pt** |
| Meta values / labels | **13px** / **12px 800** | **10.5** / **10** |
| **Section body / lists** | **9.5px** lh 1.35 | **8.5pt** |
| Sign-off / name | **9.5px** / **11px** | **8.5** / **9.5** |

Measured @390 phone scale: body glyphH = sign glyphH (5.64) < meta (7.70); sec/body ≈ 1.79.

## Proof
`collapse-ux-2026-09-26/proof-body-match-sign.png` — PASS
