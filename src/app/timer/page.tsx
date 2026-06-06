import { Suspense } from "react";
import TimerClient from "./timer-client";

export default function TimerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
          <div className="text-white/50 text-sm font-semibold uppercase tracking-widest">Timer</div>
          <div className="font-mono text-white text-8xl font-black" style={{ fontVariantNumeric: "tabular-nums" }}>
            00:00
          </div>
        </div>
      }
    >
      <TimerClient />
    </Suspense>
  );
}
