export interface VolumePoint {
  timestamp: number
  volumeUsd: number
}

export interface SpikeEvent {
  timestamp: number
  volume: number
  spikeRatio: number
}

export interface SpikeSummary {
  totalSpikes: number
  maxSpikeRatio: number
  avgSpikeRatio: number
  firstSpike?: SpikeEvent
  lastSpike?: SpikeEvent
}

/**
 * Detects spikes in trading volume compared to a rolling average window.
 */
export function detectVolumeSpikes(
  points: VolumePoint[],
  windowSize: number = 10,
  spikeThreshold: number = 2.0
): SpikeEvent[] {
  const events: SpikeEvent[] = []
  if (points.length <= windowSize) return events

  const volumes = points.map(p => p.volumeUsd)
  for (let i = windowSize; i < volumes.length; i++) {
    const window = volumes.slice(i - windowSize, i)
    const avg = window.reduce((sum, v) => sum + v, 0) / (window.length || 1)
    const curr = volumes[i]
    const ratio = avg > 0 ? curr / avg : Infinity

    if (ratio >= spikeThreshold) {
      events.push({
        timestamp: points[i].timestamp,
        volume: curr,
        spikeRatio: Math.round(ratio * 100) / 100,
      })
    }
  }
  return events
}

/**
 * Summarize detected spike events with aggregated statistics.
 */
export function summarizeSpikes(events: SpikeEvent[]): SpikeSummary {
  if (!events.length) {
    return { totalSpikes: 0, maxSpikeRatio: 0, avgSpikeRatio: 0 }
  }

  const ratios = events.map(e => e.spikeRatio)
  return {
    totalSpikes: events.length,
    maxSpikeRatio: Math.max(...ratios),
    avgSpikeRatio: Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100) / 100,
    firstSpike: events[0],
    lastSpike: events[events.length - 1],
  }
}

/**
 * Detect both spikes and sudden drops in trading volume.
 */
export function detectVolumeAnomalies(
  points: VolumePoint[],
  windowSize: number = 10,
  spikeThreshold: number = 2.0,
  dropThreshold: number = 0.5
): { spikes: SpikeEvent[]; drops: SpikeEvent[] } {
  const spikes: SpikeEvent[] = []
  const drops: SpikeEvent[] = []
  if (points.length <= windowSize) return { spikes, drops }

  const volumes = points.map(p => p.volumeUsd)
  for (let i = windowSize; i < volumes.length; i++) {
    const window = volumes.slice(i - windowSize, i)
    const avg = window.reduce((sum, v) => sum + v, 0) / (window.length || 1)
    const curr = volumes[i]
    const ratio = avg > 0 ? curr / avg : 0

    if (ratio >= spikeThreshold) {
      spikes.push({
        timestamp: points[i].timestamp,
        volume: curr,
        spikeRatio: Math.round(ratio * 100) / 100,
      })
    } else if (ratio <= dropThreshold) {
      drops.push({
        timestamp: points[i].timestamp,
        volume: curr,
        spikeRatio: Math.round(ratio * 100) / 100,
      })
    }
  }
  return { spikes, drops }
}
