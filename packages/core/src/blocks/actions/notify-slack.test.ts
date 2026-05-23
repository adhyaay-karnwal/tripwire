import { describe, it, expect } from "vitest"
import { notifySlack } from "./notify-slack"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/notifySlack", () => {
  it("returns base detail with empty data", () => {
    const result = notifySlack.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: notify_slack")
  })

  it("includes message in detail when provided", () => {
    const result = notifySlack.evaluate({ message: "suspicious PR" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain(`"suspicious PR"`)
  })

  it("includes url in detail when provided", () => {
    const result = notifySlack.evaluate(
      { url: "https://hooks.slack.com/services/X/Y/Z" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("https://hooks.slack.com/services/X/Y/Z")
  })
})
