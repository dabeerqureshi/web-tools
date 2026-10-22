# DevToolBox — High-Performance Web Tools Platform

A fast, scalable, and privacy-first web tools portal built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. Optimized for top rankings on Google Search (**SEO**) and Generative AI engines (**GEO - Perplexity, ChatGPT Search, Gemini, Google SGE**).

---

## 🚀 Key Advantages & Architecture

1. **100% Client-Side Computation (Zero Server Uploads)**
   - All conversions run in the visitor's browser memory via Web APIs, HTML5 Canvas, and Web Workers.
   - **$0 Server Compute Costs**: Works smoothly on Vercel's free hobby tier or pro tier.
   - **Privacy Guarantee**: Proprietary Photoshop designs and sensitive bank statements never leave the user's computer.

2. **SEO & GEO (Generative Engine Optimization)**
   - Dynamic JSON-LD structured schemas (`WebApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`).
   - Direct-answer summary blocks and comparison tables structured for AI search citations.
   - Automated `sitemap.xml` and `robots.txt`.
   - Dynamic OpenGraph preview cards (`/[tool]/opengraph-image`).

3. **Core Web Vitals & Speed**
   - 100% static HTML generation (SSG) for tool and category pages.
   - Dynamic client imports for heavy tool logic (`ag-psd`, `pdfjs-dist`).
   - Zero-CLS (Cumulative Layout Shift) ad slot containers.

4. **Monetization Ready**
   - Non-intrusive ad containers (`components/layout/ad-slot.tsx`) ready for Google AdSense or EthicalAds.

---

## 🛠️ Implemented Tools Suite

### Phase 1 — Developer Tools Suite
- **YAML to JSON Converter (`/yaml-to-json`)**: Instant keystroke conversion, line & column syntax error highlighting, indentation controls (2, 4 spaces, compact), preloaded presets (Kubernetes, Docker Compose), copy & download.
- **JSON to YAML Converter (`/json-to-yaml`)**: Live conversion, idiomatic YAML output, configurable indentation.
- **JSON Formatter & Minifier (`/json-formatter`)**: Beautify with custom indentations, 1-click minifier, error pointers.
- **YAML Validator & Linter (`/yaml-validator`)**: Real-time syntax validation with multi-document support.

### Phase 2 — Design Tools Suite
- **PSD to PNG Converter (`/psd-to-png`)**: In-browser Photoshop binary parser (`ag-psd`), alpha transparency preservation with checkerboard grid, full composite export, Layer Inspector, and 1-click Download All Layers as ZIP (`jszip`).

### Phase 3 — Finance Tools Suite
- **Bank Statement PDF to CSV (`/bank-statement-pdf-to-csv`)**: Digital PDF text extraction (`pdfjs-dist`), heuristic table extraction for Date, Description, Amount, and Balance, interactive editable grid, and RFC-4180 CSV / JSON download.

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete web tools portal with Phase 1, 2, and 3 tools"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `web-tools` repository.
4. Framework preset will automatically detect **Next.js**.
5. Click **Deploy**!

---

## ➕ Adding New Tools in Minutes

To add a new tool to the platform:
1. Open `config/tools-registry.ts` and add your tool definition to `toolsRegistry` (title, slug, category, SEO meta, How-To steps, FAQs).
2. Create your tool component in `components/tools/your-tool-folder/`.
3. Register the component in `components/tools/tool-renderer.tsx`.

The dynamic router (`app/[tool]/page.tsx`), static site generator (`generateStaticParams`), dynamic sitemap (`app/sitemap.ts`), and OpenGraph image generator (`app/[tool]/opengraph-image.tsx`) will automatically discover and pre-render your new tool page at build time!
