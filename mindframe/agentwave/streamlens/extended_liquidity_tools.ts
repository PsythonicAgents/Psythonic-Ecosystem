import { toolkitBuilder } from "@/ai/core"
import { FETCH_POOL_DATA_KEY } from "@/ai/modules/liquidity/pool-fetcher/key"
import { ANALYZE_POOL_HEALTH_KEY } from "@/ai/modules/liquidity/health-checker/key"
import { FetchPoolDataAction } from "@/ai/modules/liquidity/pool-fetcher/action"
import { AnalyzePoolHealthAction } from "@/ai/modules/liquidity/health-checker/action"

type Toolkit = ReturnType<typeof toolkitBuilder>

/** Build a standardized tool id */
const makeKey = (prefix: string, key: string): string => {
  if (!prefix || !key) throw new Error("Invalid tool key")
  return `${prefix.trim().toLowerCase()}-${key.trim().toLowerCase()}`
}

const FETCH_TOOL_ID = makeKey("liquidityscan", FETCH_POOL_DATA_KEY)
const HEALTH_TOOL_ID = makeKey("poolhealth", ANALYZE_POOL_HEALTH_KEY)

export const EXTENDED_LIQUIDITY_TOOLS: Record<string, Toolkit> = Object.freeze({
  [FETCH_TOOL_ID]: toolkitBuilder(new FetchPoolDataAction()),
  [HEALTH_TOOL_ID]: toolkitBuilder(new AnalyzePoolHealthAction()),
})

/** Export available ids */
export const EXTENDED_LIQUIDITY_TOOL_IDS = Object.freeze([FETCH_TOOL_ID, HEALTH_TOOL_ID])

/** Get a specific tool by id */
export const getExtendedLiquidityTool = (id: string): Toolkit | undefined =>
  EXTENDED_LIQUIDITY_TOOLS[id]
