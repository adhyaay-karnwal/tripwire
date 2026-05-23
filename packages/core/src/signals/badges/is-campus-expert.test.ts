import { describe, it, expect } from "vitest"
import { isCampusExpert } from "./is-campus-expert"
import { makeUser } from "../../test-fixtures"

describe("isCampusExpert", () => {
  it("returns true when graphql flag is set", () => {
    const input = makeUser({
      enrichment: { graphql: { isCampusExpert: true } },
    })
    expect(isCampusExpert.resolve(input)).toBe(true)
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(isCampusExpert.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(isCampusExpert.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
