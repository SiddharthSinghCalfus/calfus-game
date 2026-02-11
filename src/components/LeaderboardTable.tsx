"use client";

import { useGame } from "@/components/GameProvider";
import { Cpu } from "lucide-react";

export function LeaderboardTable() {
  const { participants } = useGame();

  const sorted = [...participants].sort((a, b) => b.points - a.points);

  return (
    <div className="overflow-hidden rounded-xl border border-border-400 bg-bg-800 shadow-elevated-card">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-400 bg-bg-700">
            <th className="px-4 py-3 text-content-300 font-medium">Rank</th>
            <th className="px-4 py-3 text-content-300 font-medium">Name</th>
            <th className="px-4 py-3 text-content-300 font-medium">Roll No.</th>
            <th className="px-4 py-3 text-content-300 font-medium text-right" title="Sorted by points, highest first">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr
              key={p.id}
              className={
                p.isAi
                  ? "border-b border-border-400 bg-bg-900/50 text-content-100 [box-shadow:0_0_12px_rgba(83,163,55,0.2)]"
                  : "border-b border-border-400 bg-bg-800 text-content-100"
              }
            >
              <td className="px-4 py-3 font-medium">{i + 1}</td>
              <td className="px-4 py-3 flex items-center gap-2">
                {p.isAi && (
                  <span className="inline-flex items-center gap-1 rounded bg-bg-1200/30 px-2 py-0.5 text-alert-content-100 text-xs font-medium">
                    <Cpu className="h-3 w-3" />
                    AI
                  </span>
                )}
                {p.name}
              </td>
              <td className="px-4 py-3 text-content-300">{p.rollNumber || "—"}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {p.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
