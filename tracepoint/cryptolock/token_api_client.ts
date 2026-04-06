export interface TokenDataPoint {
  timestamp: number
  priceUsd: number
  volumeUsd: number
  marketCapUsd: number
}

export interface TokenMetadata {
  symbol: string
  name?: string
  decimals?: number
  chain?: string
}

export class TokenDataFetcher {
  constructor(private apiBase: string, private timeoutMs: number = 10000) {}

  /**
   * Fetch JSON with timeout protection
   */
  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      return await fetch(url, { signal: controller.signal })
    } finally {
      clearTimeout(timeout)
    }
  }

  /**
   * Fetches an array of TokenDataPoint for the given token symbol.
   * Expects endpoint: `${apiBase}/tokens/${symbol}/history`
   */
  async fetchHistory(symbol: string): Promise<TokenDataPoint[]> {
    const res = await this.fetchWithTimeout(
      `${this.apiBase}/tokens/${encodeURIComponent(symbol)}/history`
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch history for ${symbol}: ${res.status}`)
    }
    const raw = (await res.json()) as any[]
    return raw.map(r => ({
      timestamp: r.time * 1000,
      priceUsd: Number(r.priceUsd),
      volumeUsd: Number(r.volumeUsd),
      marketCapUsd: Number(r.marketCapUsd),
    }))
  }

  /**
   * Fetch metadata for a token.
   * Expects endpoint: `${apiBase}/tokens/${symbol}/metadata`
   */
  async fetchMetadata(symbol: string): Promise<TokenMetadata> {
    const res = await this.fetchWithTimeout(
      `${this.apiBase}/tokens/${encodeURIComponent(symbol)}/metadata`
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch metadata for ${symbol}: ${res.status}`)
    }
    return (await res.json()) as TokenMetadata
  }

  /**
   * Fetch latest price snapshot.
   * Expects endpoint: `${apiBase}/tokens/${symbol}/price`
   */
  async fetchLatestPrice(symbol: string): Promise<number> {
    const res = await this.fetchWithTimeout(
      `${this.apiBase}/tokens/${encodeURIComponent(symbol)}/price`
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch latest price for ${symbol}: ${res.status}`)
    }
    const data = await res.json()
    return Number(data.priceUsd)
  }
}
