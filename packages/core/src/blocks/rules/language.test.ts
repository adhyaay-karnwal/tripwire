import { describe, it, expect } from "vitest"
import { language } from "./language"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/language", () => {
  it("passes when English content matches en", () => {
    const ctx = makeCtx({ contentText: "Hello world, this is plain English." })
    const result = language.evaluate({ params: { language: "en" } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("matches")
  })

  it("fails when Cyrillic content is checked against en", () => {
    const ctx = makeCtx({ contentText: "Привет мир" })
    const result = language.evaluate({ params: { language: "en" } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("does not match")
  })

  it("skips when no content text is provided", () => {
    const result = language.evaluate({ params: { language: "en" } }, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail.startsWith("SKIP")).toBe(true)
  })

  it("uses default language 'en' when none provided", () => {
    const ctx = makeCtx({ contentText: "Hello world." })
    expect(language.evaluate({}, ctx).pass).toBe(true)
  })

  it("supports custom language code", () => {
    const ctx = makeCtx({ contentText: "Привет" })
    const result = language.evaluate(
      { params: { language: "custom", languageCode: "Cyrl" } },
      ctx
    )
    expect(result.pass).toBe(true)
  })
})
