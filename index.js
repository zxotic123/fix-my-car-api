import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/diagnose", async (req, res) => {
  try {
    const { symptoms, mode, weather, fileData } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
You are FIX MY CAR AI.
Act as a conservative real-world automotive technician.

Symptoms:
${symptoms}

Mode:
${mode}

Weather:
${weather || "N/A"}
`;

    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Diagnosis failed" });
  }
});

app.get("/", (_, res) => {
  res.send("Fix My Car API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
