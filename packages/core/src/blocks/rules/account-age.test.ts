import { describe, it, expect } from "vitest"
import { accountAge } from "./account-age"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/accountAge", () => {
  it("passes when account meets threshold", () => {
    const ctx = makeCtx({ signals: { accountAgeDays: 365 } })
    const result = accountAge.evaluate({ params: { days: 30 } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("365d")
  })

  it("fails when account is too young", () => {
    const ctx = makeCtx({ signals: { accountAgeDays: 5 } })
    const result = accountAge.evaluate({ params: { days: 30 } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("5d")
    expect(result.detail).toContain("requires >= 30d")
  })

  it("uses default threshold of 30 when none provided", () => {
    const ctx = makeCtx({ signals: { accountAgeDays: 29 } })
    expect(accountAge.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ signals: { accountAgeDays: 30 } })
    expect(accountAge.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing accountAgeDays as 0 (fails)", () => {
    expect(accountAge.evaluate({ params: { days: 30 } }, makeCtx()).pass).toBe(
      false
    )
  })
})
