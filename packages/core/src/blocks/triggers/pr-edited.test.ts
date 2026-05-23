import { describe, it, expect } from "vitest"
import { prEdited } from "./pr-edited"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/prEdited", () => {
  it("passes with detail mentioning subtype", () => {
    const result = prEdited.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("pr_edited")
  })
})
