import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const base = process.env.FIT_PAGES_BASE || "/fitplus/";
export default defineConfig({
  base,
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  define: {
    "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(base),
    "process.env.NEXT_PUBLIC_FIT_AI_ENDPOINT": JSON.stringify("https://fit-plus-health.eddielau.chatgpt.site/api/ai"),
  },
  plugins: [react()],
  build: { outDir: "dist/github-pages" },
  server: { host: "127.0.0.1", port: 4180 },
});
