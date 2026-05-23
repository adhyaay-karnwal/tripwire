import { describe, it, expect } from "vitest"
import { temporalRegularityCV } from "./temporal-regularity-cv"
import { makeUser } from "../../test-fixtures"

describe("temporalRegularityCV", () => {
  it("returns 0 when there are no creation intervals", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [],
          timeToMerge: [],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    expect(temporalRegularityCV.resolve(input)).toBe(0)
  })

  it("returns 0 with only one interval (needs >= 2)", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [60],
          timeToMerge: [],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    expect(temporalRegularityCV.resolve(input)).toBe(0)
  })

  it("returns 0 when intervals are constant (zero variance)", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [60, 60, 60, 60],
          timeToMerge: [],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    expect(temporalRegularityCV.resolve(input)).toBe(0)
  })

  it("returns sqrt(variance)/mean for varying intervals", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [10, 20],
          timeToMerge: [],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    // mean = 15, variance = ((10-15)^2 + (20-15)^2)/2 = 25, sqrt(25)/15 = 5/15 = 1/3
    expect(temporalRegularityCV.resolve(input)).toBeCloseTo(1 / 3, 10)
  })

  it("returns 0 when prTemporalData is null", () => {
    const input = makeUser({ enrichment: { prTemporalData: null } })
    expect(temporalRegularityCV.resolve(input)).toBe(0)
  })
})
