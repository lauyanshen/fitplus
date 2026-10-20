import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit+ — Daily Health Tracker",
  description: "Track BMI, meals, exercise and daily health goals in one clear dashboard.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Fit+", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/app-icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><meta name="codex-preview" content="development" /><meta name="theme-color" content="#153f2d" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
