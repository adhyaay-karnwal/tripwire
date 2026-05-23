import { describe, it, expect } from "vitest"
import { scheduleDaily } from "./schedule-daily"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/scheduleDaily", () => {
  it("passes with detail mentioning subtype", () => {
    const result = scheduleDaily.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("schedule_daily")
  })

  it("is marked hidden", () => {
    expect(scheduleDaily.hidden).toBe(true)
  })
})
