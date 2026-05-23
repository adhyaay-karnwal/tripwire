import { describe, it, expect } from "vitest"
import { isDeveloperProgramMember } from "./is-developer-program-member"
import { makeUser } from "../../test-fixtures"

describe("isDeveloperProgramMember", () => {
  it("returns true when graphql flag is set", () => {
    const input = makeUser({
      enrichment: { graphql: { isDeveloperProgramMember: true } },
    })
    expect(isDeveloperProgramMember.resolve(input)).toBe(true)
  })

  it("returns false when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(isDeveloperProgramMember.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(
      isDeveloperProgramMember.resolve(makeUser({ enrichment: null }))
    ).toBe(false)
  })
})
