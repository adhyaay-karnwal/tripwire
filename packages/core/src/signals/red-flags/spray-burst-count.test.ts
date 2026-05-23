import { describe, it, expect } from "vitest"
import { sprayBurstCount } from "./spray-burst-count"
import { makeUser } from "../../test-fixtures"

describe("sprayBurstCount", () => {
  it("returns the max PRs in a 1-hour window from prTemporalData", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [],
          timeToMerge: [],
          maxPrsInOneHourWindow: 8,
        },
      },
    })
    expect(sprayBurstCount.resolve(input)).toBe(8)
  })

  it("returns 0 when prTemporalData is null", () => {
    const input = makeUser({ enrichment: { prTemporalData: null } })
    expect(sprayBurstCount.resolve(input)).toBe(0)
  })

  it("returns 0 when enrichment is omitted", () => {
    expect(sprayBurstCount.resolve(makeUser({ enrichment: null }))).toBe(0)
  })
})
