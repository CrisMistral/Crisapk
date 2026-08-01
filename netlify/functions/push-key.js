// ─── Clave pública VAPID para el push del navegador ─────────────────────────
// El cliente la pide antes de suscribirse. Si no está configurada, responde
// vacío y el cliente cae al "recordatorio local" sin bloquearse.
//   Genera las claves una vez con:  npx web-push generate-vapid-keys
//   y guárdalas en Netlify como VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY.
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async () => {
  const key = process.env.VAPID_PUBLIC_KEY || '';
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    body: JSON.stringify({ key }),
  };
};
