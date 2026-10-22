"use client";

import React, { useState, useRef, useId } from "react";
import { parsePsdFile, canvasToBlob, createLayersZip, ParsedPsd, PsdLayerItem } from "@/lib/parsers/psd-parser";
import { formatBytes, downloadFile } from "@/lib/utils";
import {
  Upload,
  Download,
  Layers,
  Sparkles,
  Eye,
  Archive,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export function PsdToPngTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [psdData, setPsdData] = useState<ParsedPsd | null>(null);
  const [activeTab, setActiveTab] = useState<"composite" | "layers">("composite");
  const [selectedLayer, setSelectedLayer] = useState<PsdLayerItem | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const fileInputId = useId();

  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;

    // Check extension
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "psd" && ext !== "psb") {
      setError("Please select a valid Adobe Photoshop (.psd or .psb) file.");
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setPsdData(null);
    setSelectedLayer(null);

    try {
      const parsed = await parsePsdFile(selectedFile);
      setPsdData(parsed);
      if (parsed.layers.length > 0) {
        setSelectedLayer(parsed.layers[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Could not parse PSD file. Ensure the file has valid Photoshop composite or layer data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadComposite = async () => {
    if (!psdData?.compositeCanvas) return;
    try {
      const blob = await canvasToBlob(psdData.compositeCanvas);
      const name = file ? file.name.replace(/\.[^/.]+$/, "") + "-composite.png" : "export.png";
      downloadFile(blob, name, "image/png");
    } catch (e: any) {
      alert("Failed to export PNG: " + e.message);
    }
  };

  const handleDownloadLayer = async (layer: PsdLayerItem) => {
    if (!layer.canvas) return;
    try {
      const blob = await canvasToBlob(layer.canvas);
      const safeName = `${layer.name.replace(/[^a-z0-9_-]/gi, "_")}.png`;
      downloadFile(blob, safeName, "image/png");
    } catch (e: any) {
      alert("Failed to export layer: " + e.message);
    }
  };

  const handleDownloadZip = async () => {
    if (!psdData || psdData.layers.length === 0) return;
    setIsZipping(true);
    try {
      const zipBlob = await createLayersZip(psdData.layers, file?.name.replace(/\.[^/.]+$/, "") || "layers");
      downloadFile(zipBlob, `${file?.name.replace(/\.[^/.]+$/, "") || "psd"}-layers.zip`, "application/zip");
    } catch (e: any) {
      alert("Failed to generate ZIP: " + e.message);
    } finally {
      setIsZipping(false);
    }
  };

  // Create an interactive demo PSD right on client canvas if user doesn't have a PSD handy
  const handleLoadDemo = () => {
    // Generate a mock multi-layer parsed object for instant preview
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw transparent geometric logo
      ctx.clearRect(0, 0, 600, 400);

      // Gradient circle
      const grad = ctx.createLinearGradient(150, 100, 450, 300);
      grad.addColorStop(0, "#6366f1");
      grad.addColorStop(1, "#a855f7");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(300, 200, 110, 0, Math.PI * 2);
      ctx.fill();

      // Transparent cutout inner star
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(300, 200, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DEVTOOLBOX PSD DEMO", 300, 360);
    }

    const layer1Canvas = document.createElement("canvas");
    layer1Canvas.width = 600;
    layer1Canvas.height = 400;
    const l1Ctx = layer1Canvas.getContext("2d");
    if (l1Ctx) {
      const grad = l1Ctx.createLinearGradient(150, 100, 450, 300);
      grad.addColorStop(0, "#6366f1");
      grad.addColorStop(1, "#a855f7");
      l1Ctx.fillStyle = grad;
      l1Ctx.beginPath();
      l1Ctx.arc(300, 200, 110, 0, Math.PI * 2);
      l1Ctx.fill();
    }

    const layer2Canvas = document.createElement("canvas");
    layer2Canvas.width = 600;
    layer2Canvas.height = 400;
    const l2Ctx = layer2Canvas.getContext("2d");
    if (l2Ctx) {
      l2Ctx.fillStyle = "#ffffff";
      l2Ctx.font = "bold 20px sans-serif";
      l2Ctx.textAlign = "center";
      l2Ctx.fillText("DEVTOOLBOX PSD DEMO", 300, 360);
    }

    const demoParsed: ParsedPsd = {
      width: 600,
      height: 400,
      layersCount: 2,
      compositeCanvas: canvas,
      compositeDataUrl: canvas.toDataURL("image/png"),
      layers: [
        {
          id: 1,
          name: "Circle Emblem (Transparent)",
          width: 600,
          height: 400,
          top: 0,
          left: 0,
          opacity: 100,
          hidden: false,
          canvas: layer1Canvas,
          dataUrl: layer1Canvas.toDataURL("image/png"),
        },
        {
          id: 2,
          name: "Text Layer",
          width: 600,
          height: 400,
          top: 0,
          left: 0,
          opacity: 100,
          hidden: false,
          canvas: layer2Canvas,
          dataUrl: layer2Canvas.toDataURL("image/png"),
        },
      ],
    };

    setFile(new File(["demo"], "sample-photoshop-design.psd", { type: "image/vnd.adobe.photoshop" }));
    setPsdData(demoParsed);
    setSelectedLayer(demoParsed.layers[0]);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone */}
      {!psdData && (
        <div className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 sm:p-12 text-center transition-all hover:border-indigo-500">
          <input
            id={fileInputId}
            type="file"
            accept=".psd,.psb"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            Drag &amp; Drop Your Photoshop (.PSD / .PSB) File
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
            Preserves full alpha transparency, renders composite image, and extracts all layers. No file size limits.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label
              htmlFor={fileInputId}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Browse PSD File</span>
            </label>

            <button
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Test with Demo PSD</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side. Your proprietary artwork never leaves your computer.</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h4 className="font-semibold text-zinc-900 dark:text-white">Parsing Photoshop Binary &amp; Layers...</h4>
          <p className="text-xs text-zinc-500">Rendering canvas alpha channels directly in your browser.</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/60 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Conversion Result View */}
      {psdData && (
        <div className="space-y-6">
          {/* Header Info Bar */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <span>{file?.name || "document.psd"}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {psdData.width} &times; {psdData.height} px
                </span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {file ? formatBytes(file.size) : "Sample"} &bull; {psdData.layersCount} layers found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadComposite}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full PNG</span>
              </button>

              {psdData.layers.length > 0 && (
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                  <span>{isZipping ? "Creating ZIP..." : "Download All Layers (ZIP)"}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setPsdData(null);
                  setFile(null);
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("composite")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "composite"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Full Composite Image
            </button>
            <button
              onClick={() => setActiveTab("layers")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "layers"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Layer Inspector ({psdData.layersCount})</span>
            </button>
          </div>

          {/* Composite Preview Pane */}
          {activeTab === "composite" && (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <div className="rounded-xl checkerboard-pattern border border-zinc-200 dark:border-zinc-800 p-8 flex items-center justify-center min-h-[380px] max-h-[600px] overflow-auto">
                {psdData.compositeDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={psdData.compositeDataUrl}
                    alt="PSD Rendered Composite with Transparency"
                    className="max-h-[500px] max-w-full object-contain rounded shadow-lg"
                  />
                ) : (
                  <div className="text-center text-zinc-400 text-sm">
                    No composite image found in PSD header. Please inspect individual layers.
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>Displaying alpha channel transparency on checkerboard pattern</span>
                <button
                  onClick={handleDownloadComposite}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Save as PNG &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Layer Inspector Pane */}
          {activeTab === "layers" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Layers List */}
              <div className="md:col-span-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 max-h-[550px] overflow-y-auto space-y-1">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Document Layers
                </div>
                {psdData.layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedLayer?.id === layer.id
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{layer.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                      {layer.width}&times;{layer.height}
                    </span>
                  </button>
                ))}
              </div>

              {/* Layer Preview & Actions */}
              <div className="md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between">
                {selectedLayer ? (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {selectedLayer.name}
                        </h4>
                        <p className="text-xs text-zinc-500">
                          {selectedLayer.width} &times; {selectedLayer.height} px &bull; Opacity: {selectedLayer.opacity}%
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadLayer(selectedLayer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Layer PNG</span>
                      </button>
                    </div>

                    <div className="my-6 rounded-lg checkerboard-pattern border border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-center min-h-[300px]">
                      {selectedLayer.dataUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedLayer.dataUrl}
                          alt={selectedLayer.name}
                          className="max-h-[280px] max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-zinc-400">Empty or non-rasterized vector layer</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-24 text-zinc-400 text-sm">
                    Select a layer to preview and export
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

