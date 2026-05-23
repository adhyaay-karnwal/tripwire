import type { CachedPR } from "@tripwire/db/schema/github-cache"

const DEFAULT_PR: CachedPR = {
  title: "Add feature X",
  number: 1,
  htmlUrl: "https://github.com/example/repo/pull/1",
  state: "open",
  createdAt: "2024-01-01T00:00:00Z",
  closedAt: null,
  mergedAt: null,
  repoFullName: "example/repo",
  labels: [],
  authorLogin: "test-user",
  authorAvatar: "https://avatars.githubusercontent.com/u/12345",
  additions: 10,
  deletions: 2,
  changedFiles: 3,
  commits: 1,
  timeToMergeMinutes: null,
  draft: false,
  headSha: "abc1234",
  body: null,
  closedBy: null,
  selfClosed: null,
}

export function makePR(overrides: Partial<CachedPR> = {}): CachedPR {
  return { ...DEFAULT_PR, ...overrides }
}
