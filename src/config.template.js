/* config.template.js (commit-safe)
   Copia a config.js y completa SOLO valores públicos.
*/
window.SENSE_DASH_CONFIG = {
  domain: "https://<tu-domain>.auth.<region>.amazoncognito.com",
  clientId: "<tu-client-id-publico>",
  apiUrl: "https://<api-id>.execute-api.<region>.amazonaws.com/data",
  scope: "openid email profile",
  defaultLimit: 96,
  redirectUri: "https://<tu-cloudfront>.cloudfront.net",
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

