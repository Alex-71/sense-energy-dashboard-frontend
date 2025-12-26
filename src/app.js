/* global Chart */
(() => {
  "use strict";

  // =========================
  // Config
  // =========================
  const CFG = window.SENSE_DASH_CONFIG || {};
  const UI = CFG.ui || {};

  const AUTH_DOMAIN = (CFG.domain || "").replace(/\/$/, "");
  const CLIENT_ID = CFG.clientId || "";
  const API_URL = CFG.apiUrl || "";
  const SCOPE = CFG.scope || "openid email profile";
  const DEFAULT_LIMIT = Number(CFG.defaultLimit || 96);

  // Presets / UX
  const POINTS_PER_HOUR = Number(UI.pointsPerHour || 12);
  const PRESETS = Array.isArray(UI.presets) ? UI.presets : [];
  const FILTER_ZERO_ROWS = UI.filterZeroRows !== false; // default true
  const AUTO_REFRESH = UI.autoRefresh === true;
  const REFRESH_EVERY_SECONDS = Number(UI.refreshEverySeconds || 60);

  // Chart tooltip config
  const CHART_CFG = UI.chart || {};
  const TOOLTIP_MODE = CHART_CFG.tooltipMode || "index";
  const TOOLTIP_INTERSECT = CHART_CFG.intersect === true ? true : false;
  const SHOW_POINTS_ON_HOVER = CHART_CFG.showPointsOnHover !== false;

  // =========================
  // Storage keys
  // =========================
  const K_ACCESS = "sense_access_token";
  const K_ID = "sense_id_token";
  const K_EXP = "sense_token_expires_at";
  const K_VERIFIER = "sense_pkce_verifier";
  const K_STATE = "sense_oauth_state";

  // =========================
  // DOM helpers
  // =========================
  const el = (id) => document.getElementById(id);

  const authModal = el("authModal");
  const authHint = el("authHint");

  const tzNote = el("tzNote");
  const statusText = el("statusText");
  const apiNote = el("apiNote");

  const btnRefresh = el("btnRefresh");
  const btnLogout = el("btnLogout");
  const btnReauth = el("btnReauth");
  const btnCloseAuth = el("btnCloseAuth");

  // ✅ Opción A
  const rangeControls = el("rangeControls");
  const rangeMeta = el("rangeMeta");

  const kpiPowerNow = el("kpiPowerNow");
  const kpiPowerNowFoot = el("kpiPowerNowFoot");
  const kpiPowerAvg = el("kpiPowerAvg");
  const kpiPowerAvgFoot = el("kpiPowerAvgFoot");
  const kpiPowerMax = el("kpiPowerMax");
  const kpiPowerMaxFoot = el("kpiPowerMaxFoot");
  const kpiKwhToday = el("kpiKwhToday");
  const kpiDelta = el("kpiDelta");
  const kpiAvgDelta = el("kpiAvgDelta");

// Trends (dentro de cada KPI)
const trendPowerNow = el("trendPowerNow");
const trendPowerAvg = el("trendPowerAvg");
const trendPowerMax = el("trendPowerMax");
const trendKwhToday = el("trendKwhToday");


  const tableBody = document.querySelector("#dataTable tbody");

  // =========================
  // Runtime state
  // =========================
  let currentLimit = DEFAULT_LIMIT;
  let activePresetId = null;
  let refreshTimer = null;

  // =========================
  // Guards
  // =========================
  function guardConfig() {
    if (!AUTH_DOMAIN || !CLIENT_ID || CLIENT_ID.includes("REEMPLAZA")) {
      showAuthModal("Falta configurar Cognito (domain/clientId). Revisa config.js.");
      return false;
    }
    if (!API_URL) {
      showAuthModal("Falta configurar apiUrl en config.js.");
      return false;
    }
    return true;
  }

  // =========================
  // Time helpers
  // =========================
  function nowTzName() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
    } catch {
      return "local";
    }
  }

  function fmtLocal(ts) {
    const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts ?? "—");
    return d.toLocaleString(undefined, { hour12: true });
  }

  function fmtTimeHHMM(ts) {
    const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  function setStatus(msg) {
    if (statusText) statusText.textContent = msg;
  }

  // =========================
  // Modal
  // =========================
  function showAuthModal(message) {
    if (!authModal) return;
    authModal.hidden = false;
    if (authHint) authHint.textContent = message || "";
  }

  function hideAuthModal() {
    if (!authModal) return;
    authModal.hidden = true;
    if (authHint) authHint.textContent = "";
  }

  // =========================
  // Auth storage
  // =========================
  function clearAuth() {
    localStorage.removeItem(K_ACCESS);
    localStorage.removeItem(K_ID);
    localStorage.removeItem(K_EXP);
    sessionStorage.removeItem(K_VERIFIER);
    sessionStorage.removeItem(K_STATE);
  }

  function getExpiryMs() {
    const v = localStorage.getItem(K_EXP);
    return v ? Number(v) : 0;
  }

  function hasValidToken() {
    const t = localStorage.getItem(K_ACCESS);
    const exp = getExpiryMs();
    return !!t && Number.isFinite(exp) && exp > Date.now() + 15_000; // buffer 15s
  }

  // =========================
  // PKCE helpers
  // =========================
  function base64url(bytes) {
    const bin = String.fromCharCode(...new Uint8Array(bytes));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function randomString(len = 64) {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return base64url(arr);
  }

  async function sha256(str) {
    const data = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", data);
  }

  // =========================
  // OAuth2 URLs
  // =========================
  function ensureTrailingSlash(u) {
  return u.endsWith("/") ? u : u + "/";
}

function getRedirectUri() {
  // Respeta redirectUri del config si existe
  if (CFG.redirectUri) return ensureTrailingSlash(String(CFG.redirectUri));

  // Auto-detect según path (Opción A: root vs /qa/)
  const path = window.location.pathname || "/";
  const basePath = path.startsWith("/qa") ? "/qa/" : "/";

  return ensureTrailingSlash(window.location.origin + basePath);
}

function clearUrlArtifacts() {
    // ✅ NO salir de /releases/<id>/...
    const p = window.location.pathname || "/";
    history.replaceState({}, "", p);
  }

  async function buildAuthorizeUrl() {
    const redirectUri = getRedirectUri();

    const verifier = randomString(64);
    sessionStorage.setItem(K_VERIFIER, verifier);

    const challenge = base64url(await sha256(verifier));

    const state = randomString(16);
    sessionStorage.setItem(K_STATE, state);

    const url =
      `${AUTH_DOMAIN}/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&state=${encodeURIComponent(state)}` +
      `&code_challenge=${encodeURIComponent(challenge)}` +
      `&code_challenge_method=S256`;

    return url;
  }

  async function login() {
    if (!guardConfig()) return;
    const url = await buildAuthorizeUrl();
    window.location.href = url;
  }

  async function exchangeCodeForToken(code) {
    const verifier = sessionStorage.getItem(K_VERIFIER);
    if (!verifier) throw new Error("Falta code_verifier (PKCE). Limpia sesión y reintenta.");

    const redirectUri = getRedirectUri();

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    });

    const res = await fetch(`${AUTH_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Token exchange falló (${res.status}). ${txt}`);
    }

    const data = await res.json();
    const expiresIn = Number(data.expires_in || 3600);

    localStorage.setItem(K_ACCESS, data.access_token);
    if (data.id_token) localStorage.setItem(K_ID, data.id_token);
    localStorage.setItem(K_EXP, String(Date.now() + expiresIn * 1000));

    sessionStorage.removeItem(K_VERIFIER);
  }

  function parseAuthCallback() {
    const fromQuery = new URLSearchParams(window.location.search);
    const fromHash = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));

    const code = fromQuery.get("code") || fromHash.get("code");
    const error = fromQuery.get("error") || fromHash.get("error");
    const errorDesc = fromQuery.get("error_description") || fromHash.get("error_description");
    const returnedState = fromQuery.get("state") || fromHash.get("state");

    if (error) {
      const msg =
        `Cognito devolvió error: ${error}` +
        (errorDesc ? " — " + decodeURIComponent(errorDesc) : "");
      clearUrlArtifacts();
      return { handled: true, success: false, message: msg };
    }

    if (!code) return { handled: false };

    const expectedState = sessionStorage.getItem(K_STATE);
    if (expectedState && returnedState && expectedState !== returnedState) {
      clearUrlArtifacts();
      return {
        handled: true,
        success: false,
        message: "OAuth state mismatch. Intenta reautenticar (posible callback antiguo)."
      };
    }

    sessionStorage.removeItem(K_STATE);
    clearUrlArtifacts();
    return { handled: true, success: true, code };
  }

  function buildLogoutUrl() {
    const logoutUri = getRedirectUri();
    return (
      `${AUTH_DOMAIN}/logout` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&logout_uri=${encodeURIComponent(logoutUri)}`
    );
  }

  function doLogout() {
    clearAuth();
    window.location.href = buildLogoutUrl();
  }

  // =========================
  // API
  // =========================
  // ✅ FIX: función única, sin duplicados debajo
  async function fetchData(limit) {
  const token = localStorage.getItem(K_ACCESS);
  const url = `${API_URL}?limit=${encodeURIComponent(String(limit))}`;

  if (apiNote) apiNote.textContent = `GET ${url}`;

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  if (res.status === 401) {
    clearAuth();
    throw new Error("401 Unauthorized: token expirado o inválido");
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error API (${res.status}): ${txt}`);
  }

  return res.json();
}



  // =========================
  // Normalize data
  // =========================
  function normalizeRows(payload) {
    const arr = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    const rows = arr.map((r) => {
      const ts = r.ts ?? r.timestamp ?? r.time ?? r.createdAt ?? r.datetime ?? r.date ?? null;

      const power = Number(r.watts ?? r.power ?? r.power_w ?? r.active_power ?? r.value ?? NaN);
      const kwhDay = Number(r.kwh_day ?? r.kwhDay ?? r.energy_day ?? r.kwh ?? r.daily_kwh ?? NaN);

      const devicesRaw =
        r.devices ?? r.device_list ?? r.deviceNames ?? r.devices_on ?? r.appliances ?? "";
      let devices = [];
      if (Array.isArray(devicesRaw)) devices = devicesRaw;
      else if (typeof devicesRaw === "string") {
        devices = devicesRaw.split(",").map((s) => s.trim()).filter(Boolean);
      }

      let tsNorm = ts;
      if (typeof ts === "number" && ts < 1e12) tsNorm = ts * 1000;

      return {
        ts: tsNorm,
        powerW: Number.isFinite(power) ? power : null,
        kwhDay: Number.isFinite(kwhDay) ? kwhDay : null,
        devices
      };
    });

    if (!FILTER_ZERO_ROWS) return rows;

    return rows.filter((r) => {
      const p0 = r.powerW === 0 || r.powerW === 0.0;
      const k0 = r.kwhDay === 0 || r.kwhDay === 0.0;
      const noDev = !r.devices || r.devices.length === 0;
      return !(p0 && k0 && noDev);
    });
  }

  // =========================
  // KPI helpers
  // =========================
  function setText(node, value) {
    if (!node) return;
    node.textContent = value;
  }

  function fmtW(v) {
    if (v == null) return "—";
    return `${Math.round(v)} W`;
  }

  function fmtKwh(v) {
    if (v == null) return "—";
    return `${(Math.round(v * 1000) / 1000).toFixed(3)}`;
  }

  function computeKPIs(rows) {
  if (!rows.length) return null;

  const sorted = [...rows]
    .filter((r) => r.ts != null)
    .sort((a, b) => new Date(a.ts) - new Date(b.ts));

  const latest = sorted[sorted.length - 1];
  if (!latest) return null;

  const end = new Date(latest.ts).getTime();
  const start = end - 8 * 60 * 60 * 1000;

  const last8h = sorted.filter((r) => r.ts != null && new Date(r.ts).getTime() >= start);

  const powers = last8h.map((r) => r.powerW).filter((v) => Number.isFinite(v));
  const avg = powers.length ? powers.reduce((a, b) => a + b, 0) / powers.length : null;
  const max = powers.length ? Math.max(...powers) : null;

  // Ventana anterior (8h previas)
  const prevStart = start - 8 * 60 * 60 * 1000;
  const prev8h = sorted.filter((r) => {
    const t = r.ts != null ? new Date(r.ts).getTime() : 0;
    return t >= prevStart && t < start;
  });
  const prevPowers = prev8h.map((r) => r.powerW).filter((v) => Number.isFinite(v));
  const prevAvg = prevPowers.length ? prevPowers.reduce((a, b) => a + b, 0) / prevPowers.length : null;
  const prevMax = prevPowers.length ? Math.max(...prevPowers) : null;

  const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  // Deltas corto plazo
  const deltaPower = latest?.powerW != null && prev?.powerW != null ? latest.powerW - prev.powerW : null;
  const deltaKwh = latest?.kwhDay != null && prev?.kwhDay != null ? latest.kwhDay - prev.kwhDay : null;

  // Deltas contexto
  const deltaNowVsAvg = latest?.powerW != null && avg != null ? latest.powerW - avg : null;
  const deltaAvgVsPrev = avg != null && prevAvg != null ? avg - prevAvg : null;
  const deltaMaxVsPrev = max != null && prevMax != null ? max - prevMax : null;
  const deltaMaxVsAvg = max != null && avg != null ? max - avg : null;

  return {
    latest,
    avg,
    max,
    start,
    end,
    prevAvg,
    prevMax,
    deltaPower,
    deltaKwh,
    deltaNowVsAvg,
    deltaAvgVsPrev,
    deltaMaxVsPrev,
    deltaMaxVsAvg
  };
}



  function chip(node, delta, suffix = "") {
    if (!node) return;
    if (delta == null || !Number.isFinite(delta)) {
      node.textContent = "—";
      node.style.color = "";
      node.style.borderColor = "";
      return;
    }
    const sign = delta >= 0 ? "+" : "";
    node.textContent = `${sign}${Math.round(delta)}${suffix}`;
    node.style.color = delta >= 0 ? "var(--good)" : "var(--bad)";
    node.style.borderColor =
      delta >= 0 ? "rgba(88,209,159,.35)" : "rgba(255,107,107,.35)";
  }

