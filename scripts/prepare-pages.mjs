import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const root = path.resolve("dist/github-pages");
const base = process.env.FIT_PAGES_BASE || "/fitplus/";
const manifest = JSON.parse(await readFile(path.join(root, "manifest.webmanifest"), "utf8"));
manifest.id = base; manifest.start_url = base; manifest.scope = base;
for (const icon of manifest.icons) icon.src = base + icon.src.replace(/^\/+/, "");
await writeFile(path.join(root, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
async function walk(dir) {
  return (await Promise.all((await readdir(dir, {withFileTypes:true})).map(f => f.isDirectory() ? walk(path.join(dir,f.name)) : path.join(dir,f.name)))).flat();
}
const files = (await walk(root)).filter(f=>!f.endsWith("sw.js"));
const hash = createHash("sha256").update(base);
for (const f of files.sort()) hash.update(await readFile(f));
const prefix = "fitplus-pages-" + createHash("sha256").update(base).digest("hex").slice(0,8) + "-";
const cache = prefix + hash.digest("hex").slice(0,12);
const assets = [base,...files.map(f=>base+path.relative(root,f).split(path.sep).join("/"))];
await writeFile(path.join(root,"sw.js"), `const CACHE=${JSON.stringify(cache)};
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(${JSON.stringify(prefix)})&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(${JSON.stringify(base)}))return;event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request,{ignoreVary:true})).then(cached=>cached||fetch(event.request)));});
`);
console.log("Prepared Fit+ GitHub Pages assets and offline shell.");
