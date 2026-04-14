export type TimerMode = "countdown" | "countup" | "segments";

export interface Segment {
  id: string;
  name: string;
  durationSec: number;
}

export interface TimerConfig {
  mode: TimerMode;
  label?: string;
  durationSec?: number;
  segments?: Segment[];
  rounds?: number;
  soundEnabled: boolean;
  flashEnabled: boolean;
  theme: "dark" | "light" | "amber";
}
