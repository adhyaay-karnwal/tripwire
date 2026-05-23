import { describe, it, expect } from "vitest"
import { hasCompany } from "./has-company"
import { makeUser } from "../../test-fixtures"

describe("hasCompany", () => {
  it("returns true when company is set", () => {
    const input = makeUser({ ghUser: { company: "@github" } })
    expect(hasCompany.resolve(input)).toBe(true)
  })

  it("returns false when company is an empty string", () => {
    const input = makeUser({ ghUser: { company: "" } })
    expect(hasCompany.resolve(input)).toBe(false)
  })

  it("returns false when company is null", () => {
    const input = makeUser({ ghUser: { company: null } })
    expect(hasCompany.resolve(input)).toBe(false)
  })

  it("returns false when ghUser is null", () => {
    expect(hasCompany.resolve(makeUser({ ghUser: null }))).toBe(false)
  })
})
