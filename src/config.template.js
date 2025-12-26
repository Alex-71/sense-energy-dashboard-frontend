/* config.template.js (commit-safe)
   Copia a config.js y completa SOLO valores públicos.
*/
window.SENSE_DASH_CONFIG = {
  // =========================
  // Cognito Hosted UI
  // =========================
  domain: "https://<tu-domain>.auth.<region>.amazoncognito.com",
  clientId: "<tu-client-id-publico>",
  scope: "openid email profile",

  // =========================
  // API (GET /data)
  // =========================
  apiUrl: "https://<api-id>.execute-api.<region>.amazonaws.com/data",

  // =========================
  // Defaults
  // =========================
  defaultLimit: 96,

  // =========================
  // Redirect URI (CONTROLADO POR ENTORNO)
  // ⚠️ IMPORTANTE:
  // - QA  → https://<cloudfront>.cloudfront.net/qa/
  // - PROD → https://<cloudfront>.cloudfront.net/
  // =========================
  redirectUri: "<REDIRECT_URI>",

  // =========================
  // Build info
  // =========================
  version: "<BUILD_ID>",

  // =========================
  // UI options
  // =========================
  ui: {
    pointsPerHour: 12,
    filterZeroRows: true,
    autoRefresh: false,
    refreshEverySeconds: 60,
    chart: {
      tooltipMode: "index",
      intersect: false,
      showPointsOnHover: true
    }
  }
};