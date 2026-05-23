import type {
  EnrichmentData,
  GitHubUserRaw,
  PrTemporalData,
  RepoReputationData,
  SignalInput,
} from "../signals/types"
import type { GitHubUserGraphQL } from "@tripwire/github/user"

const DEFAULT_GH_USER: GitHubUserRaw = {
  login: "test-user",
  id: 12345,
  type: "User",
  created_at: "2020-01-01T00:00:00Z",
  bio: "Software engineer",
  company: "@example",
  blog: "https://example.com",
  twitter_username: "testuser",
  two_factor_authentication: true,
  public_repos: 12,
  public_gists: 0,
  followers: 50,
  following: 30,
}

const DEFAULT_REPO_REPUTATION: RepoReputationData = {
  score: 50,
  totalBlocks: 0,
  totalAllows: 0,
  totalNearMisses: 0,
  isWhitelisted: false,
  isBlacklisted: false,
}

const DEFAULT_GRAPHQL: GitHubUserGraphQL = {
  hasSponsorsListing: false,
  isBountyHunter: false,
  isCampusExpert: false,
  isDeveloperProgramMember: false,
  isGitHubStar: false,
  isHireable: false,
  isSiteAdmin: false,
  sponsoringCount: 0,
  sponsorsCount: 0,
  contributionYears: [],
  contributionsLastYear: 0,
  organizations: [],
  socialAccounts: [],
  topRepositories: [],
}

const DEFAULT_PR_TEMPORAL: PrTemporalData = {
  creationIntervals: [],
  timeToMerge: [],
  maxPrsInOneHourWindow: 0,
}

const DEFAULT_ENRICHMENT: EnrichmentData = {
  graphql: DEFAULT_GRAPHQL,
  hasProfileReadme: false,
  achievementCount: 0,
  nonForkRepoCount: 0,
  forkRepoCount: 0,
  prTemporalData: null,
  filesChanged: 0,
}

export interface MakeUserOverrides {
  ghUser?: Partial<GitHubUserRaw> | null
  contentText?: string
  repoReputation?: Partial<RepoReputationData> | null
  enrichment?: MakeEnrichmentOverrides | null
}

export interface MakeEnrichmentOverrides extends Omit<
  Partial<EnrichmentData>,
  "graphql" | "prTemporalData"
> {
  graphql?: Partial<GitHubUserGraphQL> | null
  prTemporalData?: Partial<PrTemporalData> | null
}

export function makeUser(overrides: MakeUserOverrides = {}): SignalInput {
  const ghUser =
    overrides.ghUser === null
      ? null
      : { ...DEFAULT_GH_USER, ...(overrides.ghUser ?? {}) }

  const repoReputation =
    overrides.repoReputation === null
      ? null
      : { ...DEFAULT_REPO_REPUTATION, ...(overrides.repoReputation ?? {}) }

  const enrichment =
    overrides.enrichment === null
      ? undefined
      : makeEnrichment(overrides.enrichment)

  return {
    ghUser,
    contentText: overrides.contentText,
    repoReputation,
    enrichment,
  }
}

export function makeEnrichment(
  overrides: MakeEnrichmentOverrides = {}
): EnrichmentData {
  const { graphql, prTemporalData, ...rest } = overrides
  return {
    ...DEFAULT_ENRICHMENT,
    ...rest,
    graphql:
      graphql === null ? null : { ...DEFAULT_GRAPHQL, ...(graphql ?? {}) },
    prTemporalData:
      prTemporalData === null || prTemporalData === undefined
        ? (prTemporalData ?? null)
        : { ...DEFAULT_PR_TEMPORAL, ...prTemporalData },
  }
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}
