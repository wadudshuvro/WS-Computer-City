/**
 * Forwards an error to Sentry when SENTRY_DSN is set.
 * The DSN is an environment variable, never a key in source.
 */
export async function captureException(error: unknown, extra?: Record<string, string>): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace('/', '');
    const key = url.username;
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    await fetch(`${url.protocol}//${url.host}/api/${projectId}/store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${key}, sentry_client=logicbay/1.0`,
      },
      body: JSON.stringify({
        message,
        extra,
        exception: stack ? { values: [{ type: 'Error', value: message, stacktrace: { frames: [] } }] } : undefined,
      }),
    });
  } catch {
    console.error('[sentry] failed to report');
  }
}
