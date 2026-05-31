import { Suspense } from "react";
import TimerClient from "./timer-client";

export default function TimerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
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
