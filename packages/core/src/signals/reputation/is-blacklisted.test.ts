import { describe, it, expect } from "vitest"
import { isBlacklisted } from "./is-blacklisted"
import { makeUser } from "../../test-fixtures"

describe("isBlacklisted", () => {
  it("returns true when the user is blacklisted", () => {
    const input = makeUser({ repoReputation: { isBlacklisted: true } })
    expect(isBlacklisted.resolve(input)).toBe(true)
  })

  it("returns false when the user is not blacklisted", () => {
    const input = makeUser({ repoReputation: { isBlacklisted: false } })
    expect(isBlacklisted.resolve(input)).toBe(false)
  })

  it("returns false when repoReputation is null", () => {
    expect(isBlacklisted.resolve(makeUser({ repoReputation: null }))).toBe(
      false
    )
  })
})
