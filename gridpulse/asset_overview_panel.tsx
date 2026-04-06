import React, { useEffect, useMemo, useRef, useState } from "react"

interface AssetOverviewPanelProps {
  assetId: string
  /** Optional API base, defaults to "/api" */
  apiBase?: string
  /** Optional refresh interval in ms to poll for updates */
  refreshMs?: number
  /** Optional extra classes for container */
  className?: string
}

interface AssetOverview {
  name: string
  priceUsd: number
  supply: number
  holders: number
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(v)

const formatNumber = (v: number) => new Intl.NumberFormat(undefined).format(v)

export const AssetOverviewPanel: React.FC<AssetOverviewPanelProps> = ({
  assetId,
  apiBase = "/api",
  refreshMs,
  className = "",
}) => {
  const [info, setInfo] = useState<AssetOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const timerRef = useRef<number | null>(null)

  const endpoint = useMemo(() => {
    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase
    return `${base}/assets/${encodeURIComponent(assetId)}`
  }, [apiBase, assetId])

  useEffect(() => {
    let aborted = false
    const controller = new AbortController()

    async function fetchInfo() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(endpoint, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(`Request failed ${res.status} ${text}`)
        }
        const json = (await res.json()) as Partial<AssetOverview>
        // basic validation
        if (
          typeof json?.name !== "string" ||
          typeof json?.priceUsd !== "number" ||
          typeof json?.supply !== "number" ||
          typeof json?.holders !== "number"
        ) {
          throw new Error("Invalid asset payload")
        }
        if (!aborted) setInfo(json as AssetOverview)
      } catch (err: any) {
        if (aborted) return
        setError(err?.message ?? "Unknown error")
        setInfo(null)
      } finally {
        if (!aborted) setLoading(false)
      }
    }

    fetchInfo()

    if (refreshMs && refreshMs > 0) {
      timerRef.current = window.setInterval(fetchInfo, refreshMs)
    }

    return () => {
      aborted = true
      controller.abort()
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [endpoint, refreshMs])

  if (loading) {
    return (
      <div className={`p-4 bg-white rounded shadow animate-pulse ${className}`}>
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 text-red-700 rounded shadow ${className}`} role="alert">
        <h2 className="text-lg font-semibold mb-1">Asset overview</h2>
        <p className="text-sm">Failed to load data for <strong>{assetId}</strong></p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    )
  }

  if (!info) {
    return (
      <div className={`p-4 bg-white rounded shadow ${className}`}>
        <h2 className="text-xl font-semibold mb-2">Asset overview</h2>
        <p>No data available for <strong>{assetId}</strong></p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white rounded shadow ${className}`}>
      <h2 className="text-xl font-semibold mb-2">Asset overview</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <dt className="text-sm text-gray-500">ID</dt>
          <dd className="font-medium break-all">{assetId}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Name</dt>
          <dd className="font-medium">{info.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Price (USD)</dt>
          <dd className="font-medium">{formatCurrency(info.priceUsd)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Circulating supply</dt>
          <dd className="font-medium">{formatNumber(info.supply)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Holders</dt>
          <dd className="font-medium">{formatNumber(info.holders)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default AssetOverviewPanel
