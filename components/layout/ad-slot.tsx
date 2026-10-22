import React from "react";

interface AdSlotProps {
  slotId?: string;
  format?: "horizontal" | "rectangle";
  className?: string;
}

export function AdSlot({ slotId = "default-slot", format = "horizontal", className = "" }: AdSlotProps) {
  // Set fixed minimum heights to avoid CLS (Cumulative Layout Shift)
  const heightClass = format === "horizontal" ? "min-h-[90px] max-h-[120px]" : "min-h-[250px]";

  return (
    <div
      className={`my-8 w-full rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 text-center flex flex-col items-center justify-center transition-colors ${heightClass} ${className}`}
      aria-label="Advertisement container"
    >
      <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
        Advertisement / Sponsored
      </span>
      <div className="mt-1 text-xs text-zinc-500">
        100% Free & Fast Web Tools &bull; Zero Server Uploads &bull; Maximum Privacy
      </div>
    </div>
  );
}

