import Tesseract from "tesseract.js";

export default async function imageExtractor(file) {
  try {
    const { data } = await Tesseract.recognize(file.buffer, "eng");
    return { text: data.text };
  } catch (err) {
    return { error: "Failed to extract text from image." };
  }
}
