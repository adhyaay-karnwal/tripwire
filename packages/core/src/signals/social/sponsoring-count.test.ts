import { describe, it, expect } from "vitest"
import { sponsoringCount } from "./sponsoring-count"
import { makeUser } from "../../test-fixtures"

describe("sponsoringCount", () => {
  it("returns the sponsoringCount from enrichment graphql", () => {
    const input = makeUser({ enrichment: { graphql: { sponsoringCount: 3 } } })
    expect(sponsoringCount.resolve(input)).toBe(3)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(sponsoringCount.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(sponsoringCount.resolve(input)).toBe(0)
  })

  it("returns 0 for a user sponsoring nobody", () => {
    const input = makeUser({ enrichment: { graphql: { sponsoringCount: 0 } } })
    expect(sponsoringCount.resolve(input)).toBe(0)
  })
})
