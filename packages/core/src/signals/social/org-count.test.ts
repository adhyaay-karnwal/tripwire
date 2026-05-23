import { describe, it, expect } from "vitest"
import { orgCount } from "./org-count"
import { makeUser } from "../../test-fixtures"

describe("orgCount", () => {
  it("returns the length of the organizations array", () => {
    const input = makeUser({
      enrichment: {
        graphql: {
          organizations: [
            { login: "a" },
            { login: "b" },
            { login: "c" },
          ] as never,
        },
      },
    })
    expect(orgCount.resolve(input)).toBe(3)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(orgCount.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(orgCount.resolve(input)).toBe(0)
  })

  it("returns 0 when the organizations array is empty", () => {
    const input = makeUser({ enrichment: { graphql: { organizations: [] } } })
    expect(orgCount.resolve(input)).toBe(0)
  })
})
