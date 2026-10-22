import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Wrench, Shield, Zap, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-zinc-900 dark:text-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span>
            Dev<span className="text-indigo-600 dark:text-indigo-400">Tool</span>Box
          </span>
        </Link>

        {/* Category Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Badges / Shortcuts */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Private</span>
          </div>

          <Link
            href="/#tools"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore All</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

