import { describe, it, expect } from "vitest"
import { sendWebhook } from "./send-webhook"
import { makeCtx } from "../../test-fixtures"

describe("blocks/actions/sendWebhook", () => {
  it("returns base detail with empty data", () => {
    const result = sendWebhook.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Execute: send_webhook")
  })

  it("includes message in detail when provided", () => {
    const result = sendWebhook.evaluate({ message: "forward event" }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain(`"forward event"`)
  })

  it("includes url in detail when provided", () => {
    const result = sendWebhook.evaluate(
      { url: "https://api.example.com/hook" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("https://api.example.com/hook")
  })
})
