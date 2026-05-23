import { describe, it, expect } from "vitest"
import { commentAction } from "./comment"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/comment", () => {
  it("returns base detail with empty data", () => {
    const result = commentAction.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: comment")
  })

  it("includes message in detail when provided", () => {
    const result = commentAction.evaluate(
      { message: "Welcome contributor" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("Execute: comment")
    expect(result.detail).toContain(`"Welcome contributor"`)
  })
})
