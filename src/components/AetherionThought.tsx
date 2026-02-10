"use client";

import { useGame } from "@/components/GameProvider";
import { Brain } from "lucide-react";

export function AetherionThought() {
  const { aetherionThought } = useGame();

  return (
    <div className="rounded-xl border border-border-400 border-alert-content-100/30 bg-bg-800 shadow-elevated-card">
      <div className="flex items-center gap-2 border-b border-border-400 bg-bg-900/80 px-4 py-2">
        <Brain className="h-4 w-4 text-alert-content-100" />
        <h2 className="text-content-200 font-medium">Thought process</h2>
      </div>
      <div className="px-4 py-3">
        <p className="text-content-200 text-sm">{aetherionThought}</p>
      </div>
    </div>
  );
}
