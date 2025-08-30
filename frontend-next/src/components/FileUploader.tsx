"use client";
import { useState, useCallback, DragEvent } from "react";
import axios from "axios";
import { Clipboard, ChevronDown, ChevronUp, FileText } from "lucide-react";
import Footer from './Footer';
import Error from "./Error";

const SUMMARY_OPTIONS = [
  { label: "Short", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Long", value: "long" },
];

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [text, setText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showExtracted, setShowExtracted] = useState(false);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setText("");
    setSummary("");
    setError(null);
    setShowExtracted(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setError(null);
    setText("");
    setSummary("");
    setShowExtracted(false);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("summary_length", summaryLength);

    try {
      const URL = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);

      const res = await axios.post(`${URL}/extract-text/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText(res.data.text);
      setSummary(res.data.generated_text);
    } catch (err) {
      setError("Failed to extract or summarize text. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-100 flex flex-col items-center px-4 pt-10 pb-20">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 backdrop-blur-md">
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-10 tracking-tight">
          📄 AI Document Summarizer
        </h1>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl cursor-pointer p-16 flex flex-col items-center justify-center mb-8 transition-all duration-300 shadow-sm hover:shadow-lg ${
            dragActive
              ? "border-indigo-500 bg-indigo-50 scale-105"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20 text-indigo-500 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            {file ? `📁 Selected: ${file.name}` : "Drag & drop or click to upload PDF/Image"}
          </p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <label htmlFor="summary-select" className="text-gray-700 font-semibold text-lg">
            Summary length
          </label>
          <select
            id="summary-select"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            {SUMMARY_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpload}
          className={`w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 text-lg shadow-lg transition-all cursor-pointer ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Processing...
            </>
          ) : (
            "Extract & Summarize"
          )}
        </button>

        {error && <Error error={error} />}

        {summary && (
          <section className="relative mt-8 text-indigo-700 bg-indigo-50 border border-indigo-300 rounded-xl p-6 shadow-inner">
            <button
              onClick={() => copyToClipboard("summary", summary)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-indigo-100 cursor-pointer text-sm"
            >
              {copied === "summary" ? "✔️ Copied" : <Clipboard className="w-5 h-5 text-indigo-700" />}
            </button>
            <h2 className="text-indigo-900 font-bold mb-3 text-xl">
              ✨ Summary ({summaryLength})
            </h2>
            <pre className="whitespace-pre-wrap text-indigo-900 text-sm font-medium leading-relaxed">
              {summary}
            </pre>
          </section>
        )}

        {text && (
          <div className="mt-6">
            <button
              onClick={() => setShowExtracted((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-200 transition cursor-pointer text-gray-700 font-medium"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Extracted Text
              </span>
              {showExtracted ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {showExtracted && (
              <section className="relative mt-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-64 overflow-y-auto shadow-inner transition-all duration-300">
                <button
                  onClick={() => copyToClipboard("text", text)}
                  className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 cursor-pointer text-sm"
                >
                  {copied === "text" ? "✔️ Copied" : <Clipboard className="w-5 h-5 text-gray-600" />}
                </button>
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {text}
                </pre>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
