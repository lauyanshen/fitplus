const ENDPOINT = process.env.NEXT_PUBLIC_FIT_AI_ENDPOINT || "/api/ai";
let pending = false;

/** Direct HTTPS only: no popup, connection page, cookies or browser-stored keys. */
export async function requestFitAI(init: RequestInit): Promise<Response> {
  if (pending) throw new Error("Please finish your current Fit+ AI request first.");
  pending = true;
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  if (init.signal?.aborted) controller.abort();
  init.signal?.addEventListener("abort", forwardAbort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 110_000);
  try {
    const response = await fetch(ENDPOINT, {
      ...init, credentials: "omit", mode: "cors", cache: "no-store",
      redirect: "error", signal: controller.signal,
    });
    if (!response.headers.get("content-type")?.includes("application/json"))
      throw new Error("The AI connection is unavailable. Please try again shortly.");
    // Read the body before clearing the timeout or allowing another request.
    const body = await response.text();
    try { JSON.parse(body); }
    catch { throw new Error("Fit+ returned an unreadable answer. Please try again."); }
    return new Response(body, { status: response.status, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    if (controller.signal.aborted) throw new Error("The AI request timed out or was cancelled. Please try again.");
    if (error instanceof TypeError) throw new Error("Could not connect to Fit+ AI. Check your internet connection and try again.");
    throw error;
  } finally {
    clearTimeout(timeout);
    init.signal?.removeEventListener("abort", forwardAbort);
    pending = false;
  }
}
