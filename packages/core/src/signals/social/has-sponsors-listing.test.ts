import { describe, it, expect } from "vitest"
import { hasSponsorsListing } from "./has-sponsors-listing"
import { makeUser } from "../../test-fixtures"

describe("hasSponsorsListing", () => {
  it("returns true when the user has a sponsors listing", () => {
    const input = makeUser({
      enrichment: { graphql: { hasSponsorsListing: true } },
    })
    expect(hasSponsorsListing.resolve(input)).toBe(true)
  })

  it("returns false when the user has no sponsors listing", () => {
    const input = makeUser({
      enrichment: { graphql: { hasSponsorsListing: false } },
    })
    expect(hasSponsorsListing.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(hasSponsorsListing.resolve(makeUser({ enrichment: null }))).toBe(
      false
    )
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(hasSponsorsListing.resolve(input)).toBe(false)
  })
})
