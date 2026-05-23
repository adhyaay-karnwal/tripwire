import { describe, it, expect } from "vitest"
import { fetchPrFiles } from "./fetch-pr-files"
import { makeCtx } from "../../test-fixtures"

describe("blocks/transforms/fetchPrFiles", () => {
  it("reads filesChanged from ctx and emits it as producedContext", () => {
    const ctx = makeCtx({ signals: { filesChanged: 42 } })
    const result = fetchPrFiles.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Fetched 42 changed files")
    expect(result.producedContext).toEqual({ filesChanged: 42 })
  })

  it("falls back to 5 when filesChanged is missing", () => {
    const result = fetchPrFiles.evaluate({}, makeCtx())
    expect(result.detail).toBe("Fetched 5 changed files")
    expect(result.producedContext).toEqual({ filesChanged: 5 })
  })

  it("handles 0 filesChanged (does not fallback)", () => {
    const ctx = makeCtx({ signals: { filesChanged: 0 } })
    const result = fetchPrFiles.evaluate({}, ctx)
    expect(result.detail).toBe("Fetched 0 changed files")
    expect(result.producedContext).toEqual({ filesChanged: 0 })
  })
})
