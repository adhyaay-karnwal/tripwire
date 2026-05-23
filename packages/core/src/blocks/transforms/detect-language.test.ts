import { describe, it, expect } from "vitest"
import { detectLanguage } from "./detect-language"
import { makeCtx } from "../../test-fixtures"

describe("blocks/transforms/detectLanguage", () => {
  it("returns 'No content to analyze' when text is empty", () => {
    const result = detectLanguage.evaluate({}, makeCtx({ contentText: "" }))
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("No content to analyze")
    expect(result.producedContext).toBeUndefined()
  })

  it("detects English on Latin-only text", () => {
    const ctx = makeCtx({
      contentText: "Hello, this is a normal English sentence.",
    })
    const result = detectLanguage.evaluate({}, ctx)
    expect(result.detail).toBe("Detected language: English")
    expect(result.producedContext).toEqual({ detectedLanguage: "English" })
  })

  it("detects non-English on non-Latin text", () => {
    const ctx = makeCtx({ contentText: "你好世界, this contains CJK chars" })
    const result = detectLanguage.evaluate({}, ctx)
    expect(result.detail).toBe("Detected language: non-English")
    expect(result.producedContext).toEqual({ detectedLanguage: "other" })
  })

  it("only inspects first 200 chars (non-Latin after limit is ignored)", () => {
    const longLatin = "a".repeat(200) + "你好"
    const ctx = makeCtx({ contentText: longLatin })
    const result = detectLanguage.evaluate({}, ctx)
    expect(result.producedContext).toEqual({ detectedLanguage: "English" })
  })
})
