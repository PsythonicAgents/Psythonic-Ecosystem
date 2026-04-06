import fetch from "node-fetch"

/*------------------------------------------------------
 * Types
 *----------------------------------------------------*/

export interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export type CandlestickPattern =
  | "Hammer"
  | "ShootingStar"
  | "BullishEngulfing"
  | "BearishEngulfing"
  | "Doji"

export interface PatternSignal {
  timestamp: number
  pattern: CandlestickPattern
  confidence: number
}

/*------------------------------------------------------
 * Detector
 *----------------------------------------------------*/

export class CandlestickPatternDetector {
  constructor(private readonly apiUrl: string) {}

  /** Fetch recent OHLC candles with timeout and basic validation */
  async fetchCandles(symbol: string, limit = 100): Promise<Candle[]> {
    const clean = this.normalizeSymbol(symbol)
    const url = `${this.apiUrl}/markets/${encodeURIComponent(clean)}/candles?limit=${limit}`
    const res = await this.fetchWithTimeout(url, 10_000)
    if (!res.ok) {
      throw new Error(`Failed to fetch candles ${res.status}: ${res.statusText}`)
    }
    const data = (await res.json()) as Candle[]
    this.assertValidCandles(data)
    // ensure ascending order by timestamp
    return data.slice().sort((a, b) => a.timestamp - b.timestamp)
  }

  /** High-level helper: fetch → detect → dedupe */
  async analyzeSymbol(symbol: string, limit = 200): Promise<PatternSignal[]> {
    const candles = await this.fetchCandles(symbol, limit)
    const signals = this.detectPatterns(candles)
    const minGap = this.deriveTimeGap(candles, 2)
    return this.dedupeByTime(signals, minGap)
  }

  /* ------------------------- HTTP utils ------------------------- */

  private async fetchWithTimeout(url: string, ms: number): Promise<Response> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), Math.max(1, ms))
    try {
      return await fetch(url, { signal: controller.signal } as any)
    } finally {
      clearTimeout(id)
    }
  }

  private normalizeSymbol(s: string): string {
    const v = s.trim()
    if (!v) throw new Error("Symbol cannot be empty")
    return v.toUpperCase()
  }

  /* ------------------------- Validation ------------------------- */

  private assertValidCandles(arr: Candle[]): void {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error("No candles returned")
    }
    for (const c of arr) {
      if (
        typeof c.timestamp !== "number" ||
        typeof c.open !== "number" ||
        typeof c.high !== "number" ||
        typeof c.low !== "number" ||
        typeof c.close !== "number"
      ) {
        throw new Error("Invalid candle shape")
      }
      if (!(c.low <= Math.min(c.open, c.close) && c.high >= Math.max(c.open, c.close))) {
        throw new Error("Inconsistent OHLC bounds")
      }
    }
  }

  /* ------------------------- Pattern helpers ---------------------- */

  private isHammer(c: Candle): number {
    const body = Math.abs(c.close - c.open)
    const range = c.high - c.low
    if (range <= 0) return 0
    const lowerWick = Math.min(c.open, c.close) - c.low
    const ratio = body > 0 ? lowerWick / body : 0
    const bodyShare = body / range
    return ratio > 2 && bodyShare < 0.3 ? Math.min(ratio / 3, 1) : 0
  }

  private isShootingStar(c: Candle): number {
    const body = Math.abs(c.close - c.open)
    const range = c.high - c.low
    if (range <= 0) return 0
    const upperWick = c.high - Math.max(c.open, c.close)
    const ratio = body > 0 ? upperWick / body : 0
    const bodyShare = body / range
    return ratio > 2 && bodyShare < 0.3 ? Math.min(ratio / 3, 1) : 0
  }

  private isBullishEngulfing(prev: Candle, curr: Candle): number {
    const cond =
      curr.close > curr.open &&
      prev.close < prev.open &&
      curr.close > prev.open &&
      curr.open < prev.close
    if (!cond) return 0
    const bodyPrev = Math.abs(prev.close - prev.open)
    const bodyCurr = Math.abs(curr.close - curr.open)
    return bodyPrev > 0 ? Math.min(bodyCurr / bodyPrev, 1) : 0.8
  }

  private isBearishEngulfing(prev: Candle, curr: Candle): number {
    const cond =
      curr.close < curr.open &&
      prev.close > prev.open &&
      curr.open > prev.close &&
      curr.close < prev.open
    if (!cond) return 0
    const bodyPrev = Math.abs(prev.close - prev.open)
    const bodyCurr = Math.abs(curr.close - curr.open)
    return bodyPrev > 0 ? Math.min(bodyCurr / bodyPrev, 1) : 0.8
  }

  private isDoji(c: Candle): number {
    const range = c.high - c.low
    const body = Math.abs(c.close - c.open)
    const ratio = range > 0 ? body / range : 1
    return ratio < 0.1 ? 1 - ratio * 10 : 0
  }

  /* ------------------------- Detection --------------------------- */

  private detectPatterns(candles: Candle[]): PatternSignal[] {
    if (candles.length === 0) return []
    const out: PatternSignal[] = []
    const pushIf = (timestamp: number, pattern: CandlestickPattern, conf: number) => {
      const c = this.clamp(this.round(conf, 3), 0, 1)
      if (c >= 0.6) out.push({ timestamp, pattern, confidence: c })
    }

    for (let i = 0; i < candles.length; i++) {
      const c = candles[i]
      // single-candle
      const hammer = this.isHammer(c)
      if (hammer) pushIf(c.timestamp, "Hammer", hammer)

      const star = this.isShootingStar(c)
      if (star) pushIf(c.timestamp, "ShootingStar", star)

      const doji = this.isDoji(c)
      if (doji) pushIf(c.timestamp, "Doji", doji)

      // two-candle
      if (i > 0) {
        const p = candles[i - 1]
        const bull = this.isBullishEngulfing(p, c)
        if (bull) pushIf(c.timestamp, "BullishEngulfing", bull)

        const bear = this.isBearishEngulfing(p, c)
        if (bear) pushIf(c.timestamp, "BearishEngulfing", bear)
      }
    }

    out.sort((a, b) => a.timestamp - b.timestamp)
    return out
  }

  /** Keep only the strongest signal within a moving time window */
  private dedupeByTime(signals: PatternSignal[], minGapMs: number): PatternSignal[] {
    if (signals.length < 2) return signals
    const result: PatternSignal[] = []
    let last: PatternSignal | undefined

    for (const s of signals) {
      if (!last) {
        result.push((last = s))
        continue
      }
      const gap = s.timestamp - last.timestamp
      if (gap >= minGapMs) {
        result.push((last = s))
      } else if (s.confidence > last.confidence) {
        result[result.length - 1] = (last = s)
      }
    }
    return result
  }

  /** Estimate an interval from average candle spacing and multiply */
  private deriveTimeGap(candles: Candle[], multiplier = 2): number {
    if (candles.length < 2) return 0
    const first = candles[0].timestamp
    const last = candles[candles.length - 1].timestamp
    const avg = (last - first) / Math.max(1, candles.length - 1)
    return Math.max(0, Math.floor(avg * multiplier))
  }

  /* ------------------------- Math utils -------------------------- */

  private clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v))
  }

  private round(v: number, decimals: number): number {
    const k = Math.pow(10, decimals)
    return Math.round(v * k) / k
  }
}
