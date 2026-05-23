import { describe, it, expect } from "vitest"
import { label } from "./label"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/label", () => {
  it("returns base detail with empty data", () => {
    const result = label.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: label")
  })

  it("includes label in detail when provided", () => {
    const result = label.evaluate({ label: "needs-review" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("Execute: label")
    expect(result.detail).toContain(`label "needs-review"`)
  })
})
