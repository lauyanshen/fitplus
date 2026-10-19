import { NextRequest, NextResponse } from "next/server";
const NORMAL_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const foodItemSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    portion: { type: "string" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    totalSugar: { type: "number" },
    addedSugar: { type: "number" },
    foodGroups: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "vegetables",
          "fruit",
          "whole grains",
          "refined grains",
          "protein",
          "dairy",
          "healthy fats",
          "sugary foods/drinks",
          "other",
        ],
      },
    },
    balance: {
      type: "string",
      enum: ["balanced", "partly balanced", "less balanced"],
    },
    frequency: { type: "string", enum: ["often", "sometimes", "limit"] },
    balanceNote: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    note: { type: "string" },
  },
  required: [
    "name",
    "portion",
    "calories",
    "protein",
    "carbs",
    "fat",
    "totalSugar",
    "addedSugar",
    "foodGroups",
    "balance",
    "frequency",
    "balanceNote",
    "confidence",
    "note",
  ],
};
const foodSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: { type: "array", items: foodItemSchema, minItems: 1, maxItems: 12 },
  },
  required: ["items"],
};
const answerSchema = {
  type: "object",
  additionalProperties: false,
  properties: { answer: { type: "string" } },
  required: ["answer"],
};
export async function POST(req: NextRequest) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key)
      return NextResponse.json(
        {
          error:
            "Fit+ AI has not been connected yet. Add the OpenAI API key in the protected site settings.",
        },
        { status: 503 },
      );
    const body = await req.json(),
      kind = body?.kind,
      language =
        body?.language === "ms"
          ? "Bahasa Melayu"
          : body?.language === "zh"
            ? "Simplified Chinese"
            : "English";
    if (kind !== "calories" && kind !== "food_photo" && kind !== "assistant")
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    let instructions = "",
      input: unknown = "",
      schema = foodSchema,
      schemaName = "food_estimate";
    if (kind === "calories") {
      const food = String(body.food || "")
        .trim()
        .slice(0, 800);
      if (!food)
        return NextResponse.json(
          { error: "Describe a food and portion first." },
          { status: 400 },
        );
      instructions = `You are Fit+, a cautious nutrition estimator. Treat every separate line or clearly listed food as an individual item and return one result for each, in the same order. Never combine different foods. Use typical Malaysian or international portions. Estimate calories, macros, total sugar and added/free sugar in grams; addedSugar must not exceed totalSugar. Classify food groups and overall balance based on portion, fibre, vegetables, protein, processing, saturated fat, sodium and added sugar. 'often' means generally suitable regularly, 'sometimes' means portion/context matters, and 'limit' means high added sugar, sodium, saturated fat or heavily processed. Do not moralise food or diagnose health. If details are unclear, assume one serving and lower confidence. Keep note and balanceNote below 20 words each. Return no more than 12 items. Write the food name, portion, note and balanceNote in ${language}; keep required enum values unchanged.`;
      input = food;
    } else if (kind === "food_photo") {
      const image = String(body.image || "");
      if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image) || image.length > 4_500_000)
        return NextResponse.json(
          { error: "Choose a clear JPG, PNG or WebP food photo under 4 MB." },
          { status: 400 },
        );
      instructions = `You are Fit+, a cautious food-photo nutrition estimator. Identify each visible food or drink as a separate item. Estimate realistic portions, calories, macros, total sugar and added/free sugar; addedSugar must not exceed totalSugar. Use visual evidence only and do not invent hidden ingredients. Classify food groups and balance. If the meal or portion is unclear, use low confidence and explain briefly. Do not diagnose or moralise. Return no more than 12 items. Keep note and balanceNote below 20 words each. Write food names, portions, notes and balanceNote in ${language}; keep required enum values unchanged.`;
      input = [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Identify and estimate every visible food and drink in this photo." },
            { type: "input_image", image_url: image, detail: "low" },
          ],
        },
      ];
    } else {
      const question = String(body.question || "")
        .trim()
        .slice(0, 800);
      if (!question)
        return NextResponse.json(
          { error: "Ask a question first." },
          { status: 400 },
        );
      schema = answerSchema;
      schemaName = "health_guidance";
      instructions = `You are Fit+, a fast, supportive wellness assistant. Answer directly using the supplied context and age. Under 20: no adult BMI labels, calorie deficits, weight-loss targets or dieting; suggest balanced family meals, sleep, enjoyable activity and parent/paediatric guidance. Age 65+: prioritise strength, balance, hydration, nourishment and gradual change; flag unintentional weight loss. Age 20–64: support gradual sustainable goals. Never diagnose or recommend extreme restriction, purging, supplements, medicines or treatment changes. For urgent symptoms, self-harm, eating-disorder signs, pregnancy or serious concerns, advise professional care. Give 2–4 practical points in no more than 100 words. Reply only in ${language}.`;
      input = JSON.stringify({ question, context: body.context || {} });
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: NORMAL_MODEL,
        instructions,
        input,
        text: {
          format: {
            type: "json_schema",
            name: schemaName,
            strict: true,
            schema,
          },
        },
        // Each food carries macros, sugars, groups, and guidance. Twelve foods
        // cannot reliably fit in the previous 1,200-token response budget.
        max_output_tokens: kind === "calories" || kind === "food_photo" ? 9000 : 500,
      }),
    });
    const raw = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      console.error("OpenAI returned invalid JSON", response.status);
      return NextResponse.json(
        {
          error:
            "The AI service returned an unreadable response. Please try again.",
        },
        { status: 502 },
      );
    }
    if (!response.ok) {
      const apiError = (data.error || {}) as { code?: string };
      console.error("OpenAI request failed", response.status, apiError.code);
      return NextResponse.json(
        {
          error:
            response.status === 401
              ? "The OpenAI API key was rejected."
              : response.status === 429
                ? "The AI usage limit has been reached. Check API billing or try again later."
                : "The AI service could not complete this request.",
        },
        { status: 502 },
      );
    }
    if (data.status === "incomplete") {
      console.error(
        "OpenAI response incomplete",
        JSON.stringify(data.incomplete_details || {}),
      );
      return NextResponse.json(
        {
          error:
            "The AI answer was interrupted before it finished. Please send the question again.",
        },
        { status: 502 },
      );
    }
    const output = Array.isArray(data.output) ? data.output : [];
    const text = output
      .flatMap(
        (item: { content?: { type: string; text?: string }[] }) =>
          item.content || [],
      )
      .find((item: { type: string }) => item.type === "output_text")
      ?.text?.trim();
    if (!text) {
      console.error(
        "OpenAI response had no output text",
        String(data.status || "unknown"),
      );
      return NextResponse.json(
        { error: "The AI did not return an answer. Please try again." },
        { status: 502 },
      );
    }
    try {
      return NextResponse.json({ result: JSON.parse(text) });
    } catch {
      console.error("OpenAI output text was not valid JSON");
      return NextResponse.json(
        { error: "The AI answer could not be read. Please try again." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error(
      "Fit+ AI route error",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      {
        error:
          "Fit+ could not reach the AI service. Check your connection and try again.",
      },
      { status: 500 },
    );
  }
}
