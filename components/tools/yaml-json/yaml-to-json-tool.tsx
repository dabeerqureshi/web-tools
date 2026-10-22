"use client";

import React, { useState, useEffect, useId } from "react";
import { yamlToJson, SAMPLE_PRESETS } from "@/lib/parsers/yaml-parser";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import {
  Copy,
  Download,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  FileCode,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

export function YamlToJsonTool() {
  const [yamlInput, setYamlInput] = useState<string>(SAMPLE_PRESETS.k8s);
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [indent, setIndent] = useState<number | "compact">(2);
  const [error, setError] = useState<{ message: string; line?: number; col?: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputId = useId();

  // Perform instant conversion whenever yamlInput or indent changes
  useEffect(() => {
    if (!yamlInput.trim()) {
      setJsonOutput("");
      setError(null);
      return;
    }

    const res = yamlToJson(yamlInput, indent);
    if (res.success) {
      setJsonOutput(res.output);
      setError(null);
    } else {
      setError({
        message: res.error || "Syntax error in YAML",
        line: res.line,
        col: res.col,
      });
    }
  }, [yamlInput, indent]);

  const handleCopy = async () => {
    if (!jsonOutput) return;
    const ok = await copyToClipboard(jsonOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    downloadFile(jsonOutput, "converted.json", "application/json");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setYamlInput(text);
      }
    };
    reader.readAsText(file);
  };

  const loadSample = (key: keyof typeof SAMPLE_PRESETS) => {
    setYamlInput(SAMPLE_PRESETS[key]);
  };

  const inputLineCount = yamlInput ? yamlInput.split("\n").length : 0;
  const outputLineCount = jsonOutput ? jsonOutput.split("\n").length : 0;

  return (
    <div className="w-full space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-sm">
        {/* Presets and Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase">Load Preset:</span>
          <button
            onClick={() => loadSample("k8s")}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Kubernetes Pod
          </button>
          <button
            onClick={() => loadSample("dockerCompose")}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Docker Compose
          </button>

          <label
            htmlFor={fileInputId}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-500" />
            <span>Upload .yaml</span>
            <input
              id={fileInputId}
              type="file"
              accept=".yaml,.yml,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Indent Options & Clear */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => {
                const val = e.target.value;
                setIndent(val === "compact" ? "compact" : parseInt(val, 10));
              }}
              className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs font-medium focus:outline-hidden"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="compact">Compact (Minified)</option>
            </select>
          </div>

          <button
            onClick={() => setYamlInput("")}
            className="p-1.5 text-zinc-500 hover:text-red-600 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/60 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-bold">YAML Parse Error</span>
            {error.line && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 font-mono text-[11px]">
                Line {error.line}{error.col ? `:${error.col}` : ""}
              </span>
            )}
            <p className="mt-1 font-mono text-[11px] whitespace-pre-wrap">{error.message}</p>
          </div>
        </div>
      )}

      {/* Editor Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* YAML Input Pane */}
        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs focus-within:border-indigo-500 transition-colors">
          <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-600" />
              YAML Input
            </span>
            <span className="text-zinc-400">{inputLineCount} lines &bull; {yamlInput.length} chars</span>
          </div>
          <textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="Paste your YAML code here..."
            spellCheck={false}
            className="w-full h-[420px] p-4 font-mono text-xs md:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 resize-none focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* JSON Output Pane */}
        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              JSON Output
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 mr-2">{outputLineCount} lines</span>
              <button
                onClick={handleCopy}
                disabled={!jsonOutput}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!jsonOutput}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={jsonOutput}
            placeholder="JSON output will appear here automatically..."
            spellCheck={false}
            className="w-full h-[420px] p-4 font-mono text-xs md:text-sm bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-100 resize-none focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

