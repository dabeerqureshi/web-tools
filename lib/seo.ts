import { siteConfig } from "@/config/site";
import { ToolMeta } from "@/config/tools-registry";

export function generateToolJsonLd(tool: ToolMeta) {
  const toolUrl = `${siteConfig.url}/${tool.slug}`;

  const schemas: any[] = [
    // 1. WebApplication Schema
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.title,
      url: toolUrl,
      description: tool.metaDescription,
      applicationCategory: tool.categoryName,
      operatingSystem: "All (Web Browser)",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: tool.features.join(", "),
    },

    // 2. HowTo Schema
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: tool.howTo.title,
      description: tool.howTo.description,
      step: tool.howTo.steps.map((step, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: step.name,
        text: step.text,
      })),
    },

    // 3. FAQPage Schema
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },

    // 4. BreadcrumbList Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: tool.categoryName,
          item: `${siteConfig.url}/category/${tool.category}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.shortTitle,
          item: toolUrl,
        },
      ],
    },
  ];

  return schemas;
}

