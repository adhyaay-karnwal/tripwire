import { describe, it, expect } from "vitest"
import { maxPrsPerDay } from "./max-prs-per-day"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/maxPrsPerDay", () => {
  it("passes when PRs today are within limit", () => {
    const ctx = makeCtx({ prsToday: 3 })
    const result = maxPrsPerDay.evaluate({ params: { limit: 5 } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("3 PRs today")
  })

  it("fails when PRs today exceed limit", () => {
    const ctx = makeCtx({ prsToday: 10 })
    const result = maxPrsPerDay.evaluate({ params: { limit: 5 } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("limit: 5")
  })

  it("uses default limit of 5 when none provided", () => {
    const ctx = makeCtx({ prsToday: 6 })
    expect(maxPrsPerDay.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ prsToday: 5 })
    expect(maxPrsPerDay.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing prsToday as 1 (passes default)", () => {
    const result = maxPrsPerDay.evaluate({ params: { limit: 5 } }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("1 PRs today")
  })
})
