export interface PsdLayerItem {
  id: number;
  name: string;
  width: number;
  height: number;
  top: number;
  left: number;
  opacity: number;
  hidden: boolean;
  canvas?: HTMLCanvasElement;
  dataUrl?: string;
}

export interface ParsedPsd {
  width: number;
  height: number;
  layersCount: number;
  compositeCanvas?: HTMLCanvasElement;
  compositeDataUrl?: string;
  layers: PsdLayerItem[];
}

export async function parsePsdFile(file: File): Promise<ParsedPsd> {
  // Dynamically import ag-psd so it only runs in the browser
  const { readPsd } = await import("ag-psd");

  const arrayBuffer = await file.arrayBuffer();
  // Parse PSD with layer canvases enabled
  const psd = readPsd(arrayBuffer, {
    skipLayerImageData: false,
    skipCompositeImageData: false,
    skipThumbnail: true,
  });

  const width = psd.width || 0;
  const height = psd.height || 0;

  // Composite canvas
  let compositeCanvas = psd.canvas as HTMLCanvasElement | undefined;
  let compositeDataUrl: string | undefined;

  if (compositeCanvas) {
    try {
      compositeDataUrl = compositeCanvas.toDataURL("image/png");
    } catch (e) {
      console.warn("Failed to generate composite data URL", e);
    }
  }

  // Extract layers recursively or flat
  const layers: PsdLayerItem[] = [];

  function processChildren(children: any[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children && child.children.length > 0) {
        processChildren(child.children);
      } else {
        const layerCanvas = child.canvas as HTMLCanvasElement | undefined;
        let dataUrl: string | undefined;
        if (layerCanvas) {
          try {
            dataUrl = layerCanvas.toDataURL("image/png");
          } catch (e) {
            // ignore canvas security errors
          }
        }

        const layerWidth = (child.right ?? 0) - (child.left ?? 0);
        const layerHeight = (child.bottom ?? 0) - (child.top ?? 0);

        layers.push({
          id: layers.length + 1,
          name: child.name || `Layer ${layers.length + 1}`,
          width: layerWidth > 0 ? layerWidth : width,
          height: layerHeight > 0 ? layerHeight : height,
          top: child.top ?? 0,
          left: child.left ?? 0,
          opacity: child.opacity !== undefined ? Math.round(child.opacity * 100) : 100,
          hidden: !!child.hidden,
          canvas: layerCanvas,
          dataUrl,
        });
      }
    }
  }

  if (psd.children && psd.children.length > 0) {
    processChildren(psd.children);
  }

  return {
    width,
    height,
    layersCount: layers.length,
    compositeCanvas,
    compositeDataUrl,
    layers,
  };
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to convert canvas to blob"));
    }, "image/png");
  });
}

export async function createLayersZip(layers: PsdLayerItem[], baseName = "layers"): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const folder = zip.folder(baseName) || zip;

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (layer.canvas) {
      try {
        const blob = await canvasToBlob(layer.canvas);
        const safeName = `${String(i + 1).padStart(2, "0")}_${layer.name.replace(/[^a-z0-9_-]/gi, "_")}.png`;
        folder.file(safeName, blob);
      } catch (e) {
        console.warn(`Could not export layer ${layer.name}`, e);
      }
    }
  }

  return zip.generateAsync({ type: "blob" });
}

