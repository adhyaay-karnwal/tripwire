import { describe, it, expect } from "vitest"
import { nonForkRepos } from "./non-fork-repos"
import { makeUser } from "../../test-fixtures"

describe("nonForkRepos", () => {
  it("returns the nonForkRepoCount from enrichment", () => {
    const input = makeUser({ enrichment: { nonForkRepoCount: 8 } })
    expect(nonForkRepos.resolve(input)).toBe(8)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(nonForkRepos.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when nonForkRepoCount is missing", () => {
    const input = makeUser({ enrichment: { nonForkRepoCount: undefined } })
    expect(nonForkRepos.resolve(input)).toBe(0)
  })

  it("returns 0 for a user with only forks", () => {
    const input = makeUser({ enrichment: { nonForkRepoCount: 0 } })
    expect(nonForkRepos.resolve(input)).toBe(0)
  })
})
