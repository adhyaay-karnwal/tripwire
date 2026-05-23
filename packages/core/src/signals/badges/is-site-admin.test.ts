import { describe, it, expect } from "vitest"
import { isSiteAdmin } from "./is-site-admin"
import { makeUser } from "../../test-fixtures"

describe("isSiteAdmin", () => {
  it("returns true when graphql flag is set", () => {
    const input = makeUser({ enrichment: { graphql: { isSiteAdmin: true } } })
    expect(isSiteAdmin.resolve(input)).toBe(true)
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(isSiteAdmin.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(isSiteAdmin.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
