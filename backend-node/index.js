import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

import generateResponse from "./utils/generator.js";
import imageExtractor from "./utils/images.js";
import pdfExtractor from "./utils/pdfs.js";

dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  return res.json({ message: "Backend server running !!" });
});

app.post("/extract-text/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const summaryLength = req.body.summary_length;
    let extractedText = "",
      error = false;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (file.mimetype === "application/pdf") {
      const { text, err } = await pdfExtractor(file);
      extractedText = text;
      error = err;
    } else if (file.mimetype.startsWith("image/")) {
      const { text, err } = await imageExtractor(file);
      extractedText = text;
      error = err;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (error) {
      return res
        .status(400)
        .json({ error: "Error occured while parsing PDF/ Image" });
    }

    try {
      const result = await generateResponse(extractedText, summaryLength);

      return res.json({
        text: extractedText,
        generated_text: result.generated_text,
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to generate summary." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to process file" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
