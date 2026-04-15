"use client";

import { useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatTime, parseConfigFromParams, defaultTimerConfig, flattenSegments, serializeConfigToParams } from "@/lib/timer-utils";
import type { TimerConfig, Segment } from "@/types/timer";

function SettingsPanel({ config, onApply, onClose }: { config: TimerConfig; onApply: (c: TimerConfig) => void; onClose: () => void }) {
  const [local, setLocal] = useState<TimerConfig>({ ...config });
  const [segInput, setSegInput] = useState(config.segments?.map((s) => s.name + ":" + s.durationSec).join("\n") ?? "");
  function set<K extends keyof TimerConfig>(k: K, v: TimerConfig[K]) { setLocal((prev) => ({ ...prev, [k]: v })); }
  function handleApply() {
    const final = { ...local };
    if (final.mode === "segments") {
      const segs: Segment[] = segInput.split("\n").map((l) => l.trim()).filter(Boolean).map((l, i) => { const p = l.split(":"); return { id: String(i + 1), name: p[0]?.trim() || ("Segment " + (i + 1)), durationSec: parseInt(p[1] ?? "60", 10) || 60 }; });
      final.segments = segs.length > 0 ? segs : [{ id: "1", name: "Work", durationSec: 300 }];
    }
    onApply(final); onClose();
  }
  const dMin = Math.floor((local.durationSec ?? 300) / 60);
  const dSec = (local.durationSec ?? 300) % 60;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Timer Settings</h2>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Mode</label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(["countdown", "countup", "segments"] as const).map((m) => (
            <button key={m} onClick={() => set("mode", m)} className={"py-2 rounded-lg text-sm font-semibold transition-all " + (local.mode === m ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>
              {m === "countdown" ? "Countdown" : m === "countup" ? "Count Up" : "Segments"}
            </button>
          ))}
        </div>
        {local.mode === "countdown" && (
          <>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Duration</label>
            <div className="flex gap-3 mb-5">
              <div className="flex items-center gap-1 flex-1">
                <input type="number" min="0" max="99" value={dMin} onChange={(e) => set("durationSec", parseInt(e.target.value || "0", 10) * 60 + dSec)} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-white/20" />
                <span className="text-zinc-500 text-sm">min</span>
              </div>
              <div className="flex items-center gap-1 flex-1">
                <input type="number" min="0" max="59" value={dSec} onChange={(e) => set("durationSec", dMin * 60 + parseInt(e.target.value || "0", 10))} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-white/20" />
                <span className="text-zinc-500 text-sm">sec</span>
              </div>
            </div>
          </>
        )}
        {local.mode === "segments" && (
          <>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Segments <span className="text-zinc-600 normal-case font-normal">(Name:Seconds, one per line)</span></label>
            <textarea rows={5} value={segInput} onChange={(e) => setSegInput(e.target.value)} placeholder={"Warm-up:300\nWork:1500\nBreak:300"} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/20 mb-3" />
            <div className="flex items-center gap-3 mb-5">
              <label className="text-xs text-zinc-400 shrink-0">Rounds</label>
              <input type="number" min="1" max="20" value={local.rounds ?? 1} onChange={(e) => set("rounds", parseInt(e.target.value || "1", 10))} className="w-20 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-center font-mono focus:outline-none focus:ring-2 focus:ring-white/20" />
            </div>
          </>
        )}
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Label (optional)</label>
        <input type="text" value={local.label ?? ""} onChange={(e) => set("label", e.target.value || undefined)} placeholder="e.g. Math Test, HIIT Round 1" className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-white/20" />
        <div className="flex items-center gap-6 mb-6">
          {(["soundEnabled", "flashEnabled"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set(key, !local[key])} className={"w-10 h-5 rounded-full transition-colors relative cursor-pointer " + (local[key] ? "bg-white" : "bg-zinc-700")}>
                <div className={"absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all " + (local[key] ? "left-5" : "left-0.5")} />
              </div>
              <span className="text-sm text-zinc-400">{key === "soundEnabled" ? "Sound" : "Flash"}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleApply} className="flex-1 py-3 rounded-xl font-semibold text-black bg-white hover:bg-zinc-200 transition-colors">Apply</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ShareToast({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white text-black text-sm font-semibold px-5 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4">Link copied to clipboard</div>;
}

function TimerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<TimerConfig>(() => ({ ...defaultTimerConfig(), ...parseConfigFromParams(Object.fromEntries(searchParams.entries())) }));
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const segments = useMemo(() => config.mode === "segments" ? flattenSegments(config) : [], [config]);
  const currentSegIndex = (() => {
    if (config.mode !== "segments") return -1;
    let acc = 0;
    for (let i = 0; i < segments.length; i++) { acc += segments[i].durationSec; if (elapsed < acc) return i; }
    return segments.length - 1;
  })();
  const currentSeg = segments[currentSegIndex];
  const segElapsed = currentSegIndex < 0 ? 0 : elapsed - segments.slice(0, currentSegIndex).reduce((a, s) => a + s.durationSec, 0);
  const segRemaining = currentSeg ? currentSeg.durationSec - segElapsed : 0;
  const displayTime = config.mode === "countdown" ? Math.max(0, (config.durationSec ?? 300) - elapsed) : config.mode === "countup" ? elapsed : Math.max(0, segRemaining);
  const progress = config.mode === "countdown" ? Math.min(1, elapsed / (config.durationSec ?? 300)) : config.mode === "segments" && currentSeg ? Math.min(1, segElapsed / currentSeg.durationSec) : 0;

  const playBeep = useCallback((freq = 880, dur = 0.15, gain = 0.4) => {
    if (!config.soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current, osc = ctx.createOscillator(), g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = freq; g.gain.setValueAtTime(gain, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
    } catch { /* ok */ }
  }, [config.soundEnabled]);

  const playFinish = useCallback(() => { [0, 0.2, 0.4].forEach((d) => setTimeout(() => playBeep(660, 0.3, 0.5), d * 1000)); }, [playBeep]);
  const triggerFlash = useCallback(() => { if (!config.flashEnabled) return; setFlashing(true); setTimeout(() => setFlashing(false), 800); }, [config.flashEnabled]);

  useEffect(() => {
    if (!running || finished) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (config.mode === "countdown" && next >= (config.durationSec ?? 300)) { setRunning(false); setFinished(true); playFinish(); triggerFlash(); return config.durationSec ?? 300; }
        if (config.mode === "segments") { const total = segments.reduce((a, s) => a + s.durationSec, 0); if (next >= total) { setRunning(false); setFinished(true); playFinish(); triggerFlash(); return total; } }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, finished, config, segments, playFinish, triggerFlash]);

  const handleStartPause = useCallback(() => {
    if (finished) return;
    if (!running) { audioCtxRef.current?.resume(); playBeep(440, 0.1); }
    setRunning((r) => !r);
  }, [finished, running, playBeep]);

  const handleReset = useCallback(() => { setRunning(false); setFinished(false); setElapsed(0); }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h); return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (showSettings) return;
      if (e.code === "Space") { e.preventDefault(); handleStartPause(); }
      if (e.code === "KeyR") handleReset();
      if (e.code === "KeyF") toggleFullscreen();
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [showSettings, handleStartPause, handleReset, toggleFullscreen]);

  const handleApplyConfig = (c: TimerConfig) => { setConfig(c); setRunning(false); setFinished(false); setElapsed(0); router.replace("/timer?" + serializeConfigToParams(c).toString(), { scroll: false }); };
  const handleShare = async () => { const url = window.location.origin + "/timer?" + serializeConfigToParams(config).toString(); try { await navigator.clipboard.writeText(url); setShowShare(true); } catch { window.prompt("Copy this link:", url); } };

  const isUrgent = config.mode === "countdown" && displayTime <= 10 && displayTime > 0 && running;
  const timeStr = formatTime(displayTime);
  const fontSize = timeStr.length <= 5 ? "text-[22vw] sm:text-[20vw]" : timeStr.length <= 8 ? "text-[16vw] sm:text-[14vw]" : "text-[12vw] sm:text-[10vw]";

  return (
    <div className={"relative min-h-screen flex flex-col select-none transition-colors duration-150 " + (flashing ? "bg-white" : "bg-black")}>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
        <Link href="/" className="text-white/30 hover:text-white/70 text-sm font-medium transition-colors">Back</Link>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="text-white/30 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/10" title="Share link">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>
          <button onClick={() => setShowSettings(true)} className="text-white/30 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/10" title="Settings">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <button onClick={toggleFullscreen} className="text-white/30 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/10" title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}>
            {isFullscreen
              ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>
              : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
            }
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24">
        {config.mode === "segments" && currentSeg && (
          <div className="mb-4 text-center">
            <span className="text-white/50 text-sm font-medium uppercase tracking-widest">Segment {currentSegIndex + 1}/{segments.length}</span>
            <p className="text-white/90 text-2xl font-semibold mt-1">{currentSeg.name}</p>
          </div>
        )}
        {config.mode !== "segments" && config.label && <p className="text-white/50 text-base uppercase tracking-widest mb-4">{config.label}</p>}
        <div className={"font-mono font-black leading-none tracking-tighter transition-all duration-150 " + fontSize + " " + (flashing ? "text-black" : isUrgent ? "text-red-400" : finished ? "text-white/40" : "text-white")} style={{ fontVariantNumeric: "tabular-nums" }}>
          {timeStr}
        </div>
        <div className="mt-3 text-white/20 text-xs font-semibold uppercase tracking-[0.2em]">
          {config.mode === "countdown" ? "Countdown" : config.mode === "countup" ? "Count Up" : "Segments"}
        </div>
        {finished && <div className="mt-6 text-white/70 text-xl font-semibold animate-pulse">Time&rsquo;s Up</div>}
      </div>

      {(config.mode === "countdown" || config.mode === "segments") && (
        <div className="absolute bottom-20 left-0 right-0 px-8 sm:px-16">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/70 rounded-full transition-all duration-1000" style={{ width: (progress * 100) + "%" }} />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-5 pb-8">
        <button onClick={handleReset} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all flex items-center justify-center" title="Reset (R)">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        </button>
        <button onClick={handleStartPause} disabled={finished} className={"w-20 h-20 rounded-full transition-all flex items-center justify-center shadow-2xl " + (finished ? "bg-white/10 text-white/30 cursor-not-allowed" : running ? "bg-white/90 text-black hover:bg-white" : "bg-white text-black hover:scale-105")} title="Start/Pause (Space)">
          {running ? <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
        </button>
        <button onClick={() => setShowSettings(true)} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all flex items-center justify-center" title="Settings">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      {showSettings && <SettingsPanel config={config} onApply={handleApplyConfig} onClose={() => setShowSettings(false)} />}
      {showShare && <ShareToast onDone={() => setShowShare(false)} />}
      {!running && !finished && elapsed === 0 && <div className="absolute bottom-3 left-0 right-0 text-center text-white/15 text-xs">Space to start | R to reset | F for fullscreen</div>}
    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="font-mono text-white/20 text-8xl font-black">00:00</div></div>}>
      <TimerContent />
    </Suspense>
  );
}
