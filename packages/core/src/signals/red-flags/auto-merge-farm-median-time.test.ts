import { describe, it, expect } from "vitest"
import { autoMergeFarmMedianTime } from "./auto-merge-farm-median-time"
import { makeUser } from "../../test-fixtures"

describe("autoMergeFarmMedianTime", () => {
  it("returns 0 when timeToMerge is empty", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [],
          timeToMerge: [],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    expect(autoMergeFarmMedianTime.resolve(input)).toBe(0)
  })

  it("returns the odd-count median divided by 60", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [],
          timeToMerge: [600, 60, 300],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    // sorted = [60, 300, 600]; median index = floor(3/2) = 1 -> 300/60 = 5
    expect(autoMergeFarmMedianTime.resolve(input)).toBe(5)
  })

  it("divides the chosen sample by 60 verbatim", () => {
    const input = makeUser({
      enrichment: {
        prTemporalData: {
          creationIntervals: [],
          timeToMerge: [120],
          maxPrsInOneHourWindow: 0,
        },
      },
    })
    expect(autoMergeFarmMedianTime.resolve(input)).toBe(2)
  })

  it("returns 0 when prTemporalData is null", () => {
    const input = makeUser({ enrichment: { prTemporalData: null } })
    expect(autoMergeFarmMedianTime.resolve(input)).toBe(0)
  })
})
