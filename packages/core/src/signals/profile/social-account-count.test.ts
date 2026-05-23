import { describe, it, expect } from "vitest"
import { socialAccountCount } from "./social-account-count"
import { makeUser } from "../../test-fixtures"

describe("socialAccountCount", () => {
  it("returns the length of socialAccounts", () => {
    const input = makeUser({
      enrichment: {
        graphql: {
          socialAccounts: [
            { provider: "TWITTER", url: "https://a" },
            { provider: "MASTODON", url: "https://b" },
          ],
        },
      },
    })
    expect(socialAccountCount.resolve(input)).toBe(2)
  })

  it("returns 0 when graphql is null", () => {
    const input = makeUser({ enrichment: { graphql: null } })
    expect(socialAccountCount.resolve(input)).toBe(0)
  })

  it("returns 0 when there are no social accounts", () => {
    const input = makeUser({
      enrichment: { graphql: { socialAccounts: [] } },
    })
    expect(socialAccountCount.resolve(input)).toBe(0)
  })
})
