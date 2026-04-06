<p align="center">
  <img width="400" height="400" alt="psythonic_ai_agents" src="https://github.com/user-attachments/assets/02314c23-648e-4532-a004-79c0b6cb2e83" />
</p>

<h1 align="center">Psythonic AI Agents</h1>

<div align="center">
  <p><strong>AI-powered on-chain analytics, wallet intelligence, and agent-driven trading workflows for Solana</strong></p>
  <p>
    Token analytics • Wallet profiling • Research agents • Signals • Jupiter execution • Credits powered by $PSYTHONIC
  </p>
</div>

<div align="center">

[![Web App](https://img.shields.io/badge/Web%20App-Open-3b82f6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://your-web-app-link)
[![Telegram Mini App](https://img.shields.io/badge/Telegram%20Mini%20App-Launch-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/your_mini_app)
[![Docs](https://img.shields.io/badge/Docs-Read-8b5cf6?style=for-the-badge&logo=readthedocs&logoColor=white)](https://your-docs-link)
[![X.com](https://img.shields.io/badge/X.com-Follow-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/your_account)
[![Telegram Community](https://img.shields.io/badge/Telegram%20Community-Join-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/your_group_or_channel)

</div>

---

> [!IMPORTANT]
> Psythonic AI Agents is a non-custodial platform  
> You connect your own wallet, keep full control of funds, and confirm every on-chain action yourself

## One-Line Value

Turn raw token, wallet, and narrative data into clear trading decisions in seconds without juggling five dashboards, scattered feeds, and disconnected tools

## Why It Wins

Psythonic is built for real trading flow, not passive browsing

| Advantage | What it means in practice |
|---|---|
| Removes friction | No need to jump between explorers, screeners, social feeds, and separate execution tabs |
| Speeds up decisions | Token and wallet checks become a fast, readable workflow instead of manual cross-checking |
| Replaces fragmented tooling | Analytics, AI summaries, signals, research, and swap routing live in one connected system |
| Creates an edge | It explains what matters, ranks risk, and keeps execution close to the decision point |

> [!TIP]
> Best used when you want one system to scan a setup, explain the risk, and keep you close to execution without losing context

## Proof

A typical Psythonic flow starts with one address and ends with an actionable view

### Example input
```text
Chain: Solana
Target: So11111111111111111111111111111111111111112
Mode: Token Analytics
Depth: Quick
```

### Example output
```json
{
  "summary": "Token has healthy liquidity, stable volume, and no obvious extreme whale concentration. Risk is moderate and suitable for controlled entries.",
  "risk_score": 74,
  "liquidity_usd": 1250000,
  "volume_24h_usd": 830000,
  "volatility_24h": 0.18,
  "holder_concentration": {
    "top_10_pct": 32.5,
    "top_50_pct": 61.2
  },
  "whale_flows": {
    "net_in_24h_usd": 95000
  }
}
```

Instead of raw metrics with no story, Psythonic returns a readable verdict, structured scores, and context you can route into alerts, bots, or your own trading workflow

> [!NOTE]
> The platform is in active development  
> Features, supported networks, and execution flows may expand over time as infrastructure and product layers mature

## Run in 60 Seconds

Psythonic works across the Web App, Telegram Mini App, Browser Extension, and API, all synced through one wallet-based account

### Quick start

| Step | Action | Result |
|---|---|---|
| 1 | Connect your wallet | Your wallet becomes your Psythonic account |
| 2 | Use free credits | Start with 10 credits for first scans and agent runs |
| 3 | Paste a token or wallet | Launch analytics or research in a few clicks |
| 4 | Review the result | See scores, AI summary, flows, and risk context |
| 5 | Continue the flow | Save to watchlist, set alerts, or move into Jupiter execution |

### What the user sees
- Token analytics with liquidity, volume, holder concentration, whale flow, and risk score
- Wallet analytics with PnL, winrate, sizing behavior, drawdown profile, and activity patterns
- Research outputs that compress narrative updates, sentiment, and market relevance into trade-ready summaries

> [!WARNING]
> Crypto markets are high risk  
> Psythonic helps you analyze and structure decisions, but it does not remove execution, market, or liquidity risk

## Plug Anywhere

Psythonic is designed as both a product and an intelligence layer

| Path | Use case |
|---|---|
| Web App | Full analytics, watchlists, alerts, credits, API keys, and workspace control |
| Telegram Mini App | Fast scans, agent chats, and signal consumption in messaging-first flow |
| Browser Extension | In-context checks on token and wallet pages without leaving the current site |
| HTTP API | Agents, analytics snapshots, jobs, alerts, credits, and integrations |
| Webhooks | Push events like `job.completed`, `alert.fired`, and `signal.triggered` into your own systems |

That makes Psythonic fit equally well as a trader-facing tool, a bot backend, or a modular analytics layer for custom infrastructure

## Core Examples

### Basic usage
Run an analytics agent for a token
```bash
curl -X POST "https://api.psythonic.ai/v1/agents/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "analytics_token_v1",
    "mode": "async",
    "input": {
      "chain": "solana",
      "address": "So11111111111111111111111111111111111111112",
      "depth": "quick"
    }
  }'
```

Fetch the job result
```bash
curl -X GET "https://api.psythonic.ai/v1/jobs/JOB_ID_FROM_PREVIOUS_CALL" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: application/json"
```

### Real-world case
Use wallet analytics to inspect a high-performing wallet before copying its behavior
```ts
const res = await fetch("https://api.psythonic.ai/v1/agents/run", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.PSYTHONIC_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    agent_id: "analytics_wallet_v1",
    mode: "async",
    input: {
      chain: "solana",
      address: "YourWalletAddressHere",
      depth: "full"
    },
    metadata: {
      source: "copy-trading-review"
    }
  })
})

const data = await res.json()
console.log(data.job_id)
```

### Integration case
Receive a completed job through webhook and forward it into your own bot or backend
```ts
app.post("/webhooks/psythonic", async (req, res) => {
  const event = req.body

  if (event.type === "job.completed") {
    const result = event.data.result
    console.log("Summary:", result.summary)
    console.log("Risk score:", result.risk_score)
  }

  res.status(200).send("ok")
})
```

## How It Works

Psythonic reads token and wallet activity, enriches it with AI agents, and turns the output into scores, summaries, and triggers that can be consumed across product surfaces or external systems

### Mental model
1. Connect wallet and create a unified Psythonic profile
2. Run token analytics, wallet analytics, or research agents
3. Receive structured scores, summaries, and risk context
4. Save, alert, automate, or route the result into your own stack
5. Move into manual execution through integrated Jupiter flow when the setup fits your plan

## Customization Surface

Psythonic is flexible enough for both direct use and embedded workflows

| Layer | What you can customize |
|---|---|
| Analysis depth | Quick checks or deeper runs for token and wallet workflows |
| Delivery surface | Web, Telegram, extension, API, or webhook-based automation |
| Agent usage | Analytics agent, research agent, or combined workflows |
| Alerts and watchlists | Saved tokens, wallets, thresholds, and signal preferences |
| Access model | Free credits, paid tiers, top-ups, API keys, scopes, and workspace limits |

> [!IMPORTANT]
> Credits are the metering layer of the system  
> Each heavy action consumes a known amount, and credits are purchased using the $PSYTHONIC utility token

## Credits and Utility Model

| Action | Typical usage |
|---|---|
| Token analysis | Quick risk and market structure check |
| Wallet analysis | PnL, behavior, exposure, and timing profile |
| Research brief | Narrative, sentiment, and event-driven context |
| Async jobs | Heavier runs returned through jobs and webhooks |

Every credit purchase follows the same token flow

| Allocation | Purpose |
|---|---|
| 80% Burn | Permanently removed from supply |
| 20% Treasury | Funds product, infrastructure, liquidity, and ecosystem growth |

This keeps $PSYTHONIC tied to actual platform usage rather than disconnected token activity

## Limits and Trade-Offs

Trust matters more than hype, so Psythonic is explicit about where it fits and where it does not

| Area | Reality |
|---|---|
| Not custodial | Psythonic cannot access private keys or move funds without wallet approval |
| Not financial advice | Outputs are decision support, not guaranteed outcomes |
| Not instant certainty | Good analytics reduce blind risk, but they do not eliminate market randomness or execution slippage |
| Not full autotrading at launch | Current focus is analytics, research, signals, and user-approved execution |
| Network scope | Solana-first today, broader support expands over time |

> [!CAUTION]
> Do not treat AI summaries, scores, or signals as a substitute for position sizing, liquidity awareness, and execution discipline

## Best Fit / Anti-Fit

| Best fit | Anti-fit |
|---|---|
| Active Solana traders who need faster token and wallet checks | Users looking for guaranteed signals or passive profit promises |
| On-chain users tracking whales, rotation, and smart money behavior | Users who want custodial automation without wallet confirmations |
| Builders creating bots, dashboards, and custom trading workflows | Users who do not need analytics, agents, or programmable integrations |
| Teams that want one shared intelligence layer across multiple surfaces | Users expecting every chain and every feature to be live from day one |

## Architecture Snapshot

```text
Wallet Identity
      ↓
Token / Wallet Data
      ↓
Analytics Agent + Research Agent
      ↓
Scores • Summaries • Signals • Jobs
      ↓
Web App • Telegram Mini App • Extension • API • Webhooks
      ↓
Watchlists • Alerts • Jupiter Execution • Custom Bots
```

## Security and Data Principles

Psythonic is designed around a non-custodial, wallet-first model with limited, necessary data access for analytics and operational reliability

- Wallets stay under user control at all times
- Private keys and seed phrases are never collected
- API keys can be scoped, rotated, and revoked
- Webhooks support HMAC signature verification
- Account and usage data are used to operate, secure, and improve the product

## Final Note

Psythonic AI Agents is built for traders and builders who want a cleaner path from raw on-chain noise to clear action

It gives you one place to read the market, understand the risk, run AI workflows, and plug the output into the interfaces and systems you already use
