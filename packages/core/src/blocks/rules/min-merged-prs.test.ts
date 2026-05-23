import { describe, it, expect } from "vitest"
import { minMergedPrs } from "./min-merged-prs"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/minMergedPrs", () => {
  it("passes when merged PRs meet threshold", () => {
    const ctx = makeCtx({ signals: { mergedPrs: 20 } })
    const result = minMergedPrs.evaluate({ params: { count: 15 } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("20 merged PRs")
  })

  it("fails when merged PRs are below threshold", () => {
    const ctx = makeCtx({ signals: { mergedPrs: 3 } })
    const result = minMergedPrs.evaluate({ params: { count: 15 } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("requires >= 15")
  })

  it("uses default threshold of 15 when none provided", () => {
    const ctx = makeCtx({ signals: { mergedPrs: 14 } })
    expect(minMergedPrs.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ signals: { mergedPrs: 15 } })
    expect(minMergedPrs.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing mergedPrs as 0 (fails)", () => {
    expect(
      minMergedPrs.evaluate({ params: { count: 1 } }, makeCtx()).pass
    ).toBe(false)
  })
})
