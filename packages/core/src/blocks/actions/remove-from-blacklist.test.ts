import { describe, it, expect } from "vitest"
import { removeFromBlacklist } from "./remove-from-blacklist"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/removeFromBlacklist", () => {
  it("returns base detail with empty data", () => {
    const result = removeFromBlacklist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: remove_from_blacklist")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = removeFromBlacklist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
