import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { toolsRegistry, getToolBySlug } from "@/config/tools-registry";
import { siteConfig } from "@/config/site";
import { generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { AdSlot } from "@/components/layout/ad-slot";
import { ChevronRight, Shield, Zap, Sparkles } from "lucide-react";

interface ToolPageProps {
  params: Promise<{
    tool: string;
  }>;
}

export async function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    tool: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  const url = `${siteConfig.url}/${tool.slug}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const jsonLd = generateToolJsonLd(tool);
  const relatedTools = (tool.relatedToolSlugs || [])
    .map((s) => getToolBySlug(s))
    .filter(Boolean) as typeof toolsRegistry;

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/category/${tool.category}`}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {tool.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.shortTitle}</span>
        </nav>

        {/* Tool Header */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {tool.categoryName}
            </span>
            {tool.badge && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {tool.badge}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-auto">
              <Shield className="w-3.5 h-3.5" />
              <span>Runs 100% in Browser &bull; Zero Server Uploads</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {tool.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            {tool.metaDescription}
          </p>
        </div>

        {/* The Interactive Tool Component */}
        <div className="my-8">
          <ToolRenderer slug={tool.slug} />
        </div>

        {/* Layout-Shift-Free Monetization Ad Slot */}
        <AdSlot slotId="tool-inline-ad" format="horizontal" />

        {/* Rich SEO & GEO Content, FAQs, How-To & Comparison */}
        <ToolSeoContent tool={tool} relatedTools={relatedTools} />
      </div>
    </>
  );
}

