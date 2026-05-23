import { describe, it, expect } from "vitest"
import { accountAgeDays } from "./account-age-days"
import { daysAgo, makeUser } from "../../test-fixtures"

describe("accountAgeDays", () => {
  it("counts whole days since created_at", () => {
    const input = makeUser({ ghUser: { created_at: daysAgo(365) } })
    expect(accountAgeDays.resolve(input)).toBe(365)
  })

  it("returns 0 when ghUser is null", () => {
    expect(accountAgeDays.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 when created_at is missing", () => {
    const input = makeUser({ ghUser: { created_at: undefined } })
    expect(accountAgeDays.resolve(input)).toBe(0)
  })

  it("returns 0 for an account created today", () => {
    const input = makeUser({ ghUser: { created_at: new Date().toISOString() } })
    expect(accountAgeDays.resolve(input)).toBe(0)
  })
})
