import { describe, it, expect } from "vitest"
import { prOpened } from "./pr-opened"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/prOpened", () => {
  it("passes with detail mentioning subtype", () => {
    const result = prOpened.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("pr_opened")
  })
})
