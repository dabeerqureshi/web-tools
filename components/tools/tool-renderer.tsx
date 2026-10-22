"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center flex flex-col items-center justify-center space-y-3">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="text-sm text-zinc-500 font-medium">Initializing client-side engine...</span>
  </div>
);

// Dynamic imports with ssr: false for canvas and file binary safety
const YamlToJsonTool = dynamic(
  () => import("@/components/tools/yaml-json/yaml-to-json-tool").then((mod) => mod.YamlToJsonTool),
  { ssr: false, loading: LoadingFallback }
);

const JsonToYamlTool = dynamic(
  () => import("@/components/tools/yaml-json/json-to-yaml-tool").then((mod) => mod.JsonToYamlTool),
  { ssr: false, loading: LoadingFallback }
);

const JsonFormatterTool = dynamic(
  () => import("@/components/tools/yaml-json/json-formatter-tool").then((mod) => mod.JsonFormatterTool),
  { ssr: false, loading: LoadingFallback }
);

const YamlValidatorTool = dynamic(
  () => import("@/components/tools/yaml-json/yaml-validator-tool").then((mod) => mod.YamlValidatorTool),
  { ssr: false, loading: LoadingFallback }
);

const PsdToPngTool = dynamic(
  () => import("@/components/tools/psd-png/psd-to-png-tool").then((mod) => mod.PsdToPngTool),
  { ssr: false, loading: LoadingFallback }
);

const BankStatementTool = dynamic(
  () => import("@/components/tools/bank-statement/bank-statement-tool").then((mod) => mod.BankStatementTool),
  { ssr: false, loading: LoadingFallback }
);

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  switch (slug) {
    case "yaml-to-json":
      return <YamlToJsonTool />;
    case "json-to-yaml":
      return <JsonToYamlTool />;
    case "json-formatter":
      return <JsonFormatterTool />;
    case "yaml-validator":
      return <YamlValidatorTool />;
    case "psd-to-png":
      return <PsdToPngTool />;
    case "bank-statement-pdf-to-csv":
      return <BankStatementTool />;
    default:
      return (
        <div className="p-8 text-center text-zinc-500">
          Tool implementation coming soon.
        </div>
      );
  }
}

