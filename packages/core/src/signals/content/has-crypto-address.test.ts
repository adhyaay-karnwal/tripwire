import { describe, it, expect } from "vitest"
import { hasCryptoAddress } from "./has-crypto-address"
import { makeUser } from "../../test-fixtures"

describe("hasCryptoAddress", () => {
  it("is currently a placeholder and always returns false", () => {
    expect(hasCryptoAddress.resolve(makeUser())).toBe(false)
  })

  it("returns false even when content includes an address-like string", () => {
    const input = makeUser({
      contentText: "send to 0xAbC1234567890123456789012345678901234567",
    })
    expect(hasCryptoAddress.resolve(input)).toBe(false)
  })

  it("returns false when all inputs are null/undefined", () => {
    const input = makeUser({
      ghUser: null,
      repoReputation: null,
      enrichment: null,
    })
    expect(hasCryptoAddress.resolve(input)).toBe(false)
  })
})
