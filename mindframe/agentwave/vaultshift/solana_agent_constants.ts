/** Unique identifier for the Solana Knowledge Agent */
export const SOLANA_KNOWLEDGE_AGENT_ID = "solana-knowledge-agent" as const

/** Human-readable label */
export const SOLANA_KNOWLEDGE_AGENT_LABEL = "Solana Knowledge Agent"

/** Version tag for compatibility checks */
export const SOLANA_KNOWLEDGE_AGENT_VERSION = "1.0.0"

/** Utility to check if an id matches the Solana Knowledge Agent */
export function isSolanaKnowledgeAgent(id: string): boolean {
  return id === SOLANA_KNOWLEDGE_AGENT_ID
}
