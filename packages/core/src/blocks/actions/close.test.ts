import { describe, it, expect } from "vitest"
import { close } from "./close"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/close", () => {
  it("returns base detail with empty data", () => {
    const result = close.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: close")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = close.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
