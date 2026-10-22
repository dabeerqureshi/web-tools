"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { toolsRegistry } from "@/config/tools-registry";
import { AdSlot } from "@/components/layout/ad-slot";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  FileCode2,
  FileJson,
  Image as ImageIcon,
  Receipt,
  Layers,
  Lock,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTools = toolsRegistry.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-radial from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation 100% Client-Side Web Tools</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Fast, Private &amp; Instant{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Web Utilities
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Convert YAML to JSON, extract Photoshop PSD layers to PNG, and parse bank statement PDFs to CSV. Zero files uploaded to any server. Everything executes locally in your browser.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Private (No Cloud Uploads)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Sub-Millisecond Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>No Sign-Up or Limits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Directory Section */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. yaml, psd, bank statement)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-indigo-500 transition-colors shadow-xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              All Tools ({toolsRegistry.length})
            </button>
            {siteConfig.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-xs hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {tool.categoryName}
                  </span>
                  {tool.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.shortTitle}
                </h3>

                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  {tool.metaDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tool.keywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-normal">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  100% In-Browser
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            No tools found matching &quot;{searchQuery}&quot;. Try another search term.
          </div>
        )}
      </section>

      {/* Monetization Slot */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot slotId="home-banner" format="horizontal" />
      </div>

      {/* Trust & Architecture Showcase (High GEO Information Gain) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Why Client-Side Web Tools Are the Future
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Traditional converter websites upload your files to remote cloud servers where your proprietary code, customer graphics, and financial records might be logged. We rebuilt everything to run directly inside your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Absolute Privacy</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Bank statements, credentials, and Photoshop designs never leave your device. Safe for regulated corporate environments and sensitive personal documents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">No File Size Limits</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Serverless upload bottlenecks and 4.5MB request limits do not apply. Process 200MB+ PSD files and multi-megabyte JSON configurations without timeouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Zero Wait Queue</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                No waiting for remote worker queues or cloud conversions. Conversions execute instantly with real-time keystroke feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

