import React from "react"
import SentimentGauge from "./SentimentGauge"
import AssetOverviewPanel from "./AssetOverviewPanel"
import WhaleTrackerCard from "./WhaleTrackerCard"

export const AnalyticsDashboard: React.FC = () => (
  <div className="p-8 bg-gray-100 min-h-screen">
    <header className="mb-6">
      <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
      <p className="text-gray-600 mt-1">Real-time market insights, sentiment, and whale activity</p>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SentimentGauge symbol="SOL" />
      <AssetOverviewPanel assetId="SOL-01" />
      <WhaleTrackerCard />
    </div>
  </div>
)

export default AnalyticsDashboard
