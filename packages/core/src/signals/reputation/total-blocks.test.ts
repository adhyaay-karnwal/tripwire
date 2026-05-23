import { describe, it, expect } from "vitest"
import { totalBlocks } from "./total-blocks"
import { makeUser } from "../../test-fixtures"

describe("totalBlocks", () => {
  it("returns the totalBlocks count from repoReputation", () => {
    const input = makeUser({ repoReputation: { totalBlocks: 4 } })
    expect(totalBlocks.resolve(input)).toBe(4)
  })

  it("returns 0 when repoReputation is null", () => {
    expect(totalBlocks.resolve(makeUser({ repoReputation: null }))).toBe(0)
  })

  it("returns 0 when the user has never been blocked", () => {
    const input = makeUser({ repoReputation: { totalBlocks: 0 } })
    expect(totalBlocks.resolve(input)).toBe(0)
  })
})
