import { describe, it, expect } from "vitest"
import { publicRepos } from "./public-repos"
import { makeUser } from "../../test-fixtures"

describe("publicRepos", () => {
  it("returns the public_repos count from ghUser", () => {
    const input = makeUser({ ghUser: { public_repos: 42 } })
    expect(publicRepos.resolve(input)).toBe(42)
  })

  it("returns 0 when ghUser is null", () => {
    expect(publicRepos.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 when public_repos is missing", () => {
    const input = makeUser({ ghUser: { public_repos: undefined } })
    expect(publicRepos.resolve(input)).toBe(0)
  })

  it("returns 0 for a brand new account", () => {
    const input = makeUser({ ghUser: { public_repos: 0 } })
    expect(publicRepos.resolve(input)).toBe(0)
  })
})
