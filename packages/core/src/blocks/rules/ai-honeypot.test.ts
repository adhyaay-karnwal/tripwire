import { describe, it, expect } from "vitest"
import { aiHoneypot } from "./ai-honeypot"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/aiHoneypot", () => {
  it("passes when content is present (stubbed honeypot check)", () => {
    const ctx = makeCtx({ contentText: "Look at this great PR." })
    const result = aiHoneypot.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("honeypot check requires repo file")
  })

  it("skips when no content text is provided", () => {
    const result = aiHoneypot.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("SKIP")).toBe(true)
  })

  it("skips when content text is an empty string", () => {
    const ctx = makeCtx({ contentText: "" })
    const result = aiHoneypot.evaluate({}, ctx)
    expect(result.detail.startsWith("SKIP")).toBe(true)
  })
})
