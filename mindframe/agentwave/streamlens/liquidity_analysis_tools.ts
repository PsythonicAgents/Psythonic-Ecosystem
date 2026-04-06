import { toolkitBuilder } from "@/ai/core"
import { FETCH_POOL_DATA_KEY } from "@/ai/modules/liquidity/pool-fetcher/key"
import { ANALYZE_POOL_HEALTH_KEY } from "@/ai/modules/liquidity/health-checker/key"
import { FetchPoolDataAction } from "@/ai/modules/liquidity/pool-fetcher/action"
import { AnalyzePoolHealthAction } from "@/ai/modules/liquidity/health-checker/action"

type Toolkit = ReturnType<typeof toolkitBuilder>

/**
 * Toolkit exposing liquidity-related actions:
 * - fetch raw pool data
 * - run health / risk analysis on a liquidity pool
 */

/** Normalize a tool key into "<prefix>-<key>" form */
const makeKey = (prefix: string, key: string): string => {
  if (!prefix || !key) throw new Error("Invalid tool key")
  return `${prefix.trim().toLowerCase()}-${key.trim().toLowerCase()}`
}

/** Stable identifiers */
const FETCH_TOOL_ID = makeKey("liquidityscan", FETCH_POOL_DATA_KEY)
const HEALTH_TOOL_ID = makeKey("poolhealth", ANALYZE_POOL_HEALTH_KEY)

/** Registry of liquidity tools */
export const LIQUIDITY_ANALYSIS_TOOLS: Record<string, Toolkit> = Object.freeze({
  [FETCH_TOOL_ID]: toolkitBuilder(new FetchPoolDataAction()),
  [HEALTH_TOOL_ID]: toolkitBuilder(new AnalyzePoolHealthAction()),
})

/** Expose list of available tool ids */
export const LIQUIDITY_TOOL_IDS = Object.freeze([FETCH_TOOL_ID, HEALTH_TOOL_ID])

/** Utility to check if a given tool id exists */
export const hasLiquidityTool = (id: string): boolean =>
  LIQUIDITY_TOOL_IDS.includes(id.toLowerCase())
