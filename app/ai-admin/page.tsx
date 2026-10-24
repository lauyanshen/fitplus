import { requireChatGPTUser } from "../chatgpt-auth";
import Controls from "./controls";
export const dynamic = "force-dynamic";
export const metadata = { title: "Fit+ AI controls", robots: { index: false, follow: false } };
export default async function Page() {
  const user = await requireChatGPTUser("/ai-admin");
  if (!process.env.FIT_ADMIN_EMAIL || user.email.toLowerCase() !== process.env.FIT_ADMIN_EMAIL.toLowerCase())
    return <main className="p-8">Only the Fit+ owner can use these controls.</main>;
  return <Controls />;
}
