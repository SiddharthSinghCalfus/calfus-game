"use client";

import { Radio } from "lucide-react";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 text-content-200 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert-content-100 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-alert-content-100" />
      </span>
      <span className="flex items-center gap-1 font-medium">
        <Radio className="h-4 w-4" />
        Live
      </span>
    </div>
  );
}
