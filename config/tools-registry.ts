export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  name: string;
  text: string;
}

export interface ToolComparisonRow {
  feature: string;
  col1: string;
  col2: string;
}

export interface ToolMeta {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: "developer-tools" | "design-tools" | "finance-tools";
  categoryName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  icon: string;
  badge?: string;
  directAnswer: string;
  features: string[];
  howTo: {
    title: string;
    description: string;
    steps: ToolHowToStep[];
  };
  faqs: ToolFaq[];
  comparison?: {
    title: string;
    col1Header: string;
    col2Header: string;
    rows: ToolComparisonRow[];
  };
  relatedToolSlugs: string[];
}

export const toolsRegistry: ToolMeta[] = [
  // --- Phase 1: YAML to JSON & Developer Sibling Tools ---
  {
    id: "yaml-to-json",
    slug: "yaml-to-json",
    title: "YAML to JSON Converter (Free, Instant & Private)",
    shortTitle: "YAML to JSON",
    category: "developer-tools",
    categoryName: "Developer Tools",
    metaTitle: "YAML to JSON Converter - Instant, Free & 100% Client-Side",
    metaDescription: "Convert YAML to JSON in real time with line-by-line syntax error highlighting, indentation controls, and instant copy/download. Runs 100% in your browser.",
    keywords: ["yaml to json", "convert yaml to json", "yaml to json converter", "yaml parser", "kubernetes yaml to json", "docker compose to json"],
    icon: "FileCode2",
    badge: "Popular",
    directAnswer: "To convert YAML to JSON, paste or upload your YAML code into the left editor pane. The tool instantly parses the syntax, identifies any errors with line numbers, and outputs valid, beautified JSON formatted according to your selected indentation preference.",
    features: [
      "Real-time keystroke conversion with sub-millisecond response",
      "Precise syntax error detection with line & column pointers",
      "Supports multi-document YAML and complex nested data structures",
      "Indentation settings: 2 spaces, 4 spaces, tabs, or minified JSON",
      "100% client-side: your data is never sent to any server",
      "Preloaded samples: Kubernetes Pod, Docker Compose, OpenAPI spec"
    ],
    howTo: {
      title: "How to Convert YAML to JSON in 3 Quick Steps",
      description: "Follow this simple workflow to transform any YAML configuration into valid JSON format.",
      steps: [
        {
          name: "Step 1: Paste or Upload YAML",
          text: "Copy your YAML text and paste it into the input editor, or click 'Upload File' to select a .yaml or .yml file."
        },
        {
          name: "Step 2: Check Validation & Customize Output",
          text: "Review the real-time syntax checker. Choose your desired indentation level (2 spaces, 4 spaces, or compact)."
        },
        {
          name: "Step 3: Copy or Download JSON",
          text: "Click 'Copy JSON' to copy the result directly to your clipboard, or click 'Download' to save as a .json file."
        }
      ]
    },
    faqs: [
      {
        question: "Is this YAML to JSON converter secure?",
        answer: "Yes, 100%. The conversion runs completely within your web browser using JavaScript. No code, configuration files, or tokens are ever sent to any remote server or stored in any database."
      },
      {
        question: "How does this tool handle YAML syntax errors?",
        answer: "The built-in parser immediately analyzes your YAML as you type. If an indentation, missing colon, or quoting error is encountered, an error alert highlights the exact line and column number with an actionable fix description."
      },
      {
        question: "Does it support Kubernetes and Docker Compose YAML?",
        answer: "Yes, full support is included for complex Kubernetes manifests, Helm charts, Docker Compose files, GitHub Actions workflows, and OpenAPI/Swagger specifications."
      },
      {
        question: "What is the difference between YAML and JSON?",
        answer: "YAML (YAML Ain't Markup Language) is a human-friendly data serialization standard that uses whitespace indentation and supports comments. JSON (JavaScript Object Notation) is a strict, bracket-based format universally supported across web APIs and programming languages."
      }
    ],
    comparison: {
      title: "YAML vs JSON Comparison",
      col1Header: "YAML",
      col2Header: "JSON",
      rows: [
        { feature: "Syntax Style", col1: "Indentation-based (whitespace sensitive)", col2: "Brackets and braces (strictly defined)" },
        { feature: "Comments", col1: "Supported (using #)", col2: "Not supported by standard specification" },
        { feature: "Human Readability", col1: "High (clean, less boilerplate)", col2: "Moderate (verbose punctuation)" },
        { feature: "Machine Speed", col1: "Slightly slower parsing overhead", col2: "Extremely fast native parsing" },
        { feature: "Primary Use Cases", col1: "DevOps, CI/CD, Kubernetes, Docker, Configs", col2: "REST APIs, Web Services, Data Storage" }
      ]
    },
    relatedToolSlugs: ["json-to-yaml", "json-formatter", "yaml-validator"]
  },
  {
    id: "json-to-yaml",
    slug: "json-to-yaml",
    title: "JSON to YAML Converter (Instant & Clean)",
    shortTitle: "JSON to YAML",
    category: "developer-tools",
    categoryName: "Developer Tools",
    metaTitle: "JSON to YAML Converter - Clean, Fast & Free Online Tool",
    metaDescription: "Convert JSON to clean, human-readable YAML online. Instant validation, custom indentation, and zero server uploads for total privacy.",
    keywords: ["json to yaml", "convert json to yaml", "json to yaml converter", "json to yml"],
    icon: "FileJson",
    directAnswer: "To convert JSON to YAML, paste your JSON code into the editor. The tool validates the JSON structure and converts it instantly into clean, readable YAML syntax ready for Kubernetes, GitHub Actions, or config files.",
    features: [
      "Instant conversion with live JSON syntax validation",
      "Generates clean, idiomatic YAML without unnecessary quotes",
      "Configurable indent size (2 or 4 spaces)",
      "Zero server transmission — 100% private and offline capable"
    ],
    howTo: {
      title: "How to Convert JSON to YAML",
      description: "Convert JSON payloads into clean YAML in three easy steps.",
      steps: [
        { name: "Step 1: Paste JSON", text: "Paste your JSON object or array into the input pane." },
        { name: "Step 2: Instant Conversion", text: "Watch the clean YAML structure generate instantly on the right." },
        { name: "Step 3: Export", text: "Copy the YAML or download it as a .yaml file." }
      ]
    },
    faqs: [
      {
        question: "Can I convert large JSON files?",
        answer: "Yes, since the conversion runs on your device's browser engine, it can process large multi-megabyte JSON files without hitting server request timeouts."
      },
      {
        question: "Are quotes preserved when converting to YAML?",
        answer: "The converter strips unnecessary quotation marks for clean readability, while preserving quotes around strings that contain special characters, dates, or boolean keywords."
      }
    ],
    relatedToolSlugs: ["yaml-to-json", "json-formatter", "yaml-validator"]
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    title: "JSON Formatter & Validator (Beautify & Minify)",
    shortTitle: "JSON Formatter",
    category: "developer-tools",
    categoryName: "Developer Tools",
    metaTitle: "JSON Formatter & Validator - Beautify, Minify & Fix JSON Online",
    metaDescription: "Format, validate, and beautify messy JSON strings online. Highlight syntax errors, minify for production, and copy with one click.",
    keywords: ["json formatter", "json beautifier", "format json", "json validator", "minify json", "json lint"],
    icon: "Braces",
    directAnswer: "A JSON Formatter takes raw, unformatted, or minified JSON strings and organizes them into clean, human-readable structures with proper indentation, syntax highlighting, and error validation.",
    features: [
      "Beautify with 2 spaces, 4 spaces, or Tabs",
      "One-click minifier to compress JSON payloads for production APIs",
      "Deep syntax error detection with line pointers",
      "Character, line, and byte size counter"
    ],
    howTo: {
      title: "How to Beautify and Validate JSON",
      description: "Format unreadable JSON into clean, indented code.",
      steps: [
        { name: "Step 1: Input JSON", text: "Paste your raw JSON into the editor." },
        { name: "Step 2: Choose Format", text: "Click 'Format (2 spaces)', 'Format (4 spaces)', or 'Minify'." },
        { name: "Step 3: Copy or Save", text: "Use the copy button or download the formatted file." }
      ]
    },
    faqs: [
      {
        question: "How do I fix 'Unexpected token' JSON errors?",
        answer: "Our validator points to the exact line and character where the error occurs, usually caused by trailing commas, unquoted keys, or single quotes instead of double quotes."
      }
    ],
    relatedToolSlugs: ["yaml-to-json", "json-to-yaml"]
  },
  {
    id: "yaml-validator",
    slug: "yaml-validator",
    title: "YAML Validator & Linter (Online Syntax Checker)",
    shortTitle: "YAML Validator",
    category: "developer-tools",
    categoryName: "Developer Tools",
    metaTitle: "YAML Validator & Linter - Online Syntax Checker with Error Line Numbers",
    metaDescription: "Validate YAML files and configurations online. Get instant syntax error checks with line and column highlighting. 100% private.",
    keywords: ["yaml validator", "yaml linter", "validate yaml", "yaml syntax checker", "kubernetes yaml validator"],
    icon: "CheckCircle2",
    directAnswer: "A YAML Validator analyzes YAML files against the official YAML 1.2 specification, identifying bad indentation, invalid mappings, duplicate keys, and syntax mistakes before they break CI/CD pipelines.",
    features: [
      "Pinpoints indentation and spacing errors instantly",
      "Validates multi-document YAML (separated by ---)",
      "Strict schema checking compliant with YAML 1.2"
    ],
    howTo: {
      title: "How to Validate YAML Syntax",
      description: "Ensure your YAML is 100% error-free.",
      steps: [
        { name: "Step 1: Paste YAML", text: "Paste your YAML file contents." },
        { name: "Step 2: Inspect Validation", text: "View instant green confirmation or red line-specific error notes." },
        { name: "Step 3: Fix & Copy", text: "Correct issues in place and copy your verified clean YAML." }
      ]
    },
    faqs: [
      {
        question: "Why does YAML fail on tabs?",
        answer: "The YAML specification strictly forbids tab characters for indentation because different editors display tabs with varying widths. Always use spaces (standard is 2 spaces)."
      }
    ],
    relatedToolSlugs: ["yaml-to-json", "json-to-yaml"]
  },

  // --- Phase 2: PSD to PNG Design Tool ---
  {
    id: "psd-to-png",
    slug: "psd-to-png",
    title: "PSD to PNG Converter (Preserve Transparency & Layers)",
    shortTitle: "PSD to PNG",
    category: "design-tools",
    categoryName: "Design Tools",
    metaTitle: "PSD to PNG Converter - Free Online, Transparent & 100% Private",
    metaDescription: "Convert Photoshop PSD and PSB files to transparent PNG online without Adobe Photoshop. Inspect individual layers, preview composite designs, and download without server uploads.",
    keywords: ["psd to png", "convert psd to png", "psd converter online", "photoshop to png transparent", "psd viewer online", "psd without photoshop"],
    icon: "Image",
    badge: "High Demand",
    directAnswer: "To convert a Photoshop PSD file to PNG online without Adobe Photoshop, drop your .psd or .psb file into the converter. The browser parses the Photoshop binary data directly using HTML5 Canvas, renders the full composite image with transparent background preservation, and lets you download individual layers or the complete graphic.",
    features: [
      "Convert PSD and PSB files directly in your browser without Adobe Photoshop",
      "Full transparency preservation with checkerboard preview",
      "Layer Inspector: view, preview, and download individual isolated layers",
      "Download full composite PNG or all layers as a ZIP archive",
      "100% Private: your proprietary design files never leave your computer",
      "No file size limit — handles large 100MB+ design files smoothly"
    ],
    howTo: {
      title: "How to Convert PSD to PNG without Photoshop",
      description: "Turn Adobe Photoshop files into high-resolution transparent PNG images in three steps.",
      steps: [
        {
          name: "Step 1: Upload Your PSD File",
          text: "Drag and drop your .psd or .psb file into the upload zone or click 'Browse Files'."
        },
        {
          name: "Step 2: Preview Composite & Inspect Layers",
          text: "Preview the rendered composite image on a transparency grid. Review individual layers in the Layer Inspector panel."
        },
        {
          name: "Step 3: Download Transparent PNG or ZIP",
          text: "Click 'Download Full PNG' for the flattened image, or download individual layer assets."
        }
      ]
    },
    faqs: [
      {
        question: "Can I convert PSD to PNG without Adobe Photoshop installed?",
        answer: "Yes! Our tool parses Photoshop's proprietary binary format directly in your web browser using HTML5 Canvas APIs, meaning you do not need Adobe Photoshop, Creative Cloud, or any paid subscription."
      },
      {
        question: "Does it preserve transparency from the Photoshop file?",
        answer: "Yes. If your PSD document contains transparent layers or has no opaque background fill, the resulting PNG output preserves the exact 32-bit alpha channel transparency."
      },
      {
        question: "Are my confidential client designs safe?",
        answer: "Absolutely. Unlike traditional online converters that upload your files to external cloud servers where they could be logged or stored, this tool processes 100% of the image data locally on your device. Zero bytes are uploaded to the internet."
      },
      {
        question: "What is the maximum PSD file size supported?",
        answer: "Because processing happens locally on your computer's RAM rather than a constrained serverless function, files up to 200MB+ can easily be rendered depending on your computer's memory."
      }
    ],
    comparison: {
      title: "PSD vs PNG Format Comparison",
      col1Header: "PSD (Adobe Photoshop Document)",
      col2Header: "PNG (Portable Network Graphics)",
      rows: [
        { feature: "Layers & Editing", col1: "Supports multiple editable layers, masks, smart objects", col2: "Flattened raster graphic (single layer)" },
        { feature: "Transparency", col1: "Supported per layer & composite", col2: "Full 8-bit & 24/32-bit alpha transparency" },
        { feature: "Web Compatibility", col1: "Cannot be displayed in web browsers natively", col2: "Supported natively by 100% of modern web browsers" },
        { feature: "File Size", col1: "Very large (often 50MB - 1GB+)", col2: "Optimized, lossless compression" },
        { feature: "Software Requirement", col1: "Requires Photoshop or specialized viewer", col2: "Universal viewing on all devices & operating systems" }
      ]
    },
    relatedToolSlugs: ["yaml-to-json", "bank-statement-pdf-to-csv"]
  },

  // --- Phase 3: Bank Statement PDF to CSV Finance Tool ---
  {
    id: "bank-statement-pdf-to-csv",
    slug: "bank-statement-pdf-to-csv",
    title: "Bank Statement PDF to CSV Converter (100% Private & Client-Side)",
    shortTitle: "Bank Statement to CSV",
    category: "finance-tools",
    categoryName: "Finance Tools",
    metaTitle: "Bank Statement PDF to CSV Converter - Free, Private & Secure Online",
    metaDescription: "Convert bank statement PDFs to CSV, Excel, or JSON format. 100% client-side privacy guarantee: your financial data never leaves your browser.",
    keywords: ["bank statement pdf to csv", "convert bank statement to csv", "pdf bank statement converter", "bank statement to excel", "bank pdf to csv free", "statement converter without uploading"],
    icon: "Receipt",
    badge: "High Value",
    directAnswer: "To convert a bank statement PDF to CSV without uploading sensitive financial documents to third-party servers, drop your statement PDF into our client-side parser. The tool extracts transaction dates, descriptions, deposits, withdrawals, and running balances directly inside your browser memory, formats them into a clean table, and lets you download a verified CSV file.",
    features: [
      "Zero-Knowledge Security: Bank statements NEVER leave your computer or touch any server",
      "Automatic transaction table extraction: Date, Description, Amount, and Balance",
      "Supports multi-page statement PDFs from major banks (Chase, BoA, Wells Fargo, Barclays, etc.)",
      "Interactive table editor: rename columns, delete unwanted headers/disclaimers before export",
      "Instant export to RFC-compliant CSV, Excel-ready format, or JSON",
      "Free forever with no email registration or credit card required"
    ],
    howTo: {
      title: "How to Convert Bank Statement PDF to CSV Safely",
      description: "Extract clean financial transaction rows into Excel or accounting software.",
      steps: [
        {
          name: "Step 1: Select Bank Statement PDF",
          text: "Upload or drop your statement PDF file into the secure local converter."
        },
        {
          name: "Step 2: Review Extracted Transactions",
          text: "Inspect the detected transactions in the interactive data grid. Filter out non-transaction header lines if needed."
        },
        {
          name: "Step 3: Download Clean CSV",
          text: "Click 'Download CSV' to import directly into QuickBooks, Xero, Excel, or Google Sheets."
        }
      ]
    },
    faqs: [
      {
        question: "Is it safe to convert my bank statement here?",
        answer: "Yes, completely safe. Unlike other converter websites that send your PDF to a remote cloud server where sensitive account numbers and personal information could be leaked, this tool uses Mozilla's PDF.js library to parse the PDF entirely within your browser sandbox. Your statement never touches our servers."
      },
      {
        question: "Can I import the CSV into QuickBooks, Xero, or Excel?",
        answer: "Yes! The exported CSV follows the standard RFC 4180 format with clean Date, Description, Amount, and Balance columns, compatible with QuickBooks, Xero, Wave, Quicken, Excel, and Google Sheets."
      },
      {
        question: "What banks are supported?",
        answer: "Our parser works with digital text-based PDF statements from almost all financial institutions worldwide, including Chase, Bank of America, Wells Fargo, Citibank, Capital One, HSBC, Barclays, Revolut, and local credit unions."
      },
      {
        question: "What if my statement is a scanned image or photo?",
        answer: "This tool extracts native digital text from generated PDFs. If your statement is a flat scanned photocopy without embedded selectable text, it requires an OCR (Optical Character Recognition) step first."
      }
    ],
    comparison: {
      title: "PDF Statement vs CSV Spreadsheet Comparison",
      col1Header: "Bank PDF Statement",
      col2Header: "Extracted CSV File",
      rows: [
        { feature: "Data Editability", col1: "Locked, non-editable document", col2: "Fully editable spreadsheet cells" },
        { feature: "Accounting Software Import", col1: "Cannot be imported directly into QuickBooks/Xero", col2: "Native one-click import into all accounting tools" },
        { feature: "Calculations & Formulas", col1: "Manual re-typing required", col2: "Instant SUM, AVERAGE, and pivot tables" },
        { feature: "Storage & Automation", col1: "Heavy binary format", col2: "Lightweight plain text, scriptable with Python/Excel" }
      ]
    },
    relatedToolSlugs: ["yaml-to-json", "psd-to-png"]
  }
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return toolsRegistry.filter((t) => t.category === category);
}

