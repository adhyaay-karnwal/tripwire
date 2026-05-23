import { describe, it, expect } from "vitest"
import { contributionYears } from "./contribution-years"
import { makeUser } from "../../test-fixtures"

describe("contributionYears", () => {
  it("returns the length of contributionYears", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionYears: [2021, 2022, 2023] } },
    })
    expect(contributionYears.resolve(input)).toBe(3)
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(contributionYears.resolve(input)).toBe(0)
  })

  it("returns 0 when the list is empty", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionYears: [] } },
    })
    expect(contributionYears.resolve(input)).toBe(0)
  })
})
