import { describe, it, expect } from "vitest"
import { manual } from "./manual"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/manual", () => {
  it("passes with detail mentioning subtype", () => {
    const result = manual.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("manual")
  })
})
