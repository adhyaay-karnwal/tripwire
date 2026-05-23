import { describe, it, expect } from "vitest"
import { removeFromWhitelist } from "./remove-from-whitelist"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/removeFromWhitelist", () => {
  it("returns base detail with empty data", () => {
    const result = removeFromWhitelist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: remove_from_whitelist")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = removeFromWhitelist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
