import { describe, it, expect } from "vitest"
import { hasProfileReadme } from "./has-profile-readme"
import { makeUser } from "../../test-fixtures"

describe("hasProfileReadme", () => {
  it("returns true when enrichment.hasProfileReadme is true", () => {
    const input = makeUser({ enrichment: { hasProfileReadme: true } })
    expect(hasProfileReadme.resolve(input)).toBe(true)
  })

  it("returns false when enrichment.hasProfileReadme is false", () => {
    const input = makeUser({ enrichment: { hasProfileReadme: false } })
    expect(hasProfileReadme.resolve(input)).toBe(false)
  })

  it("returns false when enrichment is omitted", () => {
    expect(hasProfileReadme.resolve(makeUser({ enrichment: null }))).toBe(false)
  })
})
