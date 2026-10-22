import React from "react";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
        <Wrench className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Tool Not Found
        </h1>
        <p className="text-sm text-zinc-500">
          The requested tool page doesn&apos;t exist or has been relocated.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to All Tools</span>
      </Link>
    </div>
  );
}

