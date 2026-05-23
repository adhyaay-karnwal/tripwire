import { describe, it, expect } from "vitest"
import { requireProfileReadme } from "./require-profile-readme"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/requireProfileReadme", () => {
  it("passes when profile README exists", () => {
    const ctx = makeCtx({ signals: { hasProfileReadme: true } })
    const result = requireProfileReadme.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("exists")
  })

  it("fails when profile README is missing", () => {
    const ctx = makeCtx({ signals: { hasProfileReadme: false } })
    const result = requireProfileReadme.evaluate({}, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("missing")
  })

  it("fails when hasProfileReadme is absent from ctx", () => {
    const result = requireProfileReadme.evaluate({}, makeCtx())
    expect(result.pass).toBe(false)
  })
})
