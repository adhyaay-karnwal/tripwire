import { describe, it, expect } from "vitest"
import { closedPrs } from "./closed-prs"
import { makeUser } from "../../test-fixtures"

describe("closedPrs", () => {
  it("is currently a placeholder and always returns 0", () => {
    expect(closedPrs.resolve(makeUser())).toBe(0)
  })

  it("returns 0 when ghUser is null", () => {
    expect(closedPrs.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 even with rich enrichment data", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionsLastYear: 5000 } },
    })
    expect(closedPrs.resolve(input)).toBe(0)
  })
})
