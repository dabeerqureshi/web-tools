export const siteConfig = {
  name: "DevToolBox",
  shortName: "DevToolBox",
  description: "Free, lightning-fast, and 100% private developer and designer web tools. Everything runs locally in your browser with zero server uploads.",
  url: "https://usedevtoolbox.com",
  ogImage: "https://usedevtoolbox.com/og.png",
  creator: "DevToolBox Team",
  categories: [
    {
      id: "developer-tools",
      name: "Developer Tools",
      slug: "developer-tools",
      description: "Fast code formatting, conversion, and validation tools for programmers and DevOps engineers.",
      icon: "Code2",
    },
    {
      id: "design-tools",
      name: "Design Tools",
      slug: "design-tools",
      description: "Convert, inspect, and optimize graphics and design files directly in your browser.",
      icon: "Palette",
    },
    {
      id: "finance-tools",
      name: "Finance Tools",
      slug: "finance-tools",
      description: "Secure, client-side financial document converters. Your sensitive data never leaves your device.",
      icon: "Receipt",
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  ads: {
    enabled: true, // Slots are structurally reserved without CLS
  },
};

