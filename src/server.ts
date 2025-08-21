import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./analyzeRoute";

dotenv.config();

const app = express();
app.use(cors());

app.get("/", (_req, res) => res.send("AgriSecure analyzer with Gemini"));
app.use("/api", analyzeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));

