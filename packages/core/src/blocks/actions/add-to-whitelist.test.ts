import { describe, it, expect } from "vitest"
import { addToWhitelist } from "./add-to-whitelist"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/addToWhitelist", () => {
  it("returns base detail with empty data", () => {
    const result = addToWhitelist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: add_to_whitelist")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = addToWhitelist.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
