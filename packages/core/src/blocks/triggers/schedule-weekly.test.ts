import { describe, it, expect } from "vitest"
import { scheduleWeekly } from "./schedule-weekly"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/scheduleWeekly", () => {
  it("passes with detail mentioning subtype", () => {
    const result = scheduleWeekly.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("schedule_weekly")
  })

  it("is marked hidden", () => {
    expect(scheduleWeekly.hidden).toBe(true)
  })
})
