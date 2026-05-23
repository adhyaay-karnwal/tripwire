import { describe, it, expect } from "vitest"
import { schedule } from "./schedule"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/schedule", () => {
  it("passes with detail mentioning subtype", () => {
    const result = schedule.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("schedule")
  })

  it("exposes the scheduleType param with select options", () => {
    const param = schedule.params.find((p) => p.key === "scheduleType")
    expect(param).toBeDefined()
    expect(param?.type).toBe("select")
    expect(param?.options?.map((o) => o.value)).toContain("daily")
  })
})
