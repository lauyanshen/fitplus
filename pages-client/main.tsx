import React from "react";
import { createRoot } from "react-dom/client";
import FitPlus from "../app/page";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><FitPlus /></React.StrictMode>);
if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {});
  });
}
