import { describe, it, expect } from "vitest"
import { contentLanguage } from "./content-language"
import { makeUser } from "../../test-fixtures"

describe("contentLanguage", () => {
  it("is currently a placeholder and always returns 'unknown'", () => {
    expect(contentLanguage.resolve(makeUser())).toBe("unknown")
  })

  it("returns 'unknown' even when contentText is provided", () => {
    const input = makeUser({ contentText: "hello world, this is english" })
    expect(contentLanguage.resolve(input)).toBe("unknown")
  })

  it("returns 'unknown' when all inputs are null/undefined", () => {
    const input = makeUser({
      ghUser: null,
      repoReputation: null,
      enrichment: null,
    })
    expect(contentLanguage.resolve(input)).toBe("unknown")
  })
})
