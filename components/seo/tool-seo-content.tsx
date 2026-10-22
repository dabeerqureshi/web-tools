import React from "react";
import { ToolMeta } from "@/config/tools-registry";
import { CheckCircle2, HelpCircle, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

interface ToolSeoContentProps {
  tool: ToolMeta;
  relatedTools?: ToolMeta[];
}

export function ToolSeoContent({ tool, relatedTools = [] }: ToolSeoContentProps) {
  return (
    <div className="mt-16 space-y-16">
      {/* GEO Direct Answer Block */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 md:p-8 dark:border-indigo-950 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-purple-950/10 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Quick Summary (GEO Direct Answer)</span>
        </div>
        <p className="text-base md:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
          {tool.directAnswer}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 border-t border-indigo-100 dark:border-indigo-950">
          <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>100% Client-Side Privacy:</strong> Zero files or payloads uploaded to any cloud server.</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Sub-Millisecond Speed:</strong> Powered directly by your browser engine.</span>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
          Key Features &amp; Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tool.features.map((feature, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How-To Steps */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
          {tool.howTo.title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          {tool.howTo.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howTo.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                {idx + 1}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2">
                {step.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table if present */}
      {tool.comparison && (
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            {tool.comparison.title}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase font-semibold text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Capability / Aspect</th>
                  <th className="px-6 py-4">{tool.comparison.col1Header}</th>
                  <th className="px-6 py-4">{tool.comparison.col2Header}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                {tool.comparison.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4">{row.col1}</td>
                    <td className="px-6 py-4">{row.col2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FAQ Accordion Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {tool.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs"
            >
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Navigation for Interlinking */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Related Tools You May Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/${rel.slug}`}
                className="group p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {rel.shortTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {rel.metaDescription}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

