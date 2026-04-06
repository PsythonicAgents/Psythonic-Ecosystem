export interface AgentCapabilities {
  canAnswerProtocolQuestions: boolean
  canAnswerTokenQuestions: boolean
  canDescribeTooling: boolean
  canReportEcosystemNews: boolean
  canRunDiagnostics?: boolean
  canSummarizeData?: boolean
}

export interface AgentFlags {
  requiresExactInvocation: boolean
  noAdditionalCommentary: boolean
  caseSensitiveQueries?: boolean
  strictJsonOutput?: boolean
}

export const SOLANA_AGENT_CAPABILITIES: AgentCapabilities = {
  canAnswerProtocolQuestions: true,
  canAnswerTokenQuestions: true,
  canDescribeTooling: true,
  canReportEcosystemNews: true,
  canRunDiagnostics: true,
  canSummarizeData: true,
}

export const SOLANA_AGENT_FLAGS: AgentFlags = {
  requiresExactInvocation: true,
  noAdditionalCommentary: true,
  caseSensitiveQueries: false,
  strictJsonOutput: true,
}

/** Utility: merge capabilities with defaults */
export function defineCapabilities(overrides: Partial<AgentCapabilities> = {}): AgentCapabilities {
  return { ...SOLANA_AGENT_CAPABILITIES, ...overrides }
}

/** Utility: merge flags with defaults */
export function defineFlags(overrides: Partial<AgentFlags> = {}): AgentFlags {
  return { ...SOLANA_AGENT_FLAGS, ...overrides }
}
