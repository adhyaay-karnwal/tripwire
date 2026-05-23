import { describe, it, expect } from "vitest"
import { isWhitelisted } from "./is-whitelisted"
import { makeUser } from "../../test-fixtures"

describe("isWhitelisted", () => {
  it("returns true when the user is whitelisted", () => {
    const input = makeUser({ repoReputation: { isWhitelisted: true } })
    expect(isWhitelisted.resolve(input)).toBe(true)
  })

  it("returns false when the user is not whitelisted", () => {
    const input = makeUser({ repoReputation: { isWhitelisted: false } })
    expect(isWhitelisted.resolve(input)).toBe(false)
  })

  it("returns false when repoReputation is null", () => {
    expect(isWhitelisted.resolve(makeUser({ repoReputation: null }))).toBe(
      false
    )
  })
})
