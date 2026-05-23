import { describe, it, expect } from "vitest"
import { maxFilesChanged } from "./max-files-changed"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/maxFilesChanged", () => {
  it("passes when files changed are within limit", () => {
    const ctx = makeCtx({ signals: { filesChanged: 10 } })
    const result = maxFilesChanged.evaluate({ params: { limit: 20 } }, ctx)
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("10 files changed")
  })

  it("fails when files changed exceed limit", () => {
    const ctx = makeCtx({ signals: { filesChanged: 50 } })
    const result = maxFilesChanged.evaluate({ params: { limit: 20 } }, ctx)
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("limit: 20")
  })

  it("uses default limit of 20 when none provided", () => {
    const ctx = makeCtx({ signals: { filesChanged: 21 } })
    expect(maxFilesChanged.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ signals: { filesChanged: 20 } })
    expect(maxFilesChanged.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing filesChanged as 0 (passes)", () => {
    expect(
      maxFilesChanged.evaluate({ params: { limit: 20 } }, makeCtx()).pass
    ).toBe(true)
  })
})
