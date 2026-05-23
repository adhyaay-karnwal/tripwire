import { describe, it, expect } from "vitest"
import { forkHeavy } from "./fork-heavy"
import { makeUser } from "../../test-fixtures"

describe("forkHeavy", () => {
  it("returns true for high forks and low non-forks", () => {
    const input = makeUser({
      enrichment: { forkRepoCount: 60, nonForkRepoCount: 1 },
    })
    expect(forkHeavy.resolve(input)).toBe(true)
  })

  it("returns false for high forks but also high non-forks", () => {
    const input = makeUser({
      enrichment: { forkRepoCount: 60, nonForkRepoCount: 10 },
    })
    expect(forkHeavy.resolve(input)).toBe(false)
  })

  it("returns false for low forks and low non-forks", () => {
    const input = makeUser({
      enrichment: { forkRepoCount: 5, nonForkRepoCount: 1 },
    })
    expect(forkHeavy.resolve(input)).toBe(false)
  })

  it("returns false for low forks but high non-forks", () => {
    const input = makeUser({
      enrichment: { forkRepoCount: 5, nonForkRepoCount: 20 },
    })
    expect(forkHeavy.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(forkHeavy.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
