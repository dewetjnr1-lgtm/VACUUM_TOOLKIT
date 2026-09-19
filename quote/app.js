/* Busch WA Quote & Costing — unique v1 (Desi UX + 26NBQ142 letter spirit) */
(function () {
  "use strict";

  const STORAGE_KEY = "busch-wa-quote-v3-blank";
  const FX_CACHE_KEY = "busch-wa-fx-cache-v1";
  const APP_VERSION = 1;

  /* ---- Country → currency (favourites first) ---- */
  const COUNTRY_MAP = [
    { country: "Germany", currency: "EUR", fav: true },
    { country: "United States", currency: "USD", fav: true },
    { country: "China", currency: "CNY", fav: true },
    { country: "United Kingdom", currency: "GBP", fav: true },
    { country: "Italy", currency: "EUR", fav: true },
    { country: "Switzerland", currency: "CHF", fav: true },
    { country: "Japan", currency: "JPY", fav: true },
    { country: "South Korea", currency: "KRW", fav: true },
    { country: "Czechia", currency: "CZK", fav: true },
    { country: "Netherlands", currency: "EUR", fav: true },
    { country: "Australia", currency: "AUD", fav: true },
    { country: "Austria", currency: "EUR" },
    { country: "Belgium", currency: "EUR" },
    { country: "Brazil", currency: "BRL" },
    { country: "Canada", currency: "CAD" },
    { country: "Croatia", currency: "EUR" },
    { country: "Denmark", currency: "DKK" },
    { country: "Finland", currency: "EUR" },
    { country: "France", currency: "EUR" },
    { country: "Hong Kong", currency: "HKD" },
    { country: "Hungary", currency: "HUF" },
    { country: "India", currency: "INR" },
    { country: "Ireland", currency: "EUR" },
    { country: "Israel", currency: "ILS" },
    { country: "Malaysia", currency: "MYR" },
    { country: "Mexico", currency: "MXN" },
    { country: "New Zealand", currency: "NZD" },
    { country: "Norway", currency: "NOK" },
    { country: "Poland", currency: "PLN" },
    { country: "Portugal", currency: "EUR" },
    { country: "Romania", currency: "RON" },
    { country: "Singapore", currency: "SGD" },
    { country: "South Africa", currency: "ZAR" },
    { country: "Spain", currency: "EUR" },
    { country: "Sweden", currency: "SEK" },
    { country: "Taiwan", currency: "TWD" },
    { country: "Thailand", currency: "THB" },
    { country: "Türkiye", currency: "TRY" },
    { country: "United Arab Emirates", currency: "AED" },
    { country: "Other / Manual", currency: "MANUAL" },
  ];

  /* ---- Helpers ---- */
  function n(v) {
    if (v === null || v === undefined || v === "") return 0;
    const f = parseFloat(v);
    return isNaN(f) ? 0 : f;
  }
  function nOr(v, d) {
    if (v === null || v === undefined || v === "") return d;
    const f = parseFloat(v);
    return isNaN(f) ? d : f;
  }
  function esc(s) {
    return (s == null ? "" : String(s))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function fmtAUD(v) {
    const x = n(v);
    return (
      "AU$ " +
      x.toLocaleString("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  function fmtRate(v) {
    return n(v).toFixed(4);
  }
  function uid() {
    return "L" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }
  function formatLongDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /* ---- State ---- */
  function blankCommercial() {
    return {
      payment: "",
      delivery: "",
      validity: "",
      warranty: "",
      excluded: "",
      specialNotice: "",
      leadSea: "",
      leadAir: "",
      paint: "",
      general: "",
    };
  }

  /** Deliberate insert only — never auto on blank/new */
  function standardCommercial() {
    return {
      payment:
        "Stage payments apply: 10% on front-end documents, 30% on castings approval, 50% on shipment, 10% on final documentation. Pending credit approval.",
      delivery: "Ex Works, BUSCH Canning Vale WA. Collection by purchaser.",
      validity: "This quotation is valid for 30 days from the above date.",
      warranty:
        "Eighteen (18) months from date of delivery or Twelve (12) months from date of installation, whichever occurs first.",
      excluded:
        "All pricing excludes GST, control panel, motor starters, all on-site mechanical & electrical work, installation & commissioning.",
      specialNotice:
        "Our delivery obligation is subject to the timely and correct delivery by our suppliers. Force majeure events extend the delivery period. Claims for damages are excluded in those cases.",
      leadSea:
        "Lead time (Pump) 32 Working weeks ex-works factory from clear PO, plus approximately 6 to 8 weeks sea freight to Western Australia.",
      leadAir:
        "Lead time (Pump) 32 Working weeks ex-works factory from clear PO, plus approximately 2 weeks airfreight to Western Australia.",
      paint: "Pump supplied unpainted, as per original specification.",
      general:
        "Standard Busch Terms and Conditions Apply, available on request. Sending a purchase order is deemed acceptance of this quote.",
    };
  }

  function blankSections() {
    return {
      toc: true,
      intro: true,
      unitDetails: true,
      selection: true,
      scope: true,
      drawing: false,
      techData: true,
      commercial: true,
      terms: true,
    };
  }

  function blankLetter() {
    return {
      title: "",
      greetingName: "",
      introText: "",
      unitDetailsText: "",
      selectionText: "",
      scopeSupplyText: "",
      scopeBullets: "",
      testingText: "",
      importantNotes: "",
      techRows: "",
      termsSummary: "",
    };
  }

  function blankState() {
    return {
      version: APP_VERSION,
      header: {
        customer: "",
        attn: "",
        email: "",
        phone: "",
        nbq: "",
        rev: "",
        date: "",
        yourRef: "",
        subject: "",
        fromName: "",
        fromTitle: "",
        fromPhone: "",
        fromEmail: "",
        fromOffice: "",
      },
      origin: {
        country: "",
        currency: "",
        liveRate: null,
        bufferedRate: null,
        rateDate: null,
        rateSource: null,
        manualRate: null,
        fetching: false,
        lastError: null,
      },
      defaults: {
        marginPct: 0.3,
        fxBuffer: 0.15,
        boxingPct: 0.02,
        freightPct: 0.08,
        clearancePct: 0.03,
        dutyPct: 0,
        labourRate: 185,
        freightMode: "sea",
      },
      commercial: blankCommercial(),
      letter: blankLetter(),
      sections: blankSections(),
      items: [],
      images: [],
      meta: { savedAt: null, name: "" },
    };
  }

  function newImportItem() {
    return {
      id: uid(),
      type: "import",
      flag: "include",
      description: "",
      qty: 1,
      exworks: 0,
      discountMultiplier: 1,
      boxingPct: null,
      boxingAmt: 0,
      freightPct: null,
      freightAmt: 0,
      clearancePct: null,
      clearanceAmt: 0,
      dutyPct: null,
      dutyAmt: 0,
      localParts: 0,
      marginPct: null,
      optionLabel: "",
      freightMode: null,
      open: true,
    };
  }


  function newImageItem() {
    return {
      id: uid(),
      src: "",
      caption: "",
      size: "M",
      frame: "thin",
    };
  }

  /** Compress picked file → JPEG data URL (maxW 1200, q ~0.7) for light JSON */
  function compressImageFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("Not an image"));
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        try {
          const maxW = 1200;
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };
      img.src = url;
    });
  }

  function newLocalItem() {
    return {
      id: uid(),
      type: "local",
      flag: "include",
      description: "",
      qty: 1,
      labourHours: 0,
      labourRate: null,
      parts: 0,
      subcontract: 0,
      freight: 0,
      other: 0,
      marginPct: null,
      markupAmt: 0,
      optionLabel: "",
      open: true,
    };
  }

  /* ---- Costing math (staff only) ---- */
  function effectiveFx(state) {
    const o = state.origin;
    if (!o.currency) return { live: 0, buffered: 0, local: false };
    if (o.currency === "AUD") return { live: 1, buffered: 1, local: true };
    const live = o.manualRate != null && o.manualRate !== "" ? n(o.manualRate) : n(o.liveRate);
    if (!(live > 0)) return { live: 0, buffered: 0, local: false };
    const buf = nOr(state.defaults.fxBuffer, 0.15);
    // live = AUD per 1 foreign; buffer worsens (raises) AUD cost
    const buffered = live * (1 + buf);
    return { live, buffered, local: false };
  }

  function computeImport(item, state) {
    const fx = effectiveFx(state);
    const rate = fx.buffered;
    const exworksAUD =
      rate > 0 ? n(item.exworks) * rate * nOr(item.discountMultiplier, 1) : 0;
    const boxingPct = nOr(item.boxingPct, state.defaults.boxingPct);
    const freightPct = nOr(item.freightPct, state.defaults.freightPct);
    const clearancePct = nOr(item.clearancePct, state.defaults.clearancePct);
    const dutyPct = nOr(item.dutyPct, state.defaults.dutyPct);
    const landed =
      exworksAUD * (1 + boxingPct) * (1 + freightPct) * (1 + clearancePct) * (1 + dutyPct) +
      n(item.boxingAmt) +
      n(item.freightAmt) +
      n(item.clearanceAmt) +
      n(item.dutyAmt) +
      n(item.localParts);
    const marginPct = nOr(item.marginPct, state.defaults.marginPct);
    const unitSell = marginPct < 1 ? landed / (1 - marginPct) : 0;
    const qty = Math.max(1, n(item.qty) || 1);
    return {
      exworksAUD,
      landed,
      unitSell,
      lineTotal: unitSell * qty,
      lineCost: landed * qty,
      marginPct,
      qty,
    };
  }

  function computeLocal(item, state) {
    const rate = nOr(item.labourRate, state.defaults.labourRate);
    const labourCost = n(item.labourHours) * rate;
    const unitCost =
      labourCost + n(item.parts) + n(item.subcontract) + n(item.freight) + n(item.other);
    const marginPct = nOr(item.marginPct, state.defaults.marginPct);
    let unitSell = marginPct < 1 ? unitCost / (1 - marginPct) : 0;
    unitSell += n(item.markupAmt);
    const qty = Math.max(1, n(item.qty) || 1);
    return {
      landed: unitCost,
      unitSell,
      lineTotal: unitSell * qty,
      lineCost: unitCost * qty,
      marginPct,
      qty,
    };
  }

  function computeItem(item, state) {
    return item.type === "local" ? computeLocal(item, state) : computeImport(item, state);
  }

  function totals(state) {
    let includeSell = 0,
      includeCost = 0,
      optionSell = 0,
      optionCost = 0;
    state.items.forEach(function (it) {
      const c = computeItem(it, state);
      if (it.flag === "include") {
        includeSell += c.lineTotal;
        includeCost += c.lineCost;
      } else if (it.flag === "option") {
        optionSell += c.lineTotal;
        optionCost += c.lineCost;
      }
    });
    const gp = includeSell - includeCost;
    const margin = includeSell > 0 ? gp / includeSell : 0;
    return { includeSell, includeCost, optionSell, optionCost, gp, margin };
  }

  /* ---- FX fetch ---- */
  function loadFxCache() {
    try {
      return JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveFxCache(cache) {
    try {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {}
  }

  async function fetchFrankfurter(currency) {
    const url =
      "https://api.frankfurter.dev/v2/latest?from=" +
      encodeURIComponent(currency) +
      "&to=AUD";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Frankfurter " + res.status);
    const data = await res.json();
    if (!data.rates || data.rates.AUD == null) throw new Error("No AUD rate");
    return { rate: data.rates.AUD, date: data.date || todayISO(), source: "frankfurter" };
  }

  async function fetchOpenEr(currency) {
    const url = "https://open.er-api.com/v6/latest/" + encodeURIComponent(currency);
    const res = await fetch(url);
    if (!res.ok) throw new Error("open.er-api " + res.status);
    const data = await res.json();
    if (data.result !== "success" || !data.rates || data.rates.AUD == null)
      throw new Error("No AUD in open.er-api");
    return {
      rate: data.rates.AUD,
      date: (data.time_last_update_utc || "").slice(0, 16) || todayISO(),
      source: "open.er-api.com",
    };
  }

  async function fetchFx(state, force) {
    const cur = state.origin.currency;
    if (cur === "AUD") {
      state.origin.liveRate = 1;
      state.origin.bufferedRate = 1;
      state.origin.rateDate = todayISO();
      state.origin.rateSource = "local AUD";
      state.origin.lastError = null;
      return;
    }
    if (cur === "MANUAL") {
      state.origin.lastError = "Pick a currency or enter manual rate";
      return;
    }
    const cache = loadFxCache();
    if (!force && cache[cur] && cache[cur].rate > 0) {
      state.origin.liveRate = cache[cur].rate;
      state.origin.rateDate = cache[cur].date;
      state.origin.rateSource = (cache[cur].source || "cache") + " (cached)";
      const buf = nOr(state.defaults.fxBuffer, 0.15);
      state.origin.bufferedRate = state.origin.liveRate * (1 + buf);
      state.origin.lastError = null;
    }
    state.origin.fetching = true;
    renderFxStrip();
    try {
      let result;
      try {
        result = await fetchFrankfurter(cur);
      } catch (e1) {
        result = await fetchOpenEr(cur);
      }
      state.origin.liveRate = result.rate;
      state.origin.rateDate = result.date;
      state.origin.rateSource = result.source;
      state.origin.lastError = null;
      const buf = nOr(state.defaults.fxBuffer, 0.15);
      state.origin.bufferedRate = result.rate * (1 + buf);
      cache[cur] = { rate: result.rate, date: result.date, source: result.source, ts: Date.now() };
      saveFxCache(cache);
    } catch (err) {
      if (cache[cur] && cache[cur].rate > 0) {
        state.origin.liveRate = cache[cur].rate;
        state.origin.rateDate = cache[cur].date;
        state.origin.rateSource = "cache (offline)";
        const buf = nOr(state.defaults.fxBuffer, 0.15);
        state.origin.bufferedRate = cache[cur].rate * (1 + buf);
        state.origin.lastError = "Live fetch failed — using cached rate";
      } else {
        state.origin.lastError = "FX fetch failed — enter manual rate";
      }
    }
    state.origin.fetching = false;
  }

  /* ---- Demo seed (Hydro / LB 0265 A spirit) ---- */
  function seedDemo() {
    const s = blankState();
    s.header = {
      customer: "Hydro Australia",
      attn: "David Brett",
      email: "DBrett@hydroaustralia.com.au",
      phone: "+61 0 428 291 388",
      nbq: "26NBQ142",
      rev: "0",
      date: "2026-09-01",
      yourRef: "BUSCH Pump P/A with details: LB 0265 A ZZB XX ZZ",
      subject:
        "BUSCH Liquid Ring Vacuum Pump – LB 0265 A Special MOC Replacement (Bare Shaft)",
      fromName: "Andre de Wet",
      fromTitle: "Business Development Manager",
      fromPhone: "+61 (0) 4 3874 2323",
      fromEmail: "andre.dewet@busch.com.au",
      fromOffice: "Busch Australia (East)",
    };
    s.origin.country = "United Kingdom";
    s.origin.currency = "GBP";
    s.origin.liveRate = 1.9318;
    s.origin.bufferedRate = 1.9318 * 1.15;
    s.origin.rateDate = "2026-09-01";
    s.origin.rateSource = "demo seed";
    s.defaults.marginPct = 0.3;
    s.defaults.fxBuffer = 0.15;
    s.defaults.freightPct = 0.08;
    s.defaults.boxingPct = 0.02;
    s.defaults.clearancePct = 0.03;
    s.letter.greetingName = "David";
    s.letter.introText =
      "Further to your above referenced request for quotation, I would like to thank you for the opportunity and confirm our budgetary pricing for a like-for-like replacement of the subject vacuum pump. As this is a highly specialised engineered unit, please review the Important Notes under Item 5 carefully before proceeding. Should you require any further assistance, please contact me.";
    s.letter.unitDetailsText =
      "Pump type (nameplate): LB0265A ZZB XX ZZ\nPump serial numbers (original): 6000011205/1\nCapacity: 260 m3/Hr\nRotational speed: 1450 Rpm\nPower rating: 7.5 kW\nOriginal sales order: 60005735 (Busch Norway)\nOriginal end user: Aker Solutions / Aker Kvaerner, Ichthys LNG project, WA";
    s.letter.selectionText =
      "Selected Vacuum pump model: LB 0265 A - Two Stage\nBasis: Like-for-like replacement of original supply\nMaterials of construction: All 22% Duplex. Norsok, Nace\nDrive arrangement: Bare shaft (no motor or base)\nConnections: 2\" 150lb (ANSI) inlet & outlet flanges, raised face\nOriginal API edition: API 1st Edition (see Important Notes)";
    s.letter.scopeSupplyText =
      "VACUUM PUMP — BUSCH MODEL LB 0265 A TWO-STAGE IN AN ALL 22% DUPLEX CONSTRUCTION TO NORSOK AND NACE REQUIREMENTS, SUPPLIED AS A BARE SHAFT UNIT (NO MOTOR, COUPLING OR BASE).";
    s.letter.scopeBullets =
      "End casings / port plates / impeller casings / impellers / shaft — Duplex 22%. Norsok, Nace\nFlowserve double external cartridge mechanical seals, Duplex process wetted parts\nPTFE pump gaskets. Inpro bearing isolators\n2\" 150lb (ANSI) inlet & outlet flanges raised face\nPump supplied unpainted, as per original specification\nFull factory testing, certification and data dossier";
    s.letter.importantNotes =
      "This is a budgetary offer based on the original project specifications, which are now aged and must be reconfirmed prior to order placement; pricing may change if revised specifications are presented. The original unit was API 1st Edition; this replacement is like-for-like and will NOT be API 2nd Edition certified. Stage payments apply as set out under Commercial.";
    s.letter.techRows =
      "Pumping Speed|M3/Hr|260\nRotational speed (50Hz)|Min-1|1450\nPower rating|kW|7.5\nStages|-|Two\nMaterials of construction|-|22% Duplex. Norsok, Nace\nMechanical seal|-|Flowserve double external cartridge\nNozzle suction / discharge|inch|2\" 150lb ANSI, raised face";
    s.letter.introExtra =
      "DOLPHIN LB units are two-stage liquid ring vacuum pumps based on our proven DOLPHIN technology. The unit offered here is a specialised engineered pump, originally designed and supplied via Busch Norway for the Ichthys LNG project in Western Australia. It is manufactured entirely in 22% Duplex material to Norsok and Nace requirements. This offer is for a like-for-like replacement of the original supply, as a bare shaft unit manufactured by Busch GVT Ltd (UK).";

    // Back-solve rough ExW so Option A ≈ sample ballpark with buffer 0.15 & default adders
    // Target sell ~595k at 30% margin → landed ~416.7k
    // buffered FX 1.9318*1.15≈2.2216; compound (1.02*1.08*1.03)≈1.134; ExW AUD≈367.5k; ExW GBP≈165.4k
    const sea = newImportItem();
    sea.description = "LB 0265 A bare shaft — Option A sea freight";
    sea.exworks = 165400;
    sea.flag = "include";
    sea.optionLabel = "OPTION A – BUDGET SEA FREIGHT PRICE";
    sea.freightPct = 0.08;
    sea.open = false;

    const air = newImportItem();
    air.description = "LB 0265 A bare shaft — Option B airfreight";
    air.exworks = 165400;
    air.flag = "option";
    air.optionLabel = "OPTION B – BUDGET AIRFREIGHT PRICE";
    air.freightPct = 0.095;
    air.freightAmt = 0;
    air.open = false;

    s.items = [sea, air];
    s.sections.drawing = true;
    s.images = [
      {
        id: uid(),
        src: "assets/demo-drawing1.jpg",
        caption: "LB 0265 A — general arrangement (demo)",
        size: "M",
        frame: "thin",
      },
    ];
    s.meta.name = "26NBQ142 Hydro demo";
    return s;
  }

  let state = blankState();
  let saveTimer = null;
  let activeTab = "setup";

  /* ---- Persist ---- */
  function queueSave() {
    const el = document.getElementById("saveStatus");
    if (el) {
      el.textContent = "…";
      el.classList.remove("ok");
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 400);
  }

  function persist() {
    state.meta.savedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const el = document.getElementById("saveStatus");
      if (el) {
        el.textContent = "Saved";
        el.classList.add("ok");
      }
      updateRefPill();
    } catch (e) {
      const el = document.getElementById("saveStatus");
      if (el) el.textContent = "Save err";
    }
  }

  function loadAutosave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.header) return false;
      state = Object.assign(blankState(), data);
      state.commercial = Object.assign(blankCommercial(), data.commercial || {});
      state.letter = Object.assign(blankLetter(), data.letter || {});
      state.sections = Object.assign(blankSections(), data.sections || {});
      state.defaults = Object.assign(blankState().defaults, data.defaults || {});
      state.origin = Object.assign(blankState().origin, data.origin || {});
      state.header = Object.assign(blankState().header, data.header || {});
      state.items = Array.isArray(data.items) ? data.items : [];
      state.images = Array.isArray(data.images) ? data.images : [];
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---- Origin helpers ---- */
  function setCountry(country) {
    const row = COUNTRY_MAP.find(function (c) {
      return c.country === country;
    });
    state.origin.country = country;
    if (row) state.origin.currency = row.currency;
    if (state.origin.currency === "AUD") {
      state.origin.liveRate = 1;
      state.origin.bufferedRate = 1;
      state.origin.rateSource = "local AUD";
      state.origin.rateDate = todayISO();
      state.origin.lastError = null;
      renderFxStrip();
      queueSave();
      refreshCostingCalcs();
      return;
    }
    fetchFx(state, true).then(function () {
      renderFxStrip();
      queueSave();
      refreshCostingCalcs();
      if (activeTab === "preview") renderPreview();
    });
  }

  /* ---- Render: Setup ---- */
  function fillCountrySelect() {
    const sel = document.getElementById("originCountry");
    if (!sel) return;
    sel.innerHTML = "";
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Select country…";
    sel.appendChild(blank);
    const favs = COUNTRY_MAP.filter(function (c) {
      return c.fav;
    });
    const rest = COUNTRY_MAP.filter(function (c) {
      return !c.fav;
    });
    function addGroup(label, list) {
      const og = document.createElement("optgroup");
      og.label = label;
      list.forEach(function (c) {
        const o = document.createElement("option");
        o.value = c.country;
        o.textContent = c.country + " (" + c.currency + ")";
        og.appendChild(o);
      });
      sel.appendChild(og);
    }
    addGroup("Favourites", favs);
    addGroup("Other", rest);
    sel.value = state.origin.country || "";
  }

  function bindSetup() {
    fillCountrySelect();
    const h = state.header;
    setVal("customer", h.customer);
    setVal("attn", h.attn);
    setVal("nbq", h.nbq);
    setVal("rev", h.rev);
    setVal("quoteDate", h.date);
    setVal("marginPct", (n(state.defaults.marginPct) * 100).toFixed(1));
    setVal("fxBuffer", n(state.defaults.fxBuffer).toFixed(2));
    setVal("email", h.email);
    setVal("phone", h.phone);
    setVal("yourRef", h.yourRef);
    setVal("subject", h.subject);
    setVal("fromName", h.fromName);
    setVal("fromTitle", h.fromTitle);
    setVal("fromPhone", h.fromPhone);
    setVal("fromEmail", h.fromEmail);
    setVal("fromOffice", h.fromOffice);
    setVal("boxingPct", (n(state.defaults.boxingPct) * 100).toFixed(1));
    setVal("freightPct", (n(state.defaults.freightPct) * 100).toFixed(1));
    setVal("clearancePct", (n(state.defaults.clearancePct) * 100).toFixed(1));
    setVal("dutyPct", (n(state.defaults.dutyPct) * 100).toFixed(1));
    setVal("labourRate", n(state.defaults.labourRate));
    setVal("commPayment", state.commercial.payment);
    setVal("commDelivery", state.commercial.delivery);
    setVal("commValidity", state.commercial.validity);
    setVal("commWarranty", state.commercial.warranty);
    setVal("commExcluded", state.commercial.excluded);
    setVal("commLeadSea", state.commercial.leadSea);
    setVal("commLeadAir", state.commercial.leadAir);
    setVal("letterTitle", state.letter.title);
    setVal("greetingName", state.letter.greetingName);
    setVal("introText", state.letter.introText);
    setVal("introExtra", state.letter.introExtra || "");
    setVal("unitDetailsText", state.letter.unitDetailsText);
    setVal("selectionText", state.letter.selectionText);
    setVal("scopeSupplyText", state.letter.scopeSupplyText);
    setVal("scopeBullets", state.letter.scopeBullets);
    setVal("importantNotes", state.letter.importantNotes);
    setVal("techRows", state.letter.techRows);
    setVal("manualRate", state.origin.manualRate != null ? state.origin.manualRate : "");
    renderFxStrip();
  }

  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v == null ? "" : v;
  }

  function renderFxStrip() {
    const el = document.getElementById("fxStrip");
    if (!el) return;
    const o = state.origin;
    const buf = nOr(state.defaults.fxBuffer, 0.15);
    let live = o.manualRate != null && o.manualRate !== "" ? n(o.manualRate) : n(o.liveRate);
    let buffered = o.currency === "AUD" ? 1 : live > 0 ? live * (1 + buf) : 0;
    o.bufferedRate = buffered;
    const cur = o.currency === "MANUAL" ? "?" : o.currency;
    el.innerHTML =
      '<div class="fx-row">' +
      '<div><div class="fx-k">Currency</div><div class="fx-v">' +
      esc(cur) +
      " → AUD</div></div>" +
      '<div><div class="fx-k">Live rate (AUD / 1 ' +
      esc(cur) +
      ')</div><div class="fx-v' +
      (live > 0 ? "" : " warn") +
      '">' +
      (live > 0 ? fmtRate(live) : "—") +
      "</div></div>" +
      '<div><div class="fx-k">Buffered (+' +
      (buf * 100).toFixed(0) +
      '%)</div><div class="fx-v">' +
      (buffered > 0 ? fmtRate(buffered) : "—") +
      "</div></div>" +
      '<div><div class="fx-k">Rate date / source</div><div class="fx-v" style="font-size:12px;font-weight:600">' +
      esc(o.rateDate || "—") +
      " · " +
      esc(o.rateSource || "—") +
      "</div></div>" +
      '<button type="button" class="refresh" id="fxRefresh">' +
      (o.fetching ? "Fetching…" : "Refresh FX") +
      "</button></div>" +
      (o.lastError
        ? '<div style="margin-top:8px;color:#fbbf24;font-size:12px">' + esc(o.lastError) + "</div>"
        : "") +
      '<div style="margin-top:6px;font-size:11px;color:var(--muted)">Internal only — never printed on the customer letter.</div>';
    const btn = document.getElementById("fxRefresh");
    if (btn)
      btn.onclick = function () {
        fetchFx(state, true).then(function () {
          renderFxStrip();
          queueSave();
          refreshCostingCalcs();
        });
      };
  }

  function readSetupFromDom() {
    const g = function (id) {
      const el = document.getElementById(id);
      return el ? el.value : "";
    };
    state.header.customer = g("customer");
    state.header.attn = g("attn");
    state.header.nbq = g("nbq");
    state.header.rev = g("rev");
    state.header.date = g("quoteDate");
    state.header.email = g("email");
    state.header.phone = g("phone");
    state.header.yourRef = g("yourRef");
    state.header.subject = g("subject");
    state.header.fromName = g("fromName");
    state.header.fromTitle = g("fromTitle");
    state.header.fromPhone = g("fromPhone");
    state.header.fromEmail = g("fromEmail");
    state.header.fromOffice = g("fromOffice");
    state.defaults.marginPct = n(g("marginPct")) / 100;
    state.defaults.fxBuffer = n(g("fxBuffer"));
    state.defaults.boxingPct = n(g("boxingPct")) / 100;
    state.defaults.freightPct = n(g("freightPct")) / 100;
    state.defaults.clearancePct = n(g("clearancePct")) / 100;
    state.defaults.dutyPct = n(g("dutyPct")) / 100;
    state.defaults.labourRate = n(g("labourRate"));
    state.commercial.payment = g("commPayment");
    state.commercial.delivery = g("commDelivery");
    state.commercial.validity = g("commValidity");
    state.commercial.warranty = g("commWarranty");
    state.commercial.excluded = g("commExcluded");
    state.commercial.leadSea = g("commLeadSea");
    state.commercial.leadAir = g("commLeadAir");
    state.letter.title = g("letterTitle");
    state.letter.greetingName = g("greetingName");
    state.letter.introText = g("introText");
    state.letter.introExtra = g("introExtra");
    state.letter.unitDetailsText = g("unitDetailsText");
    state.letter.selectionText = g("selectionText");
    state.letter.scopeSupplyText = g("scopeSupplyText");
    state.letter.scopeBullets = g("scopeBullets");
    state.letter.importantNotes = g("importantNotes");
    state.letter.techRows = g("techRows");
    const mr = g("manualRate");
    state.origin.manualRate = mr === "" ? null : n(mr);
    const buf = nOr(state.defaults.fxBuffer, 0.15);
    const live =
      state.origin.manualRate != null ? state.origin.manualRate : n(state.origin.liveRate);
    if (state.origin.currency === "AUD") state.origin.bufferedRate = 1;
    else if (live > 0) state.origin.bufferedRate = live * (1 + buf);
    updateRefPill();
  }

  /* ---- Render: Costing ---- */
  function renderCosting() {
    const root = document.getElementById("costList");
    const empty = document.getElementById("costEmpty");
    if (!root) return;
    if (!state.items.length) {
      root.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      renderTotalsBar();
      return;
    }
    if (empty) empty.classList.add("hidden");
    root.innerHTML = state.items
      .map(function (it) {
        return lineCardHtml(it);
      })
      .join("");
    root.querySelectorAll(".line-card").forEach(function (card) {
      const id = card.getAttribute("data-id");
      const item = state.items.find(function (x) {
        return x.id === id;
      });
      if (!item) return;
      card.querySelector(".line-head").onclick = function (e) {
        if (e.target.closest(".flag-row") || e.target.closest("button")) return;
        item.open = !item.open;
        card.classList.toggle("open", item.open);
        queueSave();
      };
      card.querySelectorAll(".flag-row button").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          item.flag = b.getAttribute("data-flag");
          queueSave();
          renderCosting();
        };
      });
      card.querySelectorAll("[data-field]").forEach(function (inp) {
        inp.onchange = inp.oninput = function () {
          const f = inp.getAttribute("data-field");
          let v = inp.value;
          if (inp.type === "number") v = v === "" ? null : n(v);
          if (inp.getAttribute("data-pct") === "1") v = v === null ? null : n(v) / 100;
          item[f] = v;
          refreshOneLine(card, item);
          renderTotalsBar();
          queueSave();
        };
      });
      const del = card.querySelector(".btn-del");
      if (del)
        del.onclick = function (e) {
          e.stopPropagation();
          if (!confirm("Remove this line?")) return;
          state.items = state.items.filter(function (x) {
            return x.id !== id;
          });
          queueSave();
          renderCosting();
        };
    });
    renderTotalsBar();
  }

  function pctField(val, def) {
    if (val === null || val === undefined || val === "") return "";
    return (n(val) * 100).toFixed(1);
  }

  function lineCardHtml(it) {
    const c = computeItem(it, state);
    const open = it.open ? " open" : "";
    const flagClass = "flag-" + it.flag;
    const badge =
      it.type === "import"
        ? '<span class="badge import">Import</span>'
        : '<span class="badge local">Local</span>';
    let body = "";
    if (it.type === "import") {
      body =
        '<div class="grid2" style="margin-top:10px">' +
        '<label class="fld"><span>Description</span><input class="yel" data-field="description" value="' +
        esc(it.description) +
        '"></label>' +
        '<label class="fld"><span>Option label (Preview)</span><input class="yel" data-field="optionLabel" value="' +
        esc(it.optionLabel || "") +
        '" placeholder="e.g. OPTION A – SEA FREIGHT"></label>' +
        '<label class="fld"><span>Qty</span><input class="yel" type="number" step="1" data-field="qty" value="' +
        esc(it.qty) +
        '"></label>' +
        '<label class="fld"><span>ExW (' +
        esc(state.origin.currency === "AUD" ? "AUD" : state.origin.currency) +
        ')</span><input class="yel" type="number" step="0.01" data-field="exworks" value="' +
        esc(it.exworks) +
        '"></label>' +
        '<label class="fld"><span>Discount multiplier</span><input class="yel" type="number" step="0.01" data-field="discountMultiplier" value="' +
        esc(it.discountMultiplier) +
        '"></label>' +
        '<label class="fld"><span>Margin % (blank = default)</span><input class="yel" type="number" step="0.1" data-field="marginPct" data-pct="1" value="' +
        esc(pctField(it.marginPct)) +
        '" placeholder="' +
        (state.defaults.marginPct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Boxing %</span><input class="yel" type="number" step="0.1" data-field="boxingPct" data-pct="1" value="' +
        esc(pctField(it.boxingPct)) +
        '" placeholder="' +
        (state.defaults.boxingPct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Freight %</span><input class="yel" type="number" step="0.1" data-field="freightPct" data-pct="1" value="' +
        esc(pctField(it.freightPct)) +
        '" placeholder="' +
        (state.defaults.freightPct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Clearance %</span><input class="yel" type="number" step="0.1" data-field="clearancePct" data-pct="1" value="' +
        esc(pctField(it.clearancePct)) +
        '" placeholder="' +
        (state.defaults.clearancePct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Duty %</span><input class="yel" type="number" step="0.1" data-field="dutyPct" data-pct="1" value="' +
        esc(pctField(it.dutyPct)) +
        '" placeholder="' +
        (state.defaults.dutyPct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Boxing $ AUD</span><input class="yel" type="number" step="0.01" data-field="boxingAmt" value="' +
        esc(it.boxingAmt) +
        '"></label>' +
        '<label class="fld"><span>Freight $ AUD</span><input class="yel" type="number" step="0.01" data-field="freightAmt" value="' +
        esc(it.freightAmt) +
        '"></label>' +
        '<label class="fld"><span>Clearance $ AUD</span><input class="yel" type="number" step="0.01" data-field="clearanceAmt" value="' +
        esc(it.clearanceAmt) +
        '"></label>' +
        '<label class="fld"><span>Duty $ AUD</span><input class="yel" type="number" step="0.01" data-field="dutyAmt" value="' +
        esc(it.dutyAmt) +
        '"></label>' +
        '<label class="fld"><span>Local parts $ AUD</span><input class="yel" type="number" step="0.01" data-field="localParts" value="' +
        esc(it.localParts) +
        '"></label>' +
        "</div>" +
        '<div class="calc-row staff-only">' +
        '<div class="c"><div class="k">ExW AUD (buffered FX)</div><div class="v calc-exw">' +
        fmtAUD(c.exworksAUD) +
        "</div></div>" +
        '<div class="c"><div class="k">Landed AUD</div><div class="v calc-landed">' +
        fmtAUD(c.landed) +
        "</div></div>" +
        '<div class="c"><div class="k">Unit sell AUD</div><div class="v calc-sell">' +
        fmtAUD(c.unitSell) +
        "</div></div>" +
        '<div class="c"><div class="k">Line total</div><div class="v calc-total">' +
        fmtAUD(c.lineTotal) +
        "</div></div></div>";
    } else {
      body =
        '<div class="grid2" style="margin-top:10px">' +
        '<label class="fld"><span>Description</span><input class="yel" data-field="description" value="' +
        esc(it.description) +
        '"></label>' +
        '<label class="fld"><span>Option label (Preview)</span><input class="yel" data-field="optionLabel" value="' +
        esc(it.optionLabel || "") +
        '"></label>' +
        '<label class="fld"><span>Qty</span><input class="yel" type="number" step="1" data-field="qty" value="' +
        esc(it.qty) +
        '"></label>' +
        '<label class="fld"><span>Labour hours</span><input class="yel" type="number" step="0.1" data-field="labourHours" value="' +
        esc(it.labourHours) +
        '"></label>' +
        '<label class="fld"><span>Labour rate (blank = default)</span><input class="yel" type="number" step="1" data-field="labourRate" value="' +
        esc(it.labourRate == null ? "" : it.labourRate) +
        '" placeholder="' +
        state.defaults.labourRate +
        '"></label>' +
        '<label class="fld"><span>Parts $</span><input class="yel" type="number" step="0.01" data-field="parts" value="' +
        esc(it.parts) +
        '"></label>' +
        '<label class="fld"><span>Subcontract $</span><input class="yel" type="number" step="0.01" data-field="subcontract" value="' +
        esc(it.subcontract) +
        '"></label>' +
        '<label class="fld"><span>Freight $</span><input class="yel" type="number" step="0.01" data-field="freight" value="' +
        esc(it.freight) +
        '"></label>' +
        '<label class="fld"><span>Other $</span><input class="yel" type="number" step="0.01" data-field="other" value="' +
        esc(it.other) +
        '"></label>' +
        '<label class="fld"><span>Margin %</span><input class="yel" type="number" step="0.1" data-field="marginPct" data-pct="1" value="' +
        esc(pctField(it.marginPct)) +
        '" placeholder="' +
        (state.defaults.marginPct * 100).toFixed(1) +
        '"></label>' +
        '<label class="fld"><span>Flat markup $</span><input class="yel" type="number" step="0.01" data-field="markupAmt" value="' +
        esc(it.markupAmt) +
        '"></label>' +
        "</div>" +
        '<div class="calc-row staff-only">' +
        '<div class="c"><div class="k">Unit cost AUD</div><div class="v calc-landed">' +
        fmtAUD(c.landed) +
        "</div></div>" +
        '<div class="c"><div class="k">Unit sell AUD</div><div class="v calc-sell">' +
        fmtAUD(c.unitSell) +
        "</div></div>" +
        '<div class="c"><div class="k">Line total</div><div class="v calc-total">' +
        fmtAUD(c.lineTotal) +
        "</div></div></div>";
    }
    return (
      '<div class="line-card ' +
      flagClass +
      open +
      '" data-id="' +
      esc(it.id) +
      '">' +
      '<div class="line-head"><span class="chev"></span>' +
      badge +
      '<span class="desc">' +
      esc(it.description || "(untitled)") +
      '</span><span class="sell">' +
      fmtAUD(c.lineTotal) +
      "</span></div>" +
      '<div class="line-body">' +
      '<div class="flag-row">' +
      '<button type="button" data-flag="include" class="' +
      (it.flag === "include" ? "on-include" : "") +
      '">Include</button>' +
      '<button type="button" data-flag="option" class="' +
      (it.flag === "option" ? "on-option" : "") +
      '">Option</button>' +
      '<button type="button" data-flag="exclude" class="' +
      (it.flag === "exclude" ? "on-exclude" : "") +
      '">Exclude</button></div>' +
      body +
      '<div class="line-actions"><button type="button" class="btn-del danger">Delete line</button></div>' +
      "</div></div>"
    );
  }

  function refreshOneLine(card, item) {
    const c = computeItem(item, state);
    const sell = card.querySelector(".line-head .sell");
    const desc = card.querySelector(".line-head .desc");
    if (sell) sell.textContent = fmtAUD(c.lineTotal);
    if (desc) desc.textContent = item.description || "(untitled)";
    const exw = card.querySelector(".calc-exw");
    const landed = card.querySelector(".calc-landed");
    const usell = card.querySelector(".calc-sell");
    const total = card.querySelector(".calc-total");
    if (exw && c.exworksAUD != null) exw.textContent = fmtAUD(c.exworksAUD);
    if (landed) landed.textContent = fmtAUD(c.landed);
    if (usell) usell.textContent = fmtAUD(c.unitSell);
    if (total) total.textContent = fmtAUD(c.lineTotal);
  }

  function refreshCostingCalcs() {
    if (activeTab === "costing") renderCosting();
    else renderTotalsBar();
  }

  function renderTotalsBar() {
    const bar = document.getElementById("totalsBar");
    if (!bar) return;
    const t = totals(state);
    const low = t.margin < 0.15;
    bar.innerHTML =
      '<div class="t"><div class="k">Includes sell</div><div class="v">' +
      fmtAUD(t.includeSell) +
      '</div></div>' +
      '<div class="t"><div class="k">Options sell</div><div class="v">' +
      fmtAUD(t.optionSell) +
      '</div></div>' +
      '<div class="t"><div class="k">Includes cost (staff)</div><div class="v">' +
      fmtAUD(t.includeCost) +
      '</div></div>' +
      '<div class="t gp' +
      (low ? " low" : "") +
      '"><div class="k">GP / margin (staff)</div><div class="v">' +
      fmtAUD(t.gp) +
      " · " +
      (t.margin * 100).toFixed(1) +
      "%</div></div>";
  }

  /* ---- Preview (HARD WALL: sell + letter only) ---- */
  function kvLines(text) {
    if (!text) return "";
    return text
      .split("\n")
      .filter(function (l) {
        return l.trim();
      })
      .map(function (l) {
        const parts = l.split(":");
        if (parts.length >= 2) {
          const k = parts.shift().trim();
          const v = parts.join(":").trim();
          return (
            "<tr><td>" +
            esc(k) +
            "</td><td>" +
            esc(v) +
            "</td></tr>"
          );
        }
        return "<tr><td colspan='2'>" + esc(l) + "</td></tr>";
      })
      .join("");
  }

  function techTable(text) {
    if (!text) return "";
    return text
      .split("\n")
      .filter(function (l) {
        return l.trim();
      })
      .map(function (l) {
        const p = l.split("|");
        if (p.length >= 3)
          return (
            "<tr><td>" +
            esc(p[0]) +
            "</td><td>" +
            esc(p[1]) +
            "</td><td>" +
            esc(p[2]) +
            "</td></tr>"
          );
        return "<tr><td colspan='3'>" + esc(l) + "</td></tr>";
      })
      .join("");
  }

  function bullets(text) {
    if (!text) return "";
    return (
      '<ul class="bullets">' +
      text
        .split("\n")
        .filter(function (l) {
          return l.trim();
        })
        .map(function (l) {
          return "<li>" + esc(l.trim()) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function printBlockReason() {
    const reasons = [];
    if (!state.header.customer || !state.header.customer.trim())
      reasons.push("Customer name is empty");
    const hasInclude = state.items.some(function (it) {
      return it.flag === "include";
    });
    if (!hasInclude) reasons.push("No Included lines (need at least one Include)");
    return reasons;
  }


  function sizeClass(sz) {
    const s = (sz || "M").toUpperCase();
    if (s === "S") return "img-s";
    if (s === "L") return "img-l";
    return "img-m";
  }
  function frameClass(fr) {
    const f = (fr || "none").toLowerCase();
    if (f === "thin") return "frame-thin";
    if (f === "double") return "frame-double";
    return "frame-none";
  }

  function renderImagesPanel() {
    const box = document.getElementById("imagesPanel");
    if (!box) return;
    if (!Array.isArray(state.images)) state.images = [];

    let html =
      "<h3>Images / drawings</h3>" +
      '<p class="hint">Optional. Tick <strong>6. Vacuum pump drawing</strong> below to print them. Untick = off the letter.</p>';

    if (!state.images.length) {
      html += '<p class="empty-hint">No images yet — add a drawing or photo.</p>';
    }

    state.images.forEach(function (img, idx) {
      const id = img.id || "img" + idx;
      html += '<div class="img-card" data-img-id="' + esc(id) + '">';
      html += '<div class="img-thumb-wrap">';
      if (img.src) {
        html +=
          '<img class="img-thumb" src="' +
          esc(img.src) +
          '" alt="">';
      } else {
        html += '<div class="img-thumb ph">No file</div>';
      }
      html += "</div>";
      html += '<div class="img-fields">';
      html +=
        '<label class="fld pick-btn"><span>Choose image</span>' +
        '<input type="file" accept="image/*" data-act="pick" data-id="' +
        esc(id) +
        '"></label>';
      html +=
        '<label class="fld"><span>Caption (optional)</span>' +
        '<input type="text" data-act="caption" data-id="' +
        esc(id) +
        '" value="' +
        esc(img.caption || "") +
        '" placeholder="e.g. GA drawing"></label>';
      html += '<div class="seg-row"><span class="seg-lab">Size</span><div class="seg" data-act="size" data-id="' +
        esc(id) +
        '">';
      ["S", "M", "L"].forEach(function (sz) {
        html +=
          '<button type="button" data-val="' +
          sz +
          '"' +
          ((img.size || "M").toUpperCase() === sz ? ' class="on"' : "") +
          ">" +
          sz +
          "</button>";
      });
      html += "</div></div>";
      html +=
        '<div class="seg-row"><span class="seg-lab">Frame</span><div class="seg" data-act="frame" data-id="' +
        esc(id) +
        '">';
      [
        ["none", "None"],
        ["thin", "Thin"],
        ["double", "Double"],
      ].forEach(function (pair) {
        html +=
          '<button type="button" data-val="' +
          pair[0] +
          '"' +
          ((img.frame || "thin") === pair[0] ? ' class="on"' : "") +
          ">" +
          pair[1] +
          "</button>";
      });
      html += "</div></div>";
      html +=
        '<button type="button" class="img-remove" data-act="remove" data-id="' +
        esc(id) +
        '">Remove</button>';
      html += "</div></div>";
    });

    html +=
      '<button type="button" class="img-add" id="btnAddImage">+ Add image</button>';
    box.innerHTML = html;

    const addBtn = document.getElementById("btnAddImage");
    if (addBtn) {
      addBtn.onclick = function () {
        state.images.push(newImageItem());
        queueSave();
        renderImagesPanel();
      };
    }

    box.querySelectorAll('input[data-act="pick"]').forEach(function (inp) {
      inp.onchange = function () {
        const id = inp.getAttribute("data-id");
        const f = inp.files && inp.files[0];
        if (!f) return;
        compressImageFile(f)
          .then(function (dataUrl) {
            const row = state.images.find(function (x) {
              return x.id === id;
            });
            if (row) {
              row.src = dataUrl;
              queueSave();
              renderImagesPanel();
              if (activeTab === "preview") renderPreview();
            }
          })
          .catch(function (e) {
            alert("Could not use image: " + (e.message || e));
          });
      };
    });

    box.querySelectorAll('input[data-act="caption"]').forEach(function (inp) {
      inp.oninput = function () {
        const id = inp.getAttribute("data-id");
        const row = state.images.find(function (x) {
          return x.id === id;
        });
        if (row) {
          row.caption = inp.value;
          queueSave();
        }
      };
      inp.onchange = function () {
        if (activeTab === "preview") renderPreview();
      };
    });

    box.querySelectorAll(".seg").forEach(function (seg) {
      seg.querySelectorAll("button").forEach(function (btn) {
        btn.onclick = function () {
          const id = seg.getAttribute("data-id");
          const act = seg.getAttribute("data-act");
          const val = btn.getAttribute("data-val");
          const row = state.images.find(function (x) {
            return x.id === id;
          });
          if (!row) return;
          if (act === "size") row.size = val;
          if (act === "frame") row.frame = val;
          queueSave();
          renderImagesPanel();
          if (activeTab === "preview") renderPreview();
        };
      });
    });

    box.querySelectorAll('[data-act="remove"]').forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.getAttribute("data-id");
        state.images = state.images.filter(function (x) {
          return x.id !== id;
        });
        queueSave();
        renderImagesPanel();
        if (activeTab === "preview") renderPreview();
      };
    });
  }

  function renderSectionTicks() {
    const box = document.getElementById("sectionTicks");
    if (!box) return;
    const labels = [
      ["toc", "1. Table of contents"],
      ["intro", "2. Introduction"],
      ["unitDetails", "3. Unit details and background"],
      ["selection", "4. Busch replacement selection"],
      ["scope", "5. Scope of work and services (prices)"],
      ["drawing", "6. Vacuum pump drawing"],
      ["techData", "7. Technical data sheet"],
      ["commercial", "8. Commercial"],
      ["terms", "9. Terms and conditions"],
    ];
    box.innerHTML =
      "<h3>Letter sections (tick to include)</h3>" +
      labels
        .map(function (pair) {
          const on = state.sections[pair[0]] !== false;
          return (
            '<label><input type="checkbox" data-sec="' +
            pair[0] +
            '"' +
            (on ? " checked" : "") +
            "> " +
            esc(pair[1]) +
            "</label>"
          );
        })
        .join("");
    box.querySelectorAll("input").forEach(function (inp) {
      inp.onchange = function () {
        state.sections[inp.getAttribute("data-sec")] = inp.checked;
        queueSave();
        renderPreview();
      };
    });
  }

  function renderPreview() {
    readSetupFromDom();
    renderImagesPanel();
    renderSectionTicks();
    const reasons = printBlockReason();
    const msg = document.getElementById("printBlockMsg");
    const printBtn = document.getElementById("btnPrint");
    if (msg) {
      if (reasons.length) {
        msg.classList.add("show");
        msg.textContent = "Print blocked: " + reasons.join(" · ");
      } else {
        msg.classList.remove("show");
        msg.textContent = "";
      }
    }
    if (printBtn) printBtn.disabled = reasons.length > 0;

    const h = state.header;
    const L = state.letter;
    const sec = state.sections;
    const paper = document.getElementById("paper");
    if (!paper) return;

    // Customer-facing sell lines ONLY — no cost/landed/margin/FX buffer
    const includeLines = [];
    const optionLines = [];
    state.items.forEach(function (it) {
      if (it.flag === "exclude") return;
      const c = computeItem(it, state);
      const row = {
        label: it.optionLabel || it.description || "Item",
        desc: it.description,
        sell: c.lineTotal,
        flag: it.flag,
      };
      if (it.flag === "include") includeLines.push(row);
      else if (it.flag === "option") optionLines.push(row);
    });

    function hdrCell(lab, val) {
      return (
        '<div class="hdr-cell"><span class="lab">' +
        esc(lab) +
        '</span><span class="colon">:</span><span class="val">' +
        val +
        "</span></div>"
      );
    }
    function subjLine(lab, val) {
      return (
        '<div class="subj-line"><span class="lab">' +
        esc(lab) +
        '</span><span class="colon">:</span><span class="val">' +
        esc(val) +
        "</span></div>"
      );
    }

    const buschRef =
      h.nbq + (h.rev !== "" && h.rev != null ? " Rev." + h.rev : "");
    const emailHtml = h.email
      ? '<a class="mail" href="mailto:' + esc(h.email) + '">' + esc(h.email) + "</a>"
      : "";

    let html = "";
    html += '<header class="letterhead">';
    html +=
      '<div class="lh-brand"><img class="lh-logos" src="assets/letterhead-logos.png" alt="Busch Group — Busch Vacuum Solutions &amp; Pfeiffer Vacuum"></div>';
    html += '<div class="lh-rule" aria-hidden="true"></div>';
    html += "</header>";
    html += L.title ? '<div class="letter-title">' + esc(L.title) + "</div>" : '';

    html += '<div class="hdr-block">';
    html += '<div class="hdr-grid">';
    html += hdrCell("ATTENTION", esc(h.attn));
    html += hdrCell("EMAIL", emailHtml);
    html += hdrCell("COMPANY", esc(h.customer));
    html += hdrCell("PHONE", esc(h.phone));
    html += hdrCell("FROM", esc(h.fromName));
    html += hdrCell("DATE", esc(formatLongDate(h.date)));
    html += "</div></div>";

    html += '<div class="subj-block">';
    html += subjLine("SUBJECT", h.subject);
    html += subjLine("BUSCH REF", buschRef);
    html += subjLine("YOUR REF", h.yourRef);
    html += "</div>";

    const greet = L.greetingName ? "Hi " + L.greetingName : "Hi";
    html += '<div class="greeting">' + esc(greet) + "</div>";
    html += '<p class="intro">' + esc(L.introText) + "</p>";

    const tocItems = [];
    if (sec.intro !== false) tocItems.push(["Item 2", "Introduction"]);
    if (sec.unitDetails !== false) tocItems.push(["Item 3", "Unit Details and Background"]);
    if (sec.selection !== false) tocItems.push(["Item 4", "Busch Vacuum pump Selection"]);
    if (sec.scope !== false) tocItems.push(["Item 5", "Scope of Work and Services"]);
    if (sec.drawing) tocItems.push(["Item 6", "Vacuum pump drawing"]);
    if (sec.techData !== false) tocItems.push(["Item 7", "Technical Data Sheet"]);
    if (sec.commercial !== false) tocItems.push(["Item 8", "Commercial"]);
    if (sec.terms !== false) tocItems.push(["Item 9", "Terms and Conditions"]);

    if (sec.toc !== false) {
      html += '<div class="sec"><div class="sec-h">1. TABLE OF CONTENTS</div>';
      html +=
        '<ul class="toc-list">' +
        tocItems
          .map(function (t) {
            return (
              '<li><span class="item">' +
              esc(t[0]) +
              '</span><span class="dash">-</span><span>' +
              esc(t[1]) +
              "</span></li>"
            );
          })
          .join("") +
        "</ul></div>";
    }

    if (sec.intro !== false) {
      html += '<div class="sec"><div class="sec-h">2. INTRODUCTION</div>';
      html += "<p>" + esc(L.introExtra || L.introText) + "</p></div>";
    }

    if (sec.unitDetails !== false) {
      html +=
        '<div class="sec"><div class="sec-h">3. UNIT DETAILS AND BACKGROUND</div>';
      html +=
        '<div class="scope-title">DATA (FROM NAMEPLATE, RFQ AND ORIGINAL SUPPLY RECORDS):</div>';
      html += '<table class="data-table">' + kvLines(L.unitDetailsText) + "</table></div>";
    }

    if (sec.selection !== false) {
      html += '<div class="sec"><div class="sec-h">4. BUSCH REPLACEMENT SELECTION</div>';
      html += '<table class="data-table">' + kvLines(L.selectionText) + "</table></div>";
    }

    if (sec.scope !== false) {
      html += '<div class="sec"><div class="sec-h">5. SCOPE OF WORK AND SERVICES</div>';
      html +=
        '<div class="scope-title">5.1 SCOPE OF SUPPLY</div>';
      html += "<p>" + esc(L.scopeSupplyText) + "</p>";
      html += bullets(L.scopeBullets);

      function optRow(row) {
        const lab = String(row.label || "").toUpperCase();
        return (
          '<div class="opt-row"><span class="opt-lab">' +
          esc(lab) +
          '</span><span class="price">' +
          fmtAUD(row.sell) +
          " + GST</span></div>"
        );
      }
      includeLines.forEach(function (row) {
        html += optRow(row);
      });
      optionLines.forEach(function (row) {
        html += optRow(row);
      });

      html +=
        '<p class="nett">(NETT PER UNIT, BARE SHAFT, EX OUR CANNING VALE WA PREMISES)</p>';
      html +=
        '<p class="note">* Budgetary price only, subject to confirmation of technical specifications. See Important Notes.</p>';

      html +=
        '<div class="scope-title">5.2 FACTORY TESTING AND CERTIFICATION — INCLUDED</div>';
      html += "<p>" + esc(L.testingText) + "</p>";
      html += '<p class="note">PRICE — INCLUDED IN ITEM 5.1</p>';

      html +=
        '<div class="scope-title">5.4 IMPORTANT NOTES (PLEASE READ BEFORE ORDERING)</div>';
      html += "<p>" + esc(L.importantNotes) + "</p></div>";
    }

    if (sec.drawing) {
      html += '<div class="sec"><div class="sec-h">6. DRAWING</div>';
      const imgs = Array.isArray(state.images)
        ? state.images.filter(function (im) {
            return im && im.src;
          })
        : [];
      if (!imgs.length) {
        html +=
          '<div class="drawing-ph">No drawings attached — add images in the Images panel (staff), then they appear here when this section is ticked.</div>';
      } else {
        html += '<div class="drawing-list">';
        imgs.forEach(function (im) {
          html +=
            '<figure class="drawing-fig ' +
            sizeClass(im.size) +
            " " +
            frameClass(im.frame) +
            '">';
          html +=
            '<img src="' +
            esc(im.src) +
            '" alt="' +
            esc(im.caption || "Drawing") +
            '">';
          if (im.caption && String(im.caption).trim()) {
            html += "<figcaption>" + esc(im.caption) + "</figcaption>";
          }
          html += "</figure>";
        });
        html += "</div>";
      }
      html += "</div>";
    }

    if (sec.techData !== false) {
      html +=
        '<div class="sec"><div class="sec-h">7. VACUUM PUMP TECHNICAL DATA</div>';
      html +=
        '<table class="data-table"><thead><tr><td></td><td></td><td></td></tr></thead><tbody>' +
        techTable(L.techRows) +
        "</tbody></table></div>";
    }

    if (sec.commercial !== false) {
      html += '<div class="sec"><div class="sec-h">8. COMMERCIAL</div>';
      html += '<table class="comm-table">';
      // Commercial FX wording — live sell-side rate only, never buffer
      const live =
        state.origin.manualRate != null && state.origin.manualRate !== ""
          ? n(state.origin.manualRate)
          : n(state.origin.liveRate);
      const cur = state.origin.currency;
      let fxWording = "Not applicable (AUD supply).";
      if (cur && cur !== "AUD" && cur !== "MANUAL" && live > 0) {
        fxWording =
          "The rate of exchange at the time of sending this offer was " +
          cur +
          " 1.00 = AU$ " +
          fmtRate(live) +
          ". Should this rate change at the time of invoice, any change will be for your account/benefit.";
      }
      const rows = [
        ["Exchange rate", fxWording],
        ["Excluded in offer", state.commercial.excluded],
        ["Special notice", state.commercial.specialNotice],
        ["Paint", state.commercial.paint],
        ["Payment", state.commercial.payment],
        ["Option A – Sea Freight", state.commercial.leadSea],
        ["Option B – Airfreight", state.commercial.leadAir],
        ["Delivery", state.commercial.delivery],
        ["Validity", state.commercial.validity],
        ["Warranty", state.commercial.warranty],
        ["General", state.commercial.general],
      ];
      rows.forEach(function (r) {
        html +=
          "<tr><td>" +
          esc(r[0]) +
          "</td><td>" +
          esc(r[1]) +
          "</td></tr>";
      });
      html += "</table></div>";
    }

    if (sec.terms !== false) {
      html +=
        '<div class="sec"><div class="sec-h">9. TERMS AND CONDITIONS</div><div class="tcs">';
      html += "<p>" + esc(L.termsSummary) + "</p>";
      html +=
        "<p>Full BUSCH ANZ PTY. LTD. Standard Terms and Conditions of Sale are available on request and form part of this offer.</p>";
      html += "</div></div>";
    }

    html += '<div class="sig"><div>Best regards:</div>';
    html += '<div class="name">' + esc(h.fromName) + "</div>";
    html += "<div>(" + esc(h.fromTitle) + ")</div>";
    html += "<div>" + esc(h.fromOffice) + "</div>";
    html += "<div>Mob: " + esc(h.fromPhone) + "</div>";
    html += "<div>" + esc(h.fromEmail) + "</div></div>";

    html += '<footer class="stationery">';
    html += '<div class="st-rule" aria-hidden="true"></div>';
    html +=
      '<div class="st-contact"><strong>BUSCH ANZ Pty Ltd</strong> | 30 Lakeside Drive | Broadmeadows, VIC 3047 | P +61 (0) 3 93 55 06 00 | <a href="mailto:sales@busch.com.au">sales@busch.com.au</a> | <a href="https://www.buschvacuum.com" target="_blank" rel="noopener">www.buschvacuum.com</a></div>';
    html += '<div class="st-ids">';
    html +=
      '<div class="st-tax">UST-ID DE264058499<br>ABN 38 006 402 964</div>';
    html +=
      '<div class="st-bank">Commonwealth Bank of Australia (CBA) | BSB 063-893 | Account No. 10046328 | SWIFT: CTBAAU2S<br>National Australian Bank (NAB) | BSB 083-363 | Account No. 155822068 | SWIFT: NATAAU3303M</div>';
    html += "</div>";
    html +=
      '<div class="st-countries">Argentina, Australia, Austria, Belgium, Brazil, Canada, Chile, China, Colombia, Czech Republic, Denmark, Finland, France, Germany, Hungary, India, Ireland, Israel, Italy, Japan, Korea, Malaysia, Mexico, Netherlands, New Zealand, Norway, Peru, Poland, Portugal, Russia, Singapore, South Africa, Spain, Sweden, Switzerland, Taiwan, Thailand, Turkey, United Arab Emirates, United Kingdom, United States of America</div>';
    html += '<div class="page-hint">Page <span class="pg-cur">1</span> of <span class="pg-tot">—</span></div>';
    html += "</footer>";

    paper.innerHTML = html;

    // Hard-wall self-check: ensure forbidden tokens not in Preview DOM
    const forbidden = /\b(landed|margin\s*%|buffered|fx buffer|raw fx|exw aud|line cost|gp\s*\/)\b/i;
    const probe = paper.innerText || "";
    if (forbidden.test(probe)) {
      console.warn("Hard-wall warning: suspicious staff term in Preview text");
    }
  }

  /* ---- Tabs / chrome ---- */
  function updateRefPill() {
    const el = document.getElementById("refPill");
    if (!el) return;
    const ref =
      (state.header.nbq || "No NBQ") +
      (state.header.rev !== "" && state.header.rev != null ? " Rev." + state.header.rev : "");
    el.textContent = ref + (state.header.customer ? " · " + state.header.customer : "");
  }

  function showTab(name) {
    activeTab = name;
    document.querySelectorAll(".panel").forEach(function (p) {
      p.classList.toggle("active", p.id === "panel-" + name);
    });
    document.querySelectorAll("#tabs button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === name);
    });
    if (name === "setup") {
      bindSetup();
    } else if (name === "costing") {
      readSetupFromDom();
      renderCosting();
    } else if (name === "preview") {
      renderPreview();
    }
  }

  function exportJSON() {
    readSetupFromDom();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download =
      (state.header.nbq || "quote") +
      (state.header.rev != null && state.header.rev !== "" ? "-Rev" + state.header.rev : "") +
      ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !data.header) throw new Error("Invalid quote file");
        state = Object.assign(blankState(), data);
        state.commercial = Object.assign(blankCommercial(), data.commercial || {});
        state.letter = Object.assign(blankLetter(), data.letter || {});
        state.sections = Object.assign(blankSections(), data.sections || {});
        state.defaults = Object.assign(blankState().defaults, data.defaults || {});
        state.origin = Object.assign(blankState().origin, data.origin || {});
        state.header = Object.assign(blankState().header, data.header || {});
        state.items = Array.isArray(data.items) ? data.items : [];
        state.images = Array.isArray(data.images) ? data.images : [];
        persist();
        bindSetup();
        updateRefPill();
        showTab(activeTab);
        alert("Quote opened.");
      } catch (e) {
        alert("Could not open file: " + e.message);
      }
    };
    reader.readAsText(file);
  }

    function newQuote() {
    if (!confirm("Start a new blank quote? This clears the current browser draft."))
      return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = blankState();
    persist();
    bindSetup();
    updateRefPill();
    showTab("setup");
  }

  function loadDemo() {
    // Layout test only — never runs on first open
    if (!confirm("Load Hydro / LB 0265 A demo seed? This replaces the current quote in the browser."))
      return;
    state = seedDemo();
    persist();
    bindSetup();
    updateRefPill();
    fetchFx(state, false).then(function () {
      // keep demo rate if fetch fails; if fetch ok overwrite with live
      renderFxStrip();
      queueSave();
    });
    showTab("preview");
  }

  /* ---- Wire DOM ---- */
  function wire() {
    document.querySelectorAll("#tabs button").forEach(function (b) {
      b.onclick = function () {
        showTab(b.getAttribute("data-tab"));
      };
    });

    const setupPanel = document.getElementById("panel-setup");
    if (setupPanel) {
      setupPanel.addEventListener("change", function (e) {
        if (e.target.id === "originCountry") {
          setCountry(e.target.value);
          return;
        }
        readSetupFromDom();
        renderFxStrip();
        queueSave();
      });
      setupPanel.addEventListener("input", function (e) {
        if (e.target.id === "originCountry") return;
        readSetupFromDom();
        if (e.target.id === "fxBuffer" || e.target.id === "manualRate") renderFxStrip();
        queueSave();
      });
    }

    document.getElementById("btnAddImport").onclick = function () {
      const it = newImportItem();
      it.description = "New import line";
      state.items.push(it);
      queueSave();
      renderCosting();
    };
    document.getElementById("btnAddLocal").onclick = function () {
      const it = newLocalItem();
      it.description = "New local / labour line";
      state.items.push(it);
      queueSave();
      renderCosting();
    };

    document.getElementById("btnSave").onclick = exportJSON;
    document.getElementById("btnOpen").onclick = function () {
      document.getElementById("fileOpen").click();
    };
    document.getElementById("fileOpen").onchange = function (e) {
      const f = e.target.files && e.target.files[0];
      if (f) importJSON(f);
      e.target.value = "";
    };
    
    const btnInsComm = document.getElementById("btnInsertCommercial");
    if (btnInsComm) {
      btnInsComm.onclick = function () {
        if (!confirm("Insert standard commercial text into empty/overwrite commercial fields?")) return;
        state.commercial = standardCommercial();
        bindSetup();
        queueSave();
      };
    }

    document.getElementById("btnNew").onclick = newQuote;
    document.getElementById("btnDemo").onclick = loadDemo;
    document.getElementById("btnPrint").onclick = function () {
      if (printBlockReason().length) return;
      window.print();
    };

    // First load: blank quote only. Demo is deliberate (btnDemo) — never auto-seed 26NBQ142 data.
    const had = loadAutosave();
    if (!had) {
      state = blankState();
      persist();
    }
    bindSetup();
    updateRefPill();
    showTab("setup");
    if (state.origin.currency !== "AUD" && state.origin.currency !== "MANUAL") {
      fetchFx(state, false).then(function () {
        renderFxStrip();
        queueSave();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
