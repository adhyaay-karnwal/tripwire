import { describe, it, expect } from "vitest"
import { contentLength } from "./content-length"
import { makeUser } from "../../test-fixtures"

describe("contentLength", () => {
  it("returns the character length of contentText", () => {
    const input = makeUser({ contentText: "hello world" })
    expect(contentLength.resolve(input)).toBe(11)
  })

  it("returns 0 when contentText is omitted", () => {
    expect(contentLength.resolve(makeUser())).toBe(0)
  })

  it("returns 0 for an empty string", () => {
    expect(contentLength.resolve(makeUser({ contentText: "" }))).toBe(0)
  })
})
