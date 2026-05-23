import { describe, it, expect } from "vitest"
import { addToBlacklist } from "./add-to-blacklist"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/addToBlacklist", () => {
  it("returns base detail with empty data", () => {
    const result = addToBlacklist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: add_to_blacklist")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = addToBlacklist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
