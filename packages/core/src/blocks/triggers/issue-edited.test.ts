import { describe, it, expect } from "vitest"
import { issueEdited } from "./issue-edited"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/issueEdited", () => {
  it("passes with detail mentioning subtype", () => {
    const result = issueEdited.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("issue_edited")
  })
})
