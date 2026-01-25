/**
 * Zapier integration (Webhook Catch Hook)
 *
 * Setup:
 * 1) Create a Zap with trigger: Webhooks by Zapier -> Catch Hook
 * 2) Copy the webhook URL
 * 3) Add it to your environment:
 *    - local: create `.env.local` with VITE_ZAPIER_WEBHOOK_URL="..."
 *    - prod: set VITE_ZAPIER_WEBHOOK_URL in your build environment (e.g., GitHub Actions secrets)
 */

const WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;

/**
 * Send an event to Zapier.
 *
 * Notes:
 * - Fails silently by default so UX isn't impacted.
 * - Uses a short timeout to avoid hanging requests.
 */
export async function trackZapier(event, payload = {}, options = {}) {
  const { failSilently = true, timeoutMs = 4000 } = options;

  if (!WEBHOOK_URL) return;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        ts: new Date().toISOString(),
        app: 'Workout-Planner-App',
        ...payload,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (!failSilently) throw err;
  } finally {
    clearTimeout(t);
  }
}
