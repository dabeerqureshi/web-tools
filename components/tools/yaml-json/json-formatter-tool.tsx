"use client";

import React, { useState, useId } from "react";
import { formatJson, SAMPLE_PRESETS } from "@/lib/parsers/yaml-parser";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { Copy, Download, Trash2, Upload, Check, AlertCircle, Braces, Minimize2, Maximize2 } from "lucide-react";

export function JsonFormatterTool() {
  const [input, setInput] = useState<string>(SAMPLE_PRESETS.jsonSample);
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputId = useId();

  const handleFormat = (spaces: number | "compact") => {
    if (!input.trim()) return;
    const res = formatJson(input, spaces);
    if (res.success) {
      setInput(res.output);
      setError(null);
    } else {
      setError({ message: res.error || "Invalid JSON", line: res.line });
    }
  };

  const handleCopy = async () => {
    if (!input) return;
    const ok = await copyToClipboard(input);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!input) return;
    downloadFile(input, "formatted.json", "application/json");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setInput(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFormat(2)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Beautify (2 Spaces)</span>
          </button>
          <button
            onClick={() => handleFormat(4)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 transition-colors"
          >
            <span>4 Spaces</span>
          </button>
          <button
            onClick={() => handleFormat("compact")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify (Compact)</span>
          </button>

          <label
            htmlFor={fileInputId}
            className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-500" />
            <span>Upload</span>
            <input id={fileInputId} type="file" accept=".json,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            onClick={() => setInput("")}
            className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/60 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-bold">Invalid JSON Syntax</span>
            {error.line && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-100 font-mono text-[11px]">Line {error.line}</span>}
            <p className="mt-1 font-mono text-[11px]">{error.message}</p>
          </div>
        </div>
      )}

      {/* Editor Box */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
            <Braces className="w-4 h-4 text-indigo-600" />
            JSON Editor
          </span>
          <span>{input ? input.split("\n").length : 0} lines &bull; {input.length} characters</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or format JSON..."
          spellCheck={false}
          className="w-full h-[480px] p-4 font-mono text-xs md:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 resize-none focus:outline-hidden leading-relaxed"
        />
      </div>
    </div>
  );
}

