import { describe, it, expect } from "vitest"
import { contributionsLastYear } from "./contributions-last-year"
import { makeUser } from "../../test-fixtures"

describe("contributionsLastYear", () => {
  it("returns the value from enrichment.graphql", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionsLastYear: 1234 } },
    })
    expect(contributionsLastYear.resolve(input)).toBe(1234)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(contributionsLastYear.resolve(makeUser({ enrichment: null }))).toBe(
      0
    )
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(contributionsLastYear.resolve(input)).toBe(0)
  })

  it("returns 0 for a user with no contributions", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionsLastYear: 0 } },
    })
    expect(contributionsLastYear.resolve(input)).toBe(0)
  })
})
