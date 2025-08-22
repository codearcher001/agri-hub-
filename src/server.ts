import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./analyzeRoute";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => res.send("AgriSecure analyzer with Gemini"));
app.use("/api", analyzeRoute);

// Gemini assessment per requirements
interface CropAnalysisResult {
	cropName: string;
	disease: string;
	fertilizer: string;
}

async function assessCropHealth(imageBase64: string): Promise<CropAnalysisResult> {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("Missing GEMINI_API_KEY in environment");
	}

	const url =
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-vision:generateContent";

	const payload = {
		contents: [
			{
				role: "user",
				parts: [
					{
						text:
							"Analyze this crop image and respond ONLY in valid JSON with keys: cropName, disease, fertilizer.",
					},
					{ inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
				],
			},
		],
	};

	const { data } = await axios.post(url, payload, {
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": apiKey,
		},
		timeout: 30000,
	});

	// Extract text from Gemini response
	const candidates = data?.candidates ?? [];
	const parts = candidates[0]?.content?.parts ?? [];
	const rawText = parts.map((p: any) => p.text || "").join("").trim();
	const cleaned = rawText
		.replace(/^```json\s*|\s*```$/g, "")
		.replace(/^```\s*|\s*```$/g, "")
		.trim();

	let parsed: any;
	try {
		parsed = JSON.parse(cleaned);
	} catch (err) {
		throw new Error("Model did not return valid JSON");
	}

	const result: CropAnalysisResult = {
		cropName: String(parsed.cropName ?? ""),
		disease: String(parsed.disease ?? ""),
		fertilizer: String(parsed.fertilizer ?? ""),
	};

	return result;
}

app.post("/api/gemini", async (req, res) => {
	try {
		const { image } = req.body as { image?: string };
		if (!image || typeof image !== "string") {
			return res.status(400).json({ error: "Missing 'image' base64 in body" });
		}
		const result = await assessCropHealth(image);
		return res.json(result);
	} catch (error: any) {
		const msg = error?.message || "Server error";
		return res.status(500).json({ error: msg });
	}
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));

