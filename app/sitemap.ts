import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { toolsRegistry } from "@/config/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Home route
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Category routes
  for (const cat of siteConfig.categories) {
    routes.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Tool routes
  for (const tool of toolsRegistry) {
    routes.push({
      url: `${baseUrl}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return routes;
}

