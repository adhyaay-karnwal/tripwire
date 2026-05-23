import { describe, it, expect } from "vitest"
import { log } from "./log"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/log", () => {
  it("returns base detail with empty data", () => {
    const result = log.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: log")
  })

  it("includes message in detail when provided", () => {
    const result = log.evaluate({ message: "suspicious activity" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("Execute: log")
    expect(result.detail).toContain(`"suspicious activity"`)
  })
})
