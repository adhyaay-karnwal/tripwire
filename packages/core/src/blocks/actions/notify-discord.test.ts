import { describe, it, expect } from "vitest"
import { notifyDiscord } from "./notify-discord"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/notifyDiscord", () => {
  it("returns base detail with empty data", () => {
    const result = notifyDiscord.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: notify_discord")
  })

  it("includes message in detail when provided", () => {
    const result = notifyDiscord.evaluate(
      { message: "moderation alert" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain(`"moderation alert"`)
  })

  it("includes url in detail when provided", () => {
    const result = notifyDiscord.evaluate(
      { url: "https://discord.com/api/webhooks/123/abc" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("https://discord.com/api/webhooks/123/abc")
  })
})
