import { describe, it, expect } from "vitest"
import { following } from "./following"
import { makeUser } from "../../test-fixtures"

describe("following", () => {
  it("returns the following count from ghUser", () => {
    const input = makeUser({ ghUser: { following: 42 } })
    expect(following.resolve(input)).toBe(42)
  })

  it("returns 0 when ghUser is null", () => {
    expect(following.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 when following is missing", () => {
    const input = makeUser({ ghUser: { following: undefined } })
    expect(following.resolve(input)).toBe(0)
  })

  it("returns 0 when not following anyone", () => {
    const input = makeUser({ ghUser: { following: 0 } })
    expect(following.resolve(input)).toBe(0)
  })
})
