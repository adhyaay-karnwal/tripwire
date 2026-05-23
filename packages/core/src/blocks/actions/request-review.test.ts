import { describe, it, expect } from "vitest"
import { requestReview } from "./request-review"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/requestReview", () => {
  it("returns base detail with empty data", () => {
    const result = requestReview.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: request_review")
  })

  it("always passes with detail starting with Execute:", () => {
    const result = requestReview.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("Execute: ")).toBe(true)
  })
})
