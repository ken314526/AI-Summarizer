import pdfParse from "pdf-parse/lib/pdf-parse.js";

export default async function pdfExtractor(file) {
  try {
    const data = await pdfParse(file.buffer);
    return { text: data.text };
  } catch (err) {
    return { error: "Failed to parse PDF." };
  }
}
