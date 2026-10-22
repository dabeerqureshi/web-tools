import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/config/tools-registry";

export const runtime = "edge";
export const alt = "Web Tool Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);

  const title = tool?.title || "Free Web Tools & Utilities";
  const desc = tool?.metaDescription || "100% Client-Side. Fast, private online web tools.";
  const category = tool?.categoryName || "Developer Utilities";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#09090b",
          color: "#ffffff",
          fontFamily: "sans-serif",
          backgroundImage: "radial-gradient(circle at 100% 0%, #4338ca 0%, transparent 40%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(99, 102, 241, 0.5)",
              color: "#a5b4fc",
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          <div
            style={{
              color: "#10b981",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            • 100% Client-Side &amp; Private
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              lineHeight: "1.4",
              maxWidth: "900px",
            }}
          >
            {desc}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: "30px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              letterSpacing: "-0.02em",
            }}
          >
            Dev<span style={{ color: "#6366f1" }}>Tool</span>Box
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#71717a",
            }}
          >
            Zero Server Uploads • Instant Browser Execution
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

