import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";
import { aiStatus, type UsageDB } from "@/lib/ai-access";

async function owner() {
  const user = await getChatGPTUser();
  return !!user && !!process.env.FIT_ADMIN_EMAIL && user.email.toLowerCase() === process.env.FIT_ADMIN_EMAIL.toLowerCase();
}
const headers = { "Cache-Control": "no-store" };
export async function GET() {
  if (!await owner()) return NextResponse.json({ error: "Owner access required." }, { status: 403, headers });
  try {
    const db = (env as unknown as { DB: UsageDB }).DB;
    return NextResponse.json(await aiStatus(db), { headers });
  } catch { return NextResponse.json({ error: "Controls unavailable." }, { status: 503, headers }); }
}
export async function POST(req: NextRequest) {
  if (!await owner()) return NextResponse.json({ error: "Owner access required." }, { status: 403, headers });
  if (req.headers.get("origin") !== "https://fit-plus-health.eddielau.chatgpt.site" || !req.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ error: "Invalid request." }, { status: 403, headers });
  try {
    const raw = await req.text();
    if (raw.length > 200) return NextResponse.json({ error: "Invalid request." }, { status: 400, headers });
    const { enabled } = JSON.parse(raw);
    if (typeof enabled !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400, headers });
    const db = (env as unknown as { DB: UsageDB }).DB;
    await db.prepare("INSERT INTO ai_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
      .bind("enabled", String(enabled)).run();
    return NextResponse.json(await aiStatus(db), { headers });
  } catch { return NextResponse.json({ error: "Controls unavailable." }, { status: 503, headers }); }
}
