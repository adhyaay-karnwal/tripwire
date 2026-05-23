import { describe, it, expect } from "vitest"
import { isBountyHunter } from "./is-bounty-hunter"
import { makeUser } from "../../test-fixtures"

describe("isBountyHunter", () => {
  it("returns true when graphql flag is set", () => {
    const input = makeUser({
      enrichment: { graphql: { isBountyHunter: true } },
    })
    expect(isBountyHunter.resolve(input)).toBe(true)
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(isBountyHunter.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(isBountyHunter.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
