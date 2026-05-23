import { describe, it, expect } from "vitest"
import { warn } from "./warn"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/warn", () => {
  it("returns base detail with empty data", () => {
    const result = warn.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: warn")
  })

  it("includes message in detail when provided", () => {
    const result = warn.evaluate({ message: "missing profile info" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("Execute: warn")
    expect(result.detail).toContain(`"missing profile info"`)
  })
})
