import { describe, it, expect } from "vitest"
import { totalNearMisses } from "./total-near-misses"
import { makeUser } from "../../test-fixtures"

describe("totalNearMisses", () => {
  it("returns the totalNearMisses count from repoReputation", () => {
    const input = makeUser({ repoReputation: { totalNearMisses: 2 } })
    expect(totalNearMisses.resolve(input)).toBe(2)
  })

  it("returns 0 when repoReputation is null", () => {
    expect(totalNearMisses.resolve(makeUser({ repoReputation: null }))).toBe(0)
  })

  it("returns 0 when the user has no near-miss history", () => {
    const input = makeUser({ repoReputation: { totalNearMisses: 0 } })
    expect(totalNearMisses.resolve(input)).toBe(0)
  })
})
