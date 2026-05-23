import { describe, it, expect } from "vitest"
import { mergedPrs } from "./merged-prs"
import { makeUser } from "../../test-fixtures"

describe("mergedPrs", () => {
  it("is currently a placeholder and always returns 0", () => {
    expect(mergedPrs.resolve(makeUser())).toBe(0)
  })

  it("returns 0 when ghUser is null", () => {
    expect(mergedPrs.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 even with rich enrichment data", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionsLastYear: 5000 } },
    })
    expect(mergedPrs.resolve(input)).toBe(0)
  })
})
