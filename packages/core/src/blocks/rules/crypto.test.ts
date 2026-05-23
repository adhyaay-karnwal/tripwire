import { describe, it, expect } from "vitest"
import { crypto } from "./crypto"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/crypto", () => {
  it("passes when content has no crypto addresses", () => {
    const ctx = makeCtx({ contentText: "Hello, this is a normal PR body." })
    const result = crypto.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("no crypto addresses")
  })

  it("fails when content contains an Ethereum address", () => {
    const ctx = makeCtx({
      contentText: "Send to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1 now.",
    })
    const result = crypto.evaluate({}, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("crypto address detected")
  })

  it("fails when content contains a Bitcoin address", () => {
    const ctx = makeCtx({
      contentText: "Pay 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 today.",
    })
    const result = crypto.evaluate({}, ctx)
    expect(result.pass).toBe(false)
  })

  it("skips when no content text is provided", () => {
    const result = crypto.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("SKIP")).toBe(true)
  })
})
