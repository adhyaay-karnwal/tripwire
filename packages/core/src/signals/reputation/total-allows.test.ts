import { describe, it, expect } from "vitest"
import { totalAllows } from "./total-allows"
import { makeUser } from "../../test-fixtures"

describe("totalAllows", () => {
  it("returns the totalAllows count from repoReputation", () => {
    const input = makeUser({ repoReputation: { totalAllows: 21 } })
    expect(totalAllows.resolve(input)).toBe(21)
  })

  it("returns 0 when repoReputation is null", () => {
    expect(totalAllows.resolve(makeUser({ repoReputation: null }))).toBe(0)
  })

  it("returns 0 when the user has no prior allows", () => {
    const input = makeUser({ repoReputation: { totalAllows: 0 } })
    expect(totalAllows.resolve(input)).toBe(0)
  })
})
