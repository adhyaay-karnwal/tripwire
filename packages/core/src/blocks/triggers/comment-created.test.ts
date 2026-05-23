import { describe, it, expect } from "vitest"
import { commentCreated } from "./comment-created"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/commentCreated", () => {
  it("passes with detail mentioning subtype", () => {
    const result = commentCreated.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("comment_created")
  })
})
