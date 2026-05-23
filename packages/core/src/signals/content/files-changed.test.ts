import { describe, it, expect } from "vitest"
import { filesChanged } from "./files-changed"
import { makeUser } from "../../test-fixtures"

describe("filesChanged", () => {
  it("returns the filesChanged count from enrichment", () => {
    const input = makeUser({ enrichment: { filesChanged: 17 } })
    expect(filesChanged.resolve(input)).toBe(17)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(filesChanged.resolve(makeUser({ enrichment: null }))).toBe(0)
  })

  it("returns 0 when filesChanged is missing", () => {
    const input = makeUser({ enrichment: { filesChanged: undefined } })
    expect(filesChanged.resolve(input)).toBe(0)
  })

  it("returns 0 for a PR with no file changes", () => {
    const input = makeUser({ enrichment: { filesChanged: 0 } })
    expect(filesChanged.resolve(input)).toBe(0)
  })
})
