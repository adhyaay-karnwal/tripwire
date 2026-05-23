import { describe, it, expect } from "vitest"
import { mergeRatio } from "./merge-ratio"
import { makeUser } from "../../test-fixtures"

describe("mergeRatio", () => {
  it("is currently a placeholder and always returns 0", () => {
    expect(mergeRatio.resolve(makeUser())).toBe(0)
  })

  it("returns 0 when ghUser is null", () => {
    expect(mergeRatio.resolve(makeUser({ ghUser: null }))).toBe(0)
  })

  it("returns 0 even with rich enrichment data", () => {
    const input = makeUser({
      enrichment: { graphql: { contributionsLastYear: 5000 } },
    })
    expect(mergeRatio.resolve(input)).toBe(0)
  })
})
