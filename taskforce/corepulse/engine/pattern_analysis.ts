/**
 * Detect volume‐based patterns in a series of activity amounts.
 */
export interface PatternMatch {
  index: number
  window: number
  average: number
  total: number
  min: number
  max: number
  exceedsThreshold: boolean
}

export interface PatternSummary {
  matches: PatternMatch[]
  highestAverage?: PatternMatch
  longestRun?: { start: number; end: number; length: number }
}

export function detectVolumePatterns(
  volumes: number[],
  windowSize: number,
  threshold: number
): PatternSummary {
  const matches: PatternMatch[] = []
  let currentRun: { start: number; length: number } | null = null
  let longestRun: { start: number; end: number; length: number } | undefined

  for (let i = 0; i + windowSize <= volumes.length; i++) {
    const slice = volumes.slice(i, i + windowSize)
    const total = slice.reduce((a, b) => a + b, 0)
    const avg = total / windowSize
    const min = Math.min(...slice)
    const max = Math.max(...slice)
    const exceedsThreshold = avg >= threshold

    if (exceedsThreshold) {
      matches.push({ index: i, window: windowSize, average: avg, total, min, max, exceedsThreshold })

      if (!currentRun) currentRun = { start: i, length: 1 }
      else currentRun.length++

      if (!longestRun || currentRun.length > longestRun.length) {
        longestRun = {
          start: currentRun.start,
          end: i,
          length: currentRun.length,
        }
      }
    } else {
      currentRun = null
    }
  }

  const highestAverage = matches.reduce(
    (best, m) => (!best || m.average > best.average ? m : best),
    undefined as PatternMatch | undefined
  )

  return { matches, highestAverage, longestRun }
}
