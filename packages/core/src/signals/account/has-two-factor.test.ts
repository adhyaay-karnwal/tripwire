import { describe, it, expect } from "vitest"
import { hasTwoFactor } from "./has-two-factor"
import { makeUser } from "../../test-fixtures"

describe("hasTwoFactor", () => {
  it("returns true when 2FA is enabled", () => {
    const input = makeUser({ ghUser: { two_factor_authentication: true } })
    expect(hasTwoFactor.resolve(input)).toBe(true)
  })

  it("returns false when 2FA is disabled", () => {
    const input = makeUser({ ghUser: { two_factor_authentication: false } })
    expect(hasTwoFactor.resolve(input)).toBe(false)
  })

  it("returns false when ghUser is null", () => {
    expect(hasTwoFactor.resolve(makeUser({ ghUser: null }))).toBe(false)
  })

  it("returns false when two_factor_authentication is missing", () => {
    const input = makeUser({ ghUser: { two_factor_authentication: undefined } })
    expect(hasTwoFactor.resolve(input)).toBe(false)
  })
})
