import type { PRComment } from "@tripwire/github/data-factory"

const DEFAULT_COMMENT: PRComment = {
  id: 1,
  author: "test-user",
  authorAvatar: "https://avatars.githubusercontent.com/u/12345",
  body: "Looks good to me",
  createdAt: "2024-01-01T00:00:00Z",
  type: "comment",
}

export function makeComment(overrides: Partial<PRComment> = {}): PRComment {
  return { ...DEFAULT_COMMENT, ...overrides }
}
