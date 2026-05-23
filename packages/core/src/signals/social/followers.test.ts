import { describe, it, expect } from "vitest"
import { followers } from "./followers"
import { makeUser } from "../../test-fixtures"

describe("followers", () => {
  it("returns the follower count from ghUser", () => {
    const input = makeUser({ ghUser: { followers: 1234 } })
    expect(followers.resolve(input)).toBe(1234)
  })

  it("returns 0 when ghUser is null", () => {
    expect(followers.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 when followers is missing", () => {
    const input = makeUser({ ghUser: { followers: undefined } })
    expect(followers.resolve(input)).toBe(0)
  })

  it("returns 0 for a brand new account", () => {
    const input = makeUser({ ghUser: { followers: 0 } })
    expect(followers.resolve(input)).toBe(0)
  })
})
