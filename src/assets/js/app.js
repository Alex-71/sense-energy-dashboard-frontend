/* =========================
   CONFIG
========================= */
const API_BASE = "https://9wwm9rtfpk.execute-api.us-east-1.amazonaws.com";

const COGNITO_DOMAIN = "https://us-east-19kbwudkl5.auth.us-east-1.amazoncognito.com";
const COGNITO_CLIENT_ID = "11oj9f8rajuhm2p57hotqv8skn";
const COGNITO_REDIRECT_URI = "https://d1y8bixpgd5w0a.cloudfront.net/";
const COGNITO_TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;

const SESSION_KEY = "cognito_tokens";
const VERIFIER_KEY = "pkce_code_verifier";

/* =========================
   UI Helpers
========================= */
function el(id) { return document.getElementById(id); }

function setStatus(msg) {
  const s = el("status");
  if (s) s.textContent = msg;
}

/* =========================
   Token storage
========================= */
function saveTokens(tokens) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(tokens));
}

function loadTokens() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearLocalSession() {
  // Limpia lo relacionado a auth (mantén simple y seguro)
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem("oauth_state");
}

/* =========================
   PKCE helpers
========================= */
function randomString(len = 64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => (b % 36).toString(36)).join("");
}

async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-256", enc);
}

function base64Url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function buildPkceChallenge(verifier) {
  return base64Url(await sha256(verifier));
}

/* =========================
   OAuth2 / Cognito
========================= */
async function buildLoginUrl() {
  const state = randomString(16);
  const verifier = randomString(64);
  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const challenge = await buildPkceChallenge(verifier);

  const u = new URL(`${COGNITO_DOMAIN}/oauth2/authorize`);
  u.searchParams.set("client_id", COGNITO_CLIENT_ID);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", "openid email"); // deja esto alineado a tus scopes permitidos
  u.searchParams.set("redirect_uri", COGNITO_REDIRECT_URI);
  u.searchParams.set("state", state);
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("code_challenge", challenge);
  return u.toString();
}

async function exchangeCodeForTokens(code) {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error("PKCE verifier missing");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: COGNITO_CLIENT_ID,
    code,
    redirect_uri: COGNITO_REDIRECT_URI,
    code_verifier: verifier
  });

  const res = await fetch(COGNITO_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${t}`);
  }

  const tokens = await res.json();
  saveTokens(tokens);
  sessionStorage.removeItem(VERIFIER_KEY);
}

async function handleAuthRedirectIfNeeded() {
  const p = new URLSearchParams(window.location.search);

  // errores OAuth
  if (p.get("error")) {
    throw new Error(`OAuth error: ${p.get("error")} - ${p.get("error_description") || ""}`);
  }

  const code = p.get("code");
  const state = p.get("state");

  // Validación state (anti-CSRF)
  if (state) {
    const expected = sessionStorage.getItem("oauth_state");
    if (expected && expected !== state) {
      clearLocalSession();
      throw new Error("OAuth state mismatch");
    }
  }

  if (!code) return;

  await exchangeCodeForTokens(code);

  // Limpia la URL (quita code/state)
  const clean = new URL(window.location.href);
  clean.searchParams.delete("code");
  clean.searchParams.delete("state");
  clean.searchParams.delete("session_state");
  history.replaceState({}, document.title, clean.toString());

  sessionStorage.removeItem("oauth_state");
}

async function requireLoginIfNoToken() {
  const t = loadTokens();
  if (t?.access_token) return;

  const loginUrl = await buildLoginUrl();
  window.location.href = loginUrl;
}

/* =========================
   LOGOUT (best practice)
   - limpia sesión local
   - cierra sesión en Hosted UI (cookie Cognito)
========================= */
function logout() {
  clearLocalSession();

  const u = new URL(`${COGNITO_DOMAIN}/logout`);
  u.searchParams.set("client_id", COGNITO_CLIENT_ID);
  u.searchParams.set("logout_uri", COGNITO_REDIRECT_URI);

  window.location.href = u.toString();
}

/* =========================
   API
========================= */
function authHeaders() {
  const t = loadTokens();
  return t?.access_token ? { Authorization: `Bearer ${t.access_token}` } : {};
}

async function fetchData(limit = 96) {
  const res = await fetch(`${API_BASE}/data?limit=${limit}`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${t}`);
  }
  const data = await res.json();

  // si tu API devuelve latest->oldest, invierte para chart
  return Array.isArray(data) ? data.slice().reverse() : [];
}

/* =========================
   Formatting (local TZ)
========================= */
const USER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const USER_LOCALE = navigator.language || "es-CL";

function formatTsToLocal(tsIso) {
  const d = new Date(tsIso);
  if (Number.isNaN(d.getTime())) return tsIso || "";
  return new Intl.DateTimeFormat(USER_LOCALE, {
    timeZone: USER_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(d);
}

function formatTsForChart(tsIso) {
  const d = new Date(tsIso);
  if (Number.isNaN(d.getTime())) return tsIso || "";
  return new Intl.DateTimeFormat(USER_LOCALE, {
    timeZone: USER_TZ,
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

/* =========================
   Render
========================= */
let chartInstance = null;

function renderChart(rows) {
  const canvas = el("powerChart");
  if (!canvas) throw new Error("Canvas powerChart not found");

  const ctx = canvas.getContext("2d");

  const labels = rows.map(r => formatTsForChart(r.ts));
  const values = rows.map(r => r.power_w ?? 0);

  if (!window.Chart) throw new Error("Chart.js no está disponible (window.Chart undefined)");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Potencia (W)",
        data: values,
        borderWidth: 2,
        tension: 0.25
      }]
    },
    options: {
      plugins: { legend: { display: true } },
      scales: { x: { ticks: { maxRotation: 45, minRotation: 45 } } }
    }
  });
}

function renderTable(rows) {
  const table = el("dataTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");

    const tdTs = document.createElement("td");
    tdTs.textContent = formatTsToLocal(r.ts);
    tr.appendChild(tdTs);

    const tdP = document.createElement("td");
    tdP.textContent = r.power_w != null ? Number(r.power_w).toFixed(1) : "";
    tr.appendChild(tdP);

    const tdK = document.createElement("td");
    tdK.textContent = r.daily_kwh != null ? Number(r.daily_kwh).toFixed(3) : "";
    tr.appendChild(tdK);

    const tdD = document.createElement("td");
    if (Array.isArray(r.devices)) tdD.textContent = r.devices.join(", ");
    tr.appendChild(tdD);

    tbody.appendChild(tr);
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  // Conecta botón logout (sin inline JS)
  const btn = el("logoutBtn");
  if (btn) btn.addEventListener("click", logout);

  const tzEl = el("tzNote");
  if (tzEl) tzEl.textContent = `Timezone: ${USER_TZ}`;

  try {
    setStatus("Autenticando…");
    await handleAuthRedirectIfNeeded();
    await requireLoginIfNoToken();

    setStatus("Cargando datos…");
    const rows = await fetchData(96);

    setStatus("Renderizando…");
    renderChart(rows);
    renderTable(rows);

    setStatus("OK");
  } catch (e) {
    console.error(e);
    setStatus("Error al cargar");
    alert("No se pudieron cargar los datos o autenticar. Revisa consola.");
  }
});