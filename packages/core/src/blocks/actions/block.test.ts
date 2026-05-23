import { describe, it, expect } from "vitest"
import { blockAction } from "./block"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/block", () => {
  it("returns base detail with empty data", () => {
    const result = blockAction.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: block")
  })

  it("includes message in detail when provided", () => {
    const result = blockAction.evaluate({ message: "spam PR" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("Execute: block")
    expect(result.detail).toContain(`"spam PR"`)
  })
})
