import { describe, it, expect } from "vitest"
import { vouchedUsersOnly } from "./vouched-users-only"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/vouchedUsersOnly", () => {
  it("passes when user is vouched", () => {
    const ctx = makeCtx({ isVouched: true })
    const result = vouchedUsersOnly.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("user is vouched")
  })

  it("fails when user is not vouched", () => {
    const ctx = makeCtx({ isVouched: false })
    const result = vouchedUsersOnly.evaluate({}, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("is not vouched")
  })

  it("fails when isVouched is missing from ctx", () => {
    expect(vouchedUsersOnly.evaluate({}, makeCtx()).pass).toBe(false)
  })

  it("ignores vouchScope param value (param exists but unused by evaluator)", () => {
    const ctx = makeCtx({ isVouched: true })
    expect(
      vouchedUsersOnly.evaluate({ params: { vouchScope: "global" } }, ctx).pass
    ).toBe(true)
  })
})
