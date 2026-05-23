import { describe, it, expect } from "vitest"
import { contributorScore } from "./contributor-score"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/contributorScore", () => {
  it("passes when score meets threshold", () => {
    const ctx = makeCtx({ signals: { score: 80 } })
    const result = contributorScore.evaluate({ params: { minScore: 50 } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("score is 80")
  })

  it("fails when score is below threshold", () => {
    const ctx = makeCtx({ signals: { score: 20 } })
    const result = contributorScore.evaluate({ params: { minScore: 50 } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("requires >= 50")
  })

  it("uses default threshold of 50 when none provided", () => {
    const ctx = makeCtx({ signals: { score: 49 } })
    expect(contributorScore.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ signals: { score: 50 } })
    expect(contributorScore.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing score as 0 (fails)", () => {
    expect(
      contributorScore.evaluate({ params: { minScore: 1 } }, makeCtx()).pass
    ).toBe(false)
  })

  it("is registered as hidden", () => {
    expect(contributorScore.hidden).toBe(true)
  })
})
