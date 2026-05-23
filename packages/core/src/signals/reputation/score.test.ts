import { describe, it, expect } from "vitest"
import { score } from "./score"
import { makeUser } from "../../test-fixtures"

describe("score", () => {
  it("returns the score from repoReputation", () => {
    const input = makeUser({ repoReputation: { score: 87 } })
    expect(score.resolve(input)).toBe(87)
  })

  it("returns 0 when repoReputation is null", () => {
    expect(score.resolve(makeUser({ repoReputation: null }))).toBe(0)
  })

  it("returns 0 for a fresh user with no reputation history", () => {
    const input = makeUser({ repoReputation: { score: 0 } })
    expect(score.resolve(input)).toBe(0)
  })
})
