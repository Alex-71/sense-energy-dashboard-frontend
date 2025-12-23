// config.js
// Configuración central del dashboard (NO versionado).

window.SENSE_DASH_CONFIG = {
  // =========================
  // Cognito Hosted UI
  // =========================
  // OJO: en app.js se hace .replace(/\/$/, "") para quitar slash final.
  // Por eso aquí puedes dejarlo con o sin slash, da igual.
  domain: "https://us-east-19kbwudkl5.auth.us-east-1.amazoncognito.com",
  clientId: "11oj9f8rajuhm2p57hotqv8skn",
  scope: "openid email profile",

  // =========================
  // API (GET /data)
  // =========================
  apiUrl: "https://9wwm9rtfpk.execute-api.us-east-1.amazonaws.com/data",

  // =========================
  // Defaults de data
  // =========================
  // defaultLimit: cantidad de puntos a pedir por defecto (si no seleccionas un preset)
  // 96 = 8 horas si llega cada 5 min (12 pts/h)
  defaultLimit: 96,

  // =========================
  // Redirect (referencia / documentación)
  // =========================
  // Tu app.js HOY calcula redirectUri como window.location.origin + "/"
  // Esto es solo referencial para ti (y para que tengas el valor visible).
  // Recomendación: en Cognito Allowed Callback URLs y Sign-out URLs usar:
  // https://d1y8bixpgd5w0a.cloudfront.net/
  redirectUri: "https://d1y8bixpgd5w0a.cloudfront.net/",

  // =========================
  // UX / Dashboard options
  // =========================
  ui: {
    // Auto refresh
    autoRefresh: true,
    refreshEverySeconds: 60, // refresca KPIs/tabla/grafico cada 60s (sin reauth)

    // Presets recomendados (para botones "Últimas...")
    // - hours: calcula limit = hours * pointsPerHour
    // - points: fuerza limit directo
    // Tu app.js actual no los usa todavía; quedarán listos para cuando lo implementes.
    pointsPerHour: 12, // 60min / 5min = 12 puntos por hora
    presets: [
      { id: "h1", label: "1h", hours: 1 },
      { id: "h3", label: "3h", hours: 3 },
      { id: "h6", label: "6h", hours: 6 },
      { id: "h12", label: "12h", hours: 12 },
      { id: "h24", label: "24h", hours: 24 },
      { id: "p50", label: "50 pts", points: 50 },
      { id: "p100", label: "100 pts", points: 100 },
      { id: "p200", label: "200 pts", points: 200 }
    ],

    // Filtro de “ceros” (para evitar registros “vacíos” tipo power=0, kwh=0)
    // Tu app.js actual no filtra; esto quedará listo para integrarlo.
    // Sugerencia típica:
    // - filtrar filas con powerW==0 Y kwhDay==0 y devices vacío.
    filterZeroRows: true,

    // Tooltip / chart
    chart: {
      tooltipMode: "index",  // index | nearest
      intersect: false,
      showPointsOnHover: true
    }
  }
};