import { describe, it, expect } from "vitest"
import { isGitHubStar } from "./is-github-star"
import { makeUser } from "../../test-fixtures"

describe("isGitHubStar", () => {
  it("returns true when graphql flag is set", () => {
    const input = makeUser({ enrichment: { graphql: { isGitHubStar: true } } })
    expect(isGitHubStar.resolve(input)).toBe(true)
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(isGitHubStar.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(isGitHubStar.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
