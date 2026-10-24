"use client";
import { useEffect, useState } from "react";
export default function Controls() {
  const [status, setStatus] = useState<{ enabled: boolean; used: number; limit: number } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function update(enabled?: boolean) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/ai-control", enabled === undefined ? { cache: "no-store" } : {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  useEffect(() => { void update(); }, []);
  return <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-5 p-6 text-[#153f2d]">
    <h1 className="text-3xl font-black">Fit+ AI controls</h1>
    <p>Owner access only. Pause AI when your exhibition ends.</p>
    {status && <><p className="text-xl font-bold">AI is {status.enabled ? "enabled" : "paused"}</p>
      <p>{status.used} / {status.limit} exhibition requests used. Usage includes unsuccessful attempts sent to the AI service.</p>
      <button disabled={busy} onClick={() => update(!status.enabled)} className="rounded-xl bg-[#153f2d] px-6 py-4 font-bold text-white disabled:opacity-50">{busy ? "Saving…" : status.enabled ? "Pause AI" : "Enable AI"}</button></>}
    <button disabled={busy} onClick={() => update()} className="rounded-xl border border-[#153f2d] px-6 py-3">Refresh usage</button>
    {error && <p role="alert">{error}</p>}
    <p className="text-sm">Pausing blocks new AI requests. Requests already in progress may finish. This controls Fit+ only; it does not revoke your OpenAI key.</p>
    <a href="/" className="underline">Return to Fit+</a>
  </main>;
}
