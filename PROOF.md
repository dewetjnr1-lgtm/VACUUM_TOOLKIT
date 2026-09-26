# PROOF — word-boundary title wrap (no METH OD / PHOT OS)

## Fail on 9971797
`overflow-wrap:anywhere` letter-broke titles (`METH OD`, `PHOT OS`, `EQUIP MENT`) and line-clamp mid-word-ellipsized others.

## Fix
- Collapsed titles: `overflow-wrap:normal; word-break:normal; hyphens:none` — **never letter-break**
- Removed `anywhere` + `-webkit-line-clamp` mid-word ellipsis
- `vtTitleFitTwoLines`: ≤2 lines at **word** boundaries; ellipsis only after a full word; single long token → slight font shrink, still whole
- Phone: hints hidden; icon-only light; FAB float + #49 padding kept

## Proof
`collapse-ux-2026-09-26/proof-title-word-wrap.png` — METHOD/EQUIPMENT/FINDINGS/PHOTOS/WORK PERFORMED/RECOMMENDATIONS/SAFETY/PARTS/MATERIALS intact.
