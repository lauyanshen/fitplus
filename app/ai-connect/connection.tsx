"use client";

import { useEffect, useState } from "react";

// Only the owner's GitHub Pages app may use this authenticated connection.
// No keys, bearer tokens or session cookies are sent to the opener.
const CLIENT_ORIGIN = "https://lauyanshen.github.io";

export default function FitAIConnection() {
  const [message, setMessage] = useState("Connecting to your Fit+ app…");

  useEffect(() => {
    const opener = window.opener;
    if (!opener) {
      setMessage("Open the AI connection from Fit+ and try again.");
      return;
    }
    const active = new Set<string>();
    const controllers = new Set<AbortController>();
    let disposed = false;
    async function receive(event: MessageEvent) {
      if (event.origin !== CLIENT_ORIGIN || event.source !== opener) return;
      const request = event.data;
      if (request?.type === "fitplus:ping") {
        opener.postMessage({ type: "fitplus:ready" }, CLIENT_ORIGIN);
        return;
      }
      if (request?.type !== "fitplus:request" || typeof request.id !== "string" || !/^[a-zA-Z0-9-]{8,80}$/.test(request.id)) return;
      if (!request.payload || !["calories", "food_photo", "assistant"].includes(request.payload.kind) || active.has(request.id)) return;
      const payloadLimit = request.payload.kind === "food_photo" ? 4_600_000 : 20_000;
      if (active.size >= 2 || JSON.stringify(request.payload).length > payloadLimit) {
        opener.postMessage({ type: "fitplus:response", id: request.id, status: 429, data: { error: "Please finish your current request, then try again." } }, CLIENT_ORIGIN);
        return;
      }
      active.add(request.id);
      setMessage("Fit+ is working on your answer…");
      const controller = new AbortController();
      controllers.add(controller);
      const timeout = window.setTimeout(() => controller.abort(), 110000);
      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request.payload),
          signal: controller.signal,
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = await response.json();
        if (!disposed) {
          opener.postMessage({ type: "fitplus:response", id: request.id, status: response.status, data }, CLIENT_ORIGIN);
          setMessage("Your answer is ready in Fit+. You can return to the app.");
        }
      } catch {
        if (!disposed) {
          opener.postMessage({ type: "fitplus:response", id: request.id, status: 502, data: { error: "Fit+ could not complete the AI request. Please try again." } }, CLIENT_ORIGIN);
          setMessage("Please return to Fit+ and try again.");
        }
      } finally {
        window.clearTimeout(timeout);
        active.delete(request.id);
        controllers.delete(controller);
      }
    }
    window.addEventListener("message", receive);
    opener.postMessage({ type: "fitplus:ready" }, CLIENT_ORIGIN);
    return () => {
      disposed = true;
      window.removeEventListener("message", receive);
      for (const controller of controllers) controller.abort();
    };
  }, []);

  return <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center">
    <p className="text-4xl font-black text-[#153f2d]">Fit+</p>
    <h1 className="text-2xl font-bold">Your AI connection</h1>
    <p role="status" className="text-base leading-7 text-[#56665d]">{message}</p>
    <p className="text-sm leading-6 text-[#65746c]">Keep this window open while using AI. Your existing Fit+ access permissions apply.</p>
    <button type="button" onClick={() => window.close()} className="rounded-xl bg-[#153f2d] px-6 py-3 font-bold text-white">Return to Fit+</button>
  </main>;
}
