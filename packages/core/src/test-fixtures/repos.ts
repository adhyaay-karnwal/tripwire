import type { CachedRepo } from "@tripwire/db/schema/github-cache"

const DEFAULT_REPO: CachedRepo = {
  name: "example-repo",
  fullName: "test-user/example-repo",
  htmlUrl: "https://github.com/test-user/example-repo",
  description: "Example repository",
  stars: 5,
  forks: 0,
  language: "TypeScript",
  isFork: false,
  createdAt: "2022-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  pushedAt: "2024-01-01T00:00:00Z",
  defaultBranch: "main",
  openIssuesCount: 0,
  topics: [],
  license: "MIT",
  size: 100,
  archived: false,
}

export function makeRepo(overrides: Partial<CachedRepo> = {}): CachedRepo {
  return { ...DEFAULT_REPO, ...overrides }
}
