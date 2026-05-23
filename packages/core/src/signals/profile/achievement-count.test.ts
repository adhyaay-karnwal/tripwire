import { describe, it, expect } from "vitest"
import { achievementCount } from "./achievement-count"
import { makeUser } from "../../test-fixtures"

describe("achievementCount", () => {
  it("returns the count from enrichment", () => {
    const input = makeUser({ enrichment: { achievementCount: 7 } })
    expect(achievementCount.resolve(input)).toBe(7)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(achievementCount.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when achievementCount is not set", () => {
    const input = makeUser({ enrichment: {} })
    expect(achievementCount.resolve(input)).toBe(0)
  })
})
