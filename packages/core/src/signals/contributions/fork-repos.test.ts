import { describe, it, expect } from "vitest"
import { forkRepos } from "./fork-repos"
import { makeUser } from "../../test-fixtures"

describe("forkRepos", () => {
  it("returns the forkRepoCount from enrichment", () => {
    const input = makeUser({ enrichment: { forkRepoCount: 15 } })
    expect(forkRepos.resolve(input)).toBe(15)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(forkRepos.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when forkRepoCount is missing", () => {
    const input = makeUser({ enrichment: { forkRepoCount: undefined } })
    expect(forkRepos.resolve(input)).toBe(0)
  })

  it("returns 0 for a user with no forks", () => {
    const input = makeUser({ enrichment: { forkRepoCount: 0 } })
    expect(forkRepos.resolve(input)).toBe(0)
  })
})
