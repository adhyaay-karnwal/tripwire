import { describe, it, expect } from "vitest"
import { publicGists } from "./public-gists"
import { makeUser } from "../../test-fixtures"

describe("publicGists", () => {
  it("returns the public_gists count from ghUser", () => {
    const input = makeUser({ ghUser: { public_gists: 7 } })
    expect(publicGists.resolve(input)).toBe(7)
  })

  it("returns 0 when ghUser is null", () => {
    expect(publicGists.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 when public_gists is missing", () => {
    const input = makeUser({ ghUser: { public_gists: undefined } })
    expect(publicGists.resolve(input)).toBe(0)
  })

  it("returns 0 for a user with no gists", () => {
    const input = makeUser({ ghUser: { public_gists: 0 } })
    expect(publicGists.resolve(input)).toBe(0)
  })
})
