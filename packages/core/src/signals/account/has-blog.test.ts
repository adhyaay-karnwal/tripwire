import { describe, it, expect } from "vitest"
import { hasBlog } from "./has-blog"
import { makeUser } from "../../test-fixtures"

describe("hasBlog", () => {
  it("returns true when blog is a non-empty URL", () => {
    const input = makeUser({ ghUser: { blog: "https://example.com" } })
    expect(hasBlog.resolve(input)).toBe(true)
  })

  it("returns false when blog is an empty string", () => {
    const input = makeUser({ ghUser: { blog: "" } })
    expect(hasBlog.resolve(input)).toBe(false)
  })

  it("returns false when blog is null", () => {
    const input = makeUser({ ghUser: { blog: null } })
    expect(hasBlog.resolve(input)).toBe(false)
  })

  it("returns false when ghUser is null", () => {
    expect(hasBlog.resolve(makeUser({ ghUser: null }))).toBe(false)
  })
})
