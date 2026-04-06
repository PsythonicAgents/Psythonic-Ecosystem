import { z } from "zod"

/**
 * Base types for any action
 */

/** Zod schema describing the expected input payload */
export type ActionSchema = z.ZodObject<z.ZodRawShape>

/** Standardized action response envelope */
export interface ActionResponse<T> {
  /** Human-readable note about the result */
  notice: string
  /** Optional structured payload */
  data?: T
  /** Optional success flag (kept optional for backward compatibility) */
  ok?: boolean
  /** Optional machine-readable code (e.g., "INVALID_INPUT", "UPSTREAM_ERROR") */
  code?: string
}

/**
 * Generic interface for executable actions
 * S — input schema, R — result payload, Ctx — execution context shape
 */
export interface BaseAction<S extends ActionSchema, R, Ctx = unknown> {
  /** Unique identifier for the action */
  id: string
  /** Short, human-readable summary */
  summary: string
  /** Zod schema for validating inputs */
  input: S
  /** Execute the action with validated payload and contextual data */
  execute(args: { payload: z.infer<S>; context: Ctx }): Promise<ActionResponse<R>>
}

/* ------------------------------------------------------------------
 * Utilities to help implement actions consistently
 * ------------------------------------------------------------------*/

/** Helper to infer the validated input type from a BaseAction */
export type ExtractInput<A extends BaseAction<any, any, any>> = A extends BaseAction<infer S, any, any>
  ? z.infer<S>
  : never

/** Helper to infer the result data type from a BaseAction */
export type ExtractResult<A extends BaseAction<any, any, any>> = A extends BaseAction<any, infer R, any>
  ? R
  : never

/** Type guard for ActionResponse */
export function isActionResponse<T = unknown>(v: unknown): v is ActionResponse<T> {
  if (typeof v !== "object" || v === null) return false
  const o = v as Record<string, unknown>
  return typeof o.notice === "string"
}

/** Build a successful ActionResponse */
export function success<T>(data: T, notice = "ok"): ActionResponse<T> {
  return { ok: true, notice, data }
}

/** Build a failed ActionResponse */
export function failure<T = never>(notice: string, code?: string): ActionResponse<T> {
  return { ok: false, notice, code }
}

/**
 * Factory to define an action with strong typing
 * Example:
 *   const ping = defineAction({
 *     id: "ping",
 *     summary: "Ping endpoint",
 *     input: z.object({ message: z.string() }),
 *     execute: async ({ payload }) => success({ echo: payload.message })
 *   })
 */
export function defineAction<S extends ActionSchema, R, Ctx = unknown>(
  def: BaseAction<S, R, Ctx>
): BaseAction<S, R, Ctx> {
  return def
}
