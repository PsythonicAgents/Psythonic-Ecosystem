import React from "react"

interface MarketSentimentWidgetProps {
  sentimentScore: number // value from 0 to 100
  trend: "Bullish" | "Bearish" | "Neutral"
  dominantToken: string
  totalVolume24h: number
  className?: string
}

const getSentimentColor = (score: number) => {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

export const MarketSentimentWidget: React.FC<MarketSentimentWidgetProps> = ({
  sentimentScore,
  trend,
  dominantToken,
  totalVolume24h,
  className = "",
}) => {
  return (
    <div
      className={`p-4 rounded shadow bg-white ${className}`}
      role="region"
      aria-label="Market Sentiment"
    >
      <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-lg ${getSentimentColor(
            sentimentScore
          )}`}
          aria-label={`Sentiment score ${sentimentScore}`}
        >
          {sentimentScore}%
        </div>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            <strong>Trend:</strong> {trend}
          </li>
          <li>
            <strong>Dominant token:</strong> {dominantToken}
          </li>
          <li>
            <strong>24h Volume:</strong> ${totalVolume24h.toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MarketSentimentWidget
