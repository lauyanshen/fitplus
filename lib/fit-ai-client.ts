const CONNECTION_URL = process.env.NEXT_PUBLIC_FIT_AI_CONNECTION || "";
let pending = false;

/** Keep the original same-origin API on Sites; reuse it securely from GitHub Pages. */
export async function requestFitAI(init: RequestInit): Promise<Response> {
  if (!CONNECTION_URL) return fetch("/api/ai", init);
  if (pending) throw new Error("Please finish your current Fit+ AI request first.");
  const origin = new URL(CONNECTION_URL).origin;
  // This runs synchronously from the submit gesture, before any await.
  const connection = window.open(CONNECTION_URL, "fitplus-ai-connection", "popup,width=540,height=640");
  if (!connection) throw new Error("Please allow the Fit+ connection window, then try again.");
  const id = crypto.randomUUID();
  const payload = JSON.parse(String(init.body || "{}"));
  pending = true;
  return new Promise((resolve, reject) => {
    let sent = false;
    const cleanup = () => {
      pending = false;
      window.removeEventListener("message", receive);
      window.clearInterval(ping);
      window.clearInterval(closed);
      window.clearTimeout(timeout);
    };
    const fail = (message: string) => { cleanup(); reject(new Error(message)); };
    function receive(event: MessageEvent) {
      if (event.origin !== origin || event.source !== connection) return;
      if (event.data?.type === "fitplus:ready" && !sent) {
        sent = true;
        connection!.postMessage({ type: "fitplus:request", id, payload }, origin);
      } else if (event.data?.type === "fitplus:response" && event.data.id === id) {
        cleanup();
        const status = Number(event.data.status);
        if (!Number.isInteger(status) || status < 200 || status > 599) { reject(new Error("Fit+ returned an unreadable response.")); return; }
        resolve(new Response(JSON.stringify(event.data.data), { status, headers: { "Content-Type": "application/json" } }));
      }
    }
    window.addEventListener("message", receive);
    const ping = window.setInterval(() => { if (!sent) connection.postMessage({ type: "fitplus:ping" }, origin); }, 500);
    const closed = window.setInterval(() => { if (connection.closed) fail("The Fit+ connection window was closed. Please try again."); }, 500);
    const timeout = window.setTimeout(() => fail("The Fit+ connection timed out. Finish signing in, then try again."), 150000);
  });
}
