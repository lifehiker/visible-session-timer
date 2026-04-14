import { z } from "zod";

export const segmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Segment name is required"),
  durationSec: z.number().int().min(1, "Duration must be at least 1 second"),
});

export const timerConfigSchema = z.object({
  mode: z.enum(["countdown", "countup", "segments"]),
  label: z.string().optional(),
  durationSec: z.number().int().min(1).optional(),
  segments: z.array(segmentSchema).min(1).max(10).optional(),
  rounds: z.number().int().min(1).max(100).optional(),
  soundEnabled: z.boolean(),
  flashEnabled: z.boolean(),
  theme: z.enum(["dark", "light", "amber"]),
});

export type TimerConfigInput = z.infer<typeof timerConfigSchema>;

export const saveTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  description: z.string().max(500).optional(),
  config: timerConfigSchema,
  isPublic: z.boolean().optional().default(false),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
});

export type SaveTemplateInput = z.infer<typeof saveTemplateSchema>;