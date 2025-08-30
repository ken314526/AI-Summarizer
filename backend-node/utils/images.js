import Tesseract from "tesseract.js";
import path from "path";

const corePath = path.join(
  process.cwd(),
  "node_modules/tesseract.js-core/tesseract-core-simd.js"
);

export default async function imageExtractor(file) {
  try {
    const { data } = await Tesseract.recognize(file.buffer, "eng", {
      corePath,
    });

    return { text: data.text };
  } catch (err) {
    console.error("Tesseract OCR failed:", err);
    return { error: "Failed to extract text from image." };
  }
}
