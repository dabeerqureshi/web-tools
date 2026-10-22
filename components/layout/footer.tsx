import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { toolsRegistry } from "@/config/tools-registry";
import { ShieldCheck, Heart, Wrench, Lock } from "lucide-react";

export function Footer() {
  const devTools = toolsRegistry.filter((t) => t.category === "developer-tools");
  const designTools = toolsRegistry.filter((t) => t.category === "design-tools");
  const financeTools = toolsRegistry.filter((t) => t.category === "finance-tools");

  return (
    <footer className="mt-24 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-black text-lg text-zinc-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span>
                Dev<span className="text-indigo-600 dark:text-indigo-400">Tool</span>Box
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              Fast, privacy-focused online utilities for developers, designers, and accountants. Every single tool runs client-side in your browser with zero server file transfers.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>Zero-knowledge client-side computation guarantee</span>
            </div>
          </div>

          {/* Dev tools links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white mb-4">
              Developer Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              {devTools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {t.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Design tools links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white mb-4">
              Design Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              {designTools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {t.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Finance tools links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white mb-4">
              Finance Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              {financeTools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {t.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Built for speed &amp; Vercel edge deployment</span>
            <span>&bull;</span>
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

