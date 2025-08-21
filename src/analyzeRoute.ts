import { Router } from "express";
import multer from "multer";
import { ai, MODEL_ID } from "./gemini";
import { diagnosisSchema } from "./schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype
    );
    if (!allowed) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

const router = Router();

const SYSTEM_INSTRUCTION = `
You are an agricultural plant pathology assistant for India. 
From a single plant image, infer:
1) crop common name,
2) most likely disease (or "not a disease / abiotic stress"),
3) evidence-based explanation,
4) a practical fertilizer plan that supports recovery or strengthens plant health (avoid banned chemicals; if unsure, recommend safe general-use NPK or organic soil amendments).
Output ONLY JSON matching the schema provided. Use short, specific, farmer-friendly language. If low confidence, say so and suggest next steps.
`;

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image uploaded" });

    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const prompt = [
      { text: SYSTEM_INSTRUCTION },
      {
        inlineData: { mimeType, data: base64 },
      },
      {
        text: `Return JSON with keys exactly as in this TypeScript type:
{
  "crop_name": string,
  "disease_name": string,
  "confidence": number,
  "explanation": string,
  "recommended_fertilizer": {
    "type": "NPK" | "organic" | "micronutrient" | "mixed",
    "product_example": string,
    "dosage_per_area": string,
    "application_method": string,
    "frequency": string
  },
  "additional_care": string[],
  "urgency": "low" | "medium" | "high",
  "alternatives_organic": string[],
  "warnings": string[],
  "references"?: string[]
}
Important: respond with raw JSON only, no backticks, no prose.`,
      },
    ];

    const response: any = await (ai as any).models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    const textRaw =
      typeof response.text === "function"
        ? await response.text()
        : response.text ?? "";
    const text = (textRaw || "").toString().trim();

    const jsonString = text
      .replace(/^```json|```$/g, "")
      .replace(/^```|```$/g, "");

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return res
        .status(502)
        .json({ error: "Model returned non-JSON", raw_text: text });
    }

    const validated = diagnosisSchema.safeParse(parsed);
    if (!validated.success) {
      return res.status(502).json({
        error: "Schema validation failed",
        issues: validated.error.issues,
        raw: parsed,
      });
    }
    return res.json(validated.data);
  } catch (err: any) {
    if (err?.message?.includes("Unsupported file type")) {
      return res.status(415).json({ error: "Only JPG, PNG, WEBP allowed" });
    }
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ error: "Image too large (max 10MB)" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

