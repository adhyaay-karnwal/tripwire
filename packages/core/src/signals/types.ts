import type { GitHubUserGraphQL } from "@tripwire/github/user"

export type SignalType = "number" | "boolean" | "string"

export type SignalCategory =
  | "account"
  | "contributions"
  | "social"
  | "content"
  | "reputation"
  | "redFlags"
  | "badges"
  | "profile"

export interface GitHubUserRaw {
  login?: string
  id?: number
  type?: string
  created_at?: string
  bio?: string | null
  company?: string | null
  blog?: string | null
  twitter_username?: string | null
  two_factor_authentication?: boolean
  public_repos?: number
  public_gists?: number
  followers?: number
  following?: number
}

export interface RepoReputationData {
  score: number
  totalBlocks: number
  totalAllows: number
  totalNearMisses: number
  isWhitelisted: boolean
  isBlacklisted: boolean
}

export interface PrTemporalData {
  creationIntervals: number[]
  timeToMerge: number[]
  maxPrsInOneHourWindow: number
}

export interface EnrichmentData {
  graphql?: GitHubUserGraphQL | null
  hasProfileReadme?: boolean
  achievementCount?: number
  nonForkRepoCount?: number
  forkRepoCount?: number
  prTemporalData?: PrTemporalData | null
  filesChanged?: number
}

export interface SignalInput {
  ghUser: GitHubUserRaw | null
  contentText?: string
  repoReputation: RepoReputationData | null
  enrichment?: EnrichmentData
}

export interface SignalMeta {
  id: string
  name: string
  category: SignalCategory
  type: SignalType
  description: string
  requiresEnrichment?: boolean
}

export interface Signal<T = unknown> extends SignalMeta {
  resolve(input: SignalInput): T
}

export interface SignalCategoryInfo {
  id: SignalCategory
  name: string
}

export const SIGNAL_CATEGORIES: readonly SignalCategoryInfo[] = [
  { id: "account", name: "Account" },
  { id: "contributions", name: "Contributions" },
  { id: "social", name: "Social" },
  { id: "content", name: "Content" },
  { id: "reputation", name: "Reputation" },
  { id: "redFlags", name: "Red Flags" },
  { id: "badges", name: "Badges" },
  { id: "profile", name: "Profile" },
] as const

export type NumberOperator = ">" | ">=" | "<" | "<=" | "==" | "!="
export type BooleanOperator = "is" | "is not"
export type StringOperator = "equals" | "contains" | "matches" | "not_equals"
export type SignalOperator = NumberOperator | BooleanOperator | StringOperator

export function getOperatorsForType(type: SignalType): SignalOperator[] {
  switch (type) {
    case "number":
      return [">", ">=", "<", "<=", "==", "!="]
    case "boolean":
      return ["is", "is not"]
    case "string":
      return ["equals", "contains", "matches", "not_equals"]
  }
}
