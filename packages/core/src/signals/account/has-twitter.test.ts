import { describe, it, expect } from "vitest"
import { hasTwitter } from "./has-twitter"
import { makeUser } from "../../test-fixtures"

describe("hasTwitter", () => {
  it("returns true when twitter_username is set", () => {
    const input = makeUser({ ghUser: { twitter_username: "octocat" } })
    expect(hasTwitter.resolve(input)).toBe(true)
  })

  it("returns false when twitter_username is an empty string", () => {
    const input = makeUser({ ghUser: { twitter_username: "" } })
    expect(hasTwitter.resolve(input)).toBe(false)
  })

  it("returns false when twitter_username is null", () => {
    const input = makeUser({ ghUser: { twitter_username: null } })
    expect(hasTwitter.resolve(input)).toBe(false)
  })

  it("returns false when ghUser is null", () => {
    expect(hasTwitter.resolve(makeUser({ ghUser: null }))).toBe(false)
  })
})
