import { describe, it, expect } from "vitest"
import { computeScore } from "./compute-score"
import { makeCtx } from "../../test-fixtures"

describe("blocks/transforms/computeScore", () => {
  it("reads score from ctx and emits it as producedContext", () => {
    const ctx = makeCtx({ signals: { score: 75 } })
    const result = computeScore.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Computed score: 75/100")
    expect(result.producedContext).toEqual({ score: 75 })
  })

  it("falls back to 50 when score is missing", () => {
    const result = computeScore.evaluate({}, makeCtx())
    expect(result.detail).toBe("Computed score: 50/100")
    expect(result.producedContext).toEqual({ score: 50 })
  })

  it("handles 0 score (does not fallback)", () => {
    const ctx = makeCtx({ signals: { score: 0 } })
    const result = computeScore.evaluate({}, ctx)
    expect(result.detail).toBe("Computed score: 0/100")
    expect(result.producedContext).toEqual({ score: 0 })
  })
})
