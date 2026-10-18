"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
export default function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(true);
  const [help, setHelp] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"en"|"ms"|"zh">("en");
  const copy = {
    en: { banner:"Fit+ on your phone or PC", install:"Install app", title:"Install Fit+", intro:"Open Fit+ directly in your browser, not inside another app’s preview.", android:"Open in Chrome. Tap ⋮ → Install app or Add to Home screen.", iphone:"Open in Safari. Tap Share → Add to Home Screen → Add.", windows:"Open in Chrome or Edge. Use the install icon near the address bar, or the browser menu → Install Fit+.", mac:"Use Chrome’s install option, or Safari → File → Add to Dock where available.", note:"Installation is free. AI needs internet. Records stay on this device; installing does not create cloud sync. Your existing access permissions still apply.", menu:"Use your browser menu to install Fit+." },
    ms: { banner:"Fit+ pada telefon atau PC anda", install:"Pasang aplikasi", title:"Pasang Fit+", intro:"Buka Fit+ terus dalam pelayar, bukan dalam pratonton aplikasi lain.", android:"Buka dalam Chrome. Tekan ⋮ → Pasang aplikasi atau Tambah ke skrin utama.", iphone:"Buka dalam Safari. Tekan Kongsi → Tambah ke Skrin Utama → Tambah.", windows:"Buka dalam Chrome atau Edge. Gunakan ikon pemasangan berhampiran bar alamat atau menu pelayar → Pasang Fit+.", mac:"Gunakan pilihan pemasangan Chrome, atau Safari → Fail → Tambah ke Dock jika tersedia.", note:"Pemasangan adalah percuma. AI memerlukan internet. Rekod kekal pada peranti ini dan pemasangan tidak mewujudkan penyegerakan awan. Kebenaran akses sedia ada masih terpakai.", menu:"Gunakan menu pelayar untuk memasang Fit+." },
    zh: { banner:"在手机或电脑上使用Fit+", install:"安装应用", title:"安装Fit+", intro:"请直接在浏览器中打开Fit+，不要在其他应用的预览窗口内打开。", android:"使用Chrome打开。点击⋮ → 安装应用，或添加到主屏幕。", iphone:"使用Safari打开。点击分享 → 添加到主屏幕 → 添加。", windows:"使用Chrome或Edge打开。点击地址栏旁的安装图标，或从浏览器菜单选择安装Fit+。", mac:"使用Chrome的安装选项；也可在Safari选择文件 → 添加到程序坞（如适用）。", note:"安装免费。AI功能需要网络。记录保存在此设备，安装应用不会建立云端同步。现有访问权限仍然适用。", menu:"请使用浏览器菜单安装Fit+。" },
  }[language];
  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const sync = () => setInstalled(media.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const done = () => { setInstalled(true); setPrompt(null); setHelp(false); };
    sync();
    const saved = localStorage.getItem("fitplus-language");
    if (saved === "ms" || saved === "zh" || saved === "en") setLanguage(saved);
    const languageChanged = (event: Event) => {
      const value = (event as CustomEvent).detail;
      if (value === "ms" || value === "zh" || value === "en") setLanguage(value);
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", done);
    media.addEventListener("change", sync);
    window.addEventListener("fitplus-language-change", languageChanged);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => { window.removeEventListener("beforeinstallprompt", capture); window.removeEventListener("appinstalled", done); window.removeEventListener("fitplus-language-change", languageChanged); media.removeEventListener("change", sync); };
  }, []);
  async function install() {
    if (!prompt) { setHelp(true); return; }
    try { await prompt.prompt(); await prompt.userChoice; setPrompt(null); }
    catch { setError(copy.menu); setHelp(true); }
  }
  if (installed) return null;
  return <>
    <div className="flex items-center justify-between gap-3 bg-[#e5f2eb] px-4 py-2 text-sm text-[#153f2d]">
      <span className="font-semibold">{copy.banner}</span>
      <button onClick={install} className="flex shrink-0 items-center gap-2 rounded-xl bg-[#153f2d] px-3 py-2 font-bold text-white"><Download size={16} /> {copy.install}</button>
    </div>
    <Dialog open={help} onOpenChange={setHelp}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl bg-white">
        <DialogTitle className="text-2xl font-bold">{copy.title}</DialogTitle>
        <DialogDescription className="text-base">{copy.intro}</DialogDescription>
        <div className="space-y-4 text-sm leading-6">
          <p><strong>Android:</strong> {copy.android}</p>
          <p><strong>iPhone / iPad:</strong> {copy.iphone}</p>
          <p><strong>Windows PC:</strong> {copy.windows}</p>
          <p><strong>Mac:</strong> {copy.mac}</p>
          <p className="rounded-xl bg-[#edf6f0] p-3">{copy.note}</p>
          {error && <p role="alert">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
