import { z } from "zod"

/**
 * Schema for scheduling a new task via Typeform submission.
 * Validates structure, parameters, and cron expressions.
 */
export const TaskFormSchema = z.object({
  taskName: z.string()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name must not exceed 100 characters"),

  taskType: z.enum([
    "anomalyScan",
    "tokenAnalytics",
    "whaleMonitor",
    "liquidityCheck",
    "marketPulse"
  ]),

  parameters: z.record(z.string(), z.string())
    .refine(obj => Object.keys(obj).length > 0, {
      message: "Parameters must include at least one key"
    }),

  scheduleCron: z.string()
    .regex(
      /^(\*|[0-5]?\d) (\*|[01]?\d|2[0-3]) (\*|[1-9]|[12]\d|3[01]) (\*|[1-9]|1[0-2]) (\*|[0-6])$/,
      "Invalid cron expression"
    ),

  retries: z.number()
    .min(0)
    .max(10)
    .default(3),

  priority: z.enum(["low", "normal", "high"])
    .default("normal"),

  enabled: z.boolean()
    .default(true)
})

export type TaskFormInput = z.infer<typeof TaskFormSchema>

/**
 * Utility to check if a cron schedule is daily at midnight.
 */
export function isDailyMidnightSchedule(input: TaskFormInput): boolean {
  return input.scheduleCron.trim() === "0 0 * * *"
}

/**
 * Normalize parameters into lowercase keys for consistency.
 */
export function normalizeParameters(params: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    normalized[key.toLowerCase()] = value
  }
  return normalized
}
