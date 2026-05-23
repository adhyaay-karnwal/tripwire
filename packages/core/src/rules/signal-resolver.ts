import { resolveAllSignals } from "../signals"
import type {
  EnrichmentData,
  GitHubUserRaw,
  RepoReputationData,
} from "../signals/types"

export type { EnrichmentData, RepoReputationData }

export interface ResolverContext {
  senderLogin: string
  senderId: number
  prNumber?: number
}

export function resolveSignals(
  _ctx: ResolverContext,
  ghUser: Record<string, unknown> | null,
  contentText: string | undefined,
  repoReputation: RepoReputationData | null,
  enrichmentData?: EnrichmentData
): Record<string, unknown> {
  return resolveAllSignals({
    ghUser: ghUser as GitHubUserRaw | null,
    contentText,
    repoReputation,
    enrichment: enrichmentData,
  })
}
