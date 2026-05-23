import { describe, it, expect } from "vitest"
import { hasBio } from "./has-bio"
import { makeUser } from "../../test-fixtures"

describe("hasBio", () => {
  it("returns true when bio is a non-empty string", () => {
    const input = makeUser({ ghUser: { bio: "Hello world" } })
    expect(hasBio.resolve(input)).toBe(true)
  })

  it("returns false when bio is an empty string", () => {
    const input = makeUser({ ghUser: { bio: "" } })
    expect(hasBio.resolve(input)).toBe(false)
  })

  it("returns false when bio is null", () => {
    const input = makeUser({ ghUser: { bio: null } })
    expect(hasBio.resolve(input)).toBe(false)
  })

  it("returns false when ghUser is null", () => {
    expect(hasBio.resolve(makeUser({ ghUser: null }))).toBe(false)
  })
})