function formatDelta(v, unit = "", decimals = 0) {
  if (v == null || !Number.isFinite(v)) return "—";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  const abs = Math.abs(v);
  const num = decimals > 0 ? abs.toFixed(decimals) : String(Math.round(abs));
  return `${sign}${num}${unit}`;
}

function renderTrend(container, items) {
  if (!container) return;
  container.innerHTML = "";

  (items || []).forEach((it) => {
    const delta = it?.delta;
    const unit = it?.unit || "";
    const decimals = Number(it?.decimals || 0);

    const cls =
      delta == null || !Number.isFinite(delta) ? "trend-flat" :
      delta > 0 ? "trend-up" :
      delta < 0 ? "trend-down" : "trend-flat";

    const arrow =
      delta == null || !Number.isFinite(delta) ? "•" :
      delta > 0 ? "▲" :
      delta < 0 ? "▼" : "■";

    const elItem = document.createElement("span");
    elItem.className = `trend-item ${cls}`;

    const a = document.createElement("span");
    a.className = "trend-arrow";
    a.textContent = arrow;

    const label = document.createElement("span");
    label.className = "trend-label";
    label.textContent = it?.label ? String(it.label) : "";

    const d = document.createElement("span");
    d.className = "trend-delta";
    d.textContent = formatDelta(delta, unit, decimals);

    elItem.appendChild(a);
    elItem.appendChild(label);
    elItem.appendChild(d);

    container.appendChild(elItem);
  });
}



  function renderKPIs(kpis) {
  if (!kpis) {
    setText(kpiPowerNow, "—");
    setText(kpiPowerNowFoot, "—");
    setText(kpiPowerAvg, "—");
    setText(kpiPowerAvgFoot, "—");
    setText(kpiPowerMax, "—");
    setText(kpiPowerMaxFoot, "—");
    setText(kpiKwhToday, "—");
    chip(kpiDelta, null);
    chip(kpiAvgDelta, null);

    renderTrend(trendPowerNow, [
      { label: "vs prev", delta: null, unit: " W" },
      { label: "vs avg8h", delta: null, unit: " W" }
    ]);
    renderTrend(trendPowerAvg, [
      { label: "vs prev8h", delta: null, unit: " W" },
      { label: "vs now", delta: null, unit: " W" }
    ]);
    renderTrend(trendPowerMax, [
      { label: "vs prev8h", delta: null, unit: " W" },
      { label: "vs avg8h", delta: null, unit: " W" }
    ]);
    renderTrend(trendKwhToday, [
      { label: "Δ since last", delta: null, unit: "", decimals: 3 }
    ]);
    return;
  }

  setText(kpiPowerNow, fmtW(kpis.latest.powerW ?? null));
  setText(kpiPowerNowFoot, kpis.latest.ts ? `Actualizado: ${fmtLocal(kpis.latest.ts)}` : "—");

  setText(kpiPowerAvg, kpis.avg != null ? fmtW(kpis.avg) : "—");
  setText(kpiPowerAvgFoot, "Ventana: 8h");

  setText(kpiPowerMax, kpis.max != null ? fmtW(kpis.max) : "—");
  setText(kpiPowerMaxFoot, kpis.latest.ts ? `Último punto: ${fmtLocal(kpis.latest.ts)}` : "—");

  setText(kpiKwhToday, fmtKwh(kpis.latest.kwhDay));

  // Chips existentes
  chip(kpiDelta, kpis.deltaPower, " W");
  chip(kpiAvgDelta, kpis.deltaNowVsAvg, " W");

  // Trends (C): dentro de cada KPI
  renderTrend(trendPowerNow, [
    { label: "vs prev", delta: kpis.deltaPower, unit: " W" },
    { label: "vs avg8h", delta: kpis.deltaNowVsAvg, unit: " W" }
  ]);

  renderTrend(trendPowerAvg, [
    { label: "vs prev8h", delta: kpis.deltaAvgVsPrev, unit: " W" },
    { label: "vs now", delta: (kpis.avg != null && kpis.latest?.powerW != null) ? (kpis.avg - kpis.latest.powerW) : null, unit: " W" }
  ]);

  renderTrend(trendPowerMax, [
    { label: "vs prev8h", delta: kpis.deltaMaxVsPrev, unit: " W" },
    { label: "vs avg8h", delta: kpis.deltaMaxVsAvg, unit: " W" }
  ]);

  renderTrend(trendKwhToday, [
    { label: "Δ since last", delta: kpis.deltaKwh, unit: "", decimals: 3 }
  ]);
}



  // =========================
  // Table
  // =========================
  function renderTable(rows, limit = 20) {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const sorted = [...rows]
      .filter((r) => r.ts != null)
      .sort((a, b) => new Date(b.ts) - new Date(a.ts));

    const take = sorted.slice(0, limit);

    for (const r of take) {
      const tr = document.createElement("tr");

      const tdT = document.createElement("td");
      tdT.textContent = r.ts ? fmtLocal(r.ts) : "—";

      const tdP = document.createElement("td");
      tdP.textContent = r.powerW != null ? String(Math.round(r.powerW)) : "—";

      const tdK = document.createElement("td");
      tdK.textContent = r.kwhDay != null ? fmtKwh(r.kwhDay) : "—";

      const tdD = document.createElement("td");
      if (r.devices && r.devices.length) {
        const pills = document.createElement("div");
        pills.className = "pills";
        r.devices.slice(0, 12).forEach((name) => {
          const s = document.createElement("span");
          s.className = "pill";
          s.title = name;
          s.textContent = name;
          pills.appendChild(s);
        });
        tdD.appendChild(pills);
      } else {
        tdD.innerHTML = '<span class="dim">—</span>';
      }

      tr.appendChild(tdT);
      tr.appendChild(tdP);
      tr.appendChild(tdK);
      tr.appendChild(tdD);
      tableBody.appendChild(tr);
    }
  }

  // =========================
  // Chart
  // =========================
  let chart;

  function renderChart(rows) {
    const canvas = document.getElementById("powerChart");
    if (!canvas || !window.Chart) return;

    const sorted = [...rows]
      .filter((r) => r.ts != null)
      .sort((a, b) => new Date(a.ts) - new Date(b.ts));

    const labels = sorted.map((r) => fmtTimeHHMM(r.ts));
    const values = sorted.map((r) => (Number.isFinite(r.powerW) ? r.powerW : null));

    const finite = values.filter((v) => Number.isFinite(v) && v >= 0 && v < 100000);
    const vmax = finite.length ? Math.max(...finite) : 1000;
    const padded = Math.ceil(vmax * 1.15);

    const data = {
      labels,
      datasets: [
        {
          label: "Potencia (W)",
          data: values,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: SHOW_POINTS_ON_HOVER ? 3 : 0,
          tension: 0.25,
          spanGaps: true
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        mode: TOOLTIP_MODE,
        intersect: TOOLTIP_INTERSECT
      },
      scales: {
        x: { ticks: { maxTicksLimit: 10 } },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(padded, 600),
          ticks: { maxTicksLimit: 8 }
        }
      },
      plugins: {
        legend: { display: true },
        tooltip: {
          enabled: true,
          mode: TOOLTIP_MODE,
          intersect: TOOLTIP_INTERSECT,
          callbacks: {
            title: (items) => {
              const idx = items?.[0]?.dataIndex ?? null;
              if (idx == null) return "";
              const row = sorted[idx];
              return row?.ts ? fmtLocal(row.ts) : "";
            },
            label: (ctx) => {
              const v = ctx?.parsed?.y;
              if (!Number.isFinite(v)) return "—";
              return ` ${Math.round(v)} W`;
            }
          }
        }
      }
    };

    if (chart) {
      chart.data = data;
      chart.options = options;
      chart.update();
      return;
    }

    chart = new Chart(canvas.getContext("2d"), { type: "line", data, options });
  }

  // =========================
  // Presets (Opción A)
  // =========================
  function computeLimitFromPreset(preset) {
    if (!preset) return DEFAULT_LIMIT;
    if (typeof preset.points === "number" && preset.points > 0) return preset.points;
    if (typeof preset.hours === "number" && preset.hours > 0) {
      return Math.max(1, Math.round(preset.hours * POINTS_PER_HOUR));
    }
    return DEFAULT_LIMIT;
  }

  function setActivePreset(id) {
    activePresetId = id;
    if (!rangeControls) return;
    const btns = rangeControls.querySelectorAll("button[data-preset]");
    btns.forEach((b) => {
      const on = b.getAttribute("data-preset") === String(id);
      b.classList.toggle("btn-active", on);
    });
  }

  function renderPresets() {
    if (!rangeControls) return;

    rangeControls.innerHTML = "";

    const effective = PRESETS.length
      ? PRESETS
      : [
          { id: "h1", label: "1h", hours: 1 },
          { id: "h3", label: "3h", hours: 3 },
          { id: "h8", label: "8h", hours: 8 },
          { id: "h24", label: "24h", hours: 24 }
        ];

    effective.forEach((p, idx) => {
      const id = p.id || String(idx);

      const b = document.createElement("button");
      b.className = "btn btn-ghost btn-sm";
      b.type = "button";
      b.textContent = p.label || id;
      b.setAttribute("data-preset", id);

      b.addEventListener("click", async () => {
        setActivePreset(id);
        currentLimit = computeLimitFromPreset(p);
        if (rangeMeta) rangeMeta.textContent = `Mostrando: ${b.textContent} (${currentLimit} puntos)`;
        await loadAndRender({ silent: false });
      });

      rangeControls.appendChild(b);
    });

    const first = effective[0];
    const firstId = first?.id || "default";
    setActivePreset(firstId);
    currentLimit = computeLimitFromPreset(first);
    if (rangeMeta) rangeMeta.textContent = `Mostrando: ${first?.label || firstId} (${currentLimit} puntos)`;
  }

  // =========================
  // Main flow
  // =========================
  async function loadAndRender(opts = {}) {
    const { silent = false } = opts;

    if (!guardConfig()) return;

    if (!hasValidToken()) {
      showAuthModal("No hay sesión activa o expiró. Reautentica para continuar.");
      setStatus("Sesión expirada");
      return;
    }

    hideAuthModal();
    if (!silent) setStatus("Cargando…");

    try {
      const payload = await fetchData(currentLimit);
      const rows = normalizeRows(payload);

      if (!rows.length) {
        setStatus("Sin datos");
        renderKPIs(null);
        renderTable([]);
        renderChart([]);
        return;
      }

      renderKPIs(computeKPIs(rows));
      renderTable(rows, 30);
      renderChart(rows);

      setStatus("Listo");
    } catch (e) {
      console.error(e);

      if (String(e?.message || "").includes("401")) {
        showAuthModal("Sesión expirada. Debes reautenticar para continuar.");
        setStatus("Sesión expirada");
        return;
      }

      setStatus("Error");
      showAuthModal(`No se pudieron cargar los datos. (${e?.message || e})`);
    }
  }

  function setupAutoRefresh() {
    if (!AUTO_REFRESH) return;
    if (!Number.isFinite(REFRESH_EVERY_SECONDS) || REFRESH_EVERY_SECONDS < 15) return;

    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      loadAndRender({ silent: true }).catch(() => {});
    }, REFRESH_EVERY_SECONDS * 1000);
  }

  function initUi() {
    if (tzNote) tzNote.textContent = nowTzName();

    btnRefresh?.addEventListener("click", () => loadAndRender({ silent: false }));
    btnReauth?.addEventListener("click", () => login());
    btnCloseAuth?.addEventListener("click", () => hideAuthModal());
    btnLogout?.addEventListener("click", () => doLogout());

    renderPresets();
    setupAutoRefresh();
  }

  async function boot() {
    initUi();

    const cb = parseAuthCallback();
    if (cb.handled) {
      if (!cb.success) {
        clearAuth();
        showAuthModal(cb.message || "Error de autenticación.");
        setStatus("Error auth");
        return;
      }

      try {
        setStatus("Autenticando…");
        await exchangeCodeForToken(cb.code);
      } catch (e) {
        console.error(e);
        clearAuth();
        showAuthModal(`Error autenticando: ${e?.message || e}`);
        setStatus("Error auth");
        return;
      }
    }

    await loadAndRender({ silent: false });
  }

  window.addEventListener("load", () => {
    // 🔖 Mostrar versión de la app
    const versionEl = document.getElementById("appVersion");
    if (versionEl && window.SENSE_DASH_CONFIG?.version) {
      versionEl.textContent = `v${window.SENSE_DASH_CONFIG.version}`;
    }

    boot().catch((e) => {
      console.error(e);
      showAuthModal(`Error inicializando: ${e?.message || e}`);
      setStatus("Error");
    });
  });
})();