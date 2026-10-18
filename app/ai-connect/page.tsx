import { requireChatGPTUser } from "../chatgpt-auth";
import FitAIConnection from "./connection";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fit+ AI connection" };

export default async function AIConnectionPage() {
  await requireChatGPTUser("/ai-connect");
  return <FitAIConnection />;
}
