import { describe, it, expect } from "vitest"
import { issueOpened } from "./issue-opened"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/issueOpened", () => {
  it("passes with detail mentioning subtype", () => {
    const result = issueOpened.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("issue_opened")
  })
})
