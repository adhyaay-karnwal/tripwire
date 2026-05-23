import { describe, it, expect } from "vitest"
import { sponsorsCount } from "./sponsors-count"
import { makeUser } from "../../test-fixtures"

describe("sponsorsCount", () => {
  it("returns the sponsorsCount from enrichment graphql", () => {
    const input = makeUser({ enrichment: { graphql: { sponsorsCount: 7 } } })
    expect(sponsorsCount.resolve(input)).toBe(7)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(sponsorsCount.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(sponsorsCount.resolve(input)).toBe(0)
  })

  it("returns 0 for a user with no sponsors", () => {
    const input = makeUser({ enrichment: { graphql: { sponsorsCount: 0 } } })
    expect(sponsorsCount.resolve(input)).toBe(0)
  })
})
