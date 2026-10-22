"use client";

import React, { useState, useEffect } from "react";
import { validateYaml, SAMPLE_PRESETS } from "@/lib/parsers/yaml-parser";
import { CheckCircle2, AlertCircle, Trash2, FileCheck2 } from "lucide-react";

export function YamlValidatorTool() {
  const [yamlText, setYamlText] = useState<string>(SAMPLE_PRESETS.k8s);
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
    line?: number;
    col?: number;
    docCount: number;
  }>({ valid: true, docCount: 1 });

  useEffect(() => {
    const res = validateYaml(yamlText);
    setValidation(res);
  }, [yamlText]);

  return (
    <div className="w-full space-y-4">
      {/* Status Alert */}
      {validation.valid ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-950/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Valid YAML Syntax ({validation.docCount} {validation.docCount === 1 ? "document" : "documents"} detected)
            </span>
          </div>
          <button
            onClick={() => setYamlText("")}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 font-medium"
          >
            Clear Text
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/60 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">YAML Syntax Error</span>
              {validation.line && (
                <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 font-mono text-[11px]">
                  Line {validation.line}{validation.col ? `:${validation.col}` : ""}
                </span>
              )}
            </div>
            <p className="font-mono text-xs whitespace-pre-wrap">{validation.error}</p>
          </div>
        </div>
      )}

      {/* Editor Box */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            YAML Live Linter
          </span>
          <span>{yamlText ? yamlText.split("\n").length : 0} lines</span>
        </div>
        <textarea
          value={yamlText}
          onChange={(e) => setYamlText(e.target.value)}
          placeholder="Paste YAML to validate syntax..."
          spellCheck={false}
          className="w-full h-[450px] p-4 font-mono text-xs md:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 resize-none focus:outline-hidden leading-relaxed"
        />
      </div>
    </div>
  );
}

