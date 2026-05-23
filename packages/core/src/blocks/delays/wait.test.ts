import { describe, it, expect } from "vitest"
import { wait } from "./wait"
import { makeCtx } from "../../test-fixtures"

describe("blocks/delays/wait", () => {
  it("caps long durations at 10 seconds (5m -> 10_000ms)", () => {
    const result = wait.evaluate(
      { durationValue: 5, durationUnit: "m" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Delay: waiting 5m...")
    expect(result.pauseMs).toBe(10_000)
  })

  it("does not cap short durations (2s -> 2000ms)", () => {
    const result = wait.evaluate(
      { durationValue: 2, durationUnit: "s" },
      makeCtx()
    )
    expect(result.pauseMs).toBe(2000)
    expect(result.detail).toBe("Delay: waiting 2s...")
  })

  it("uses defaults of 5m when no data provided (capped to 10_000)", () => {
    const result = wait.evaluate({}, makeCtx())
    expect(result.detail).toBe("Delay: waiting 5m...")
    expect(result.pauseMs).toBe(10_000)
  })

  it("caps hours and days the same way", () => {
    const hourly = wait.evaluate(
      { durationValue: 1, durationUnit: "h" },
      makeCtx()
    )
    expect(hourly.pauseMs).toBe(10_000)
    const daily = wait.evaluate(
      { durationValue: 1, durationUnit: "d" },
      makeCtx()
    )
    expect(daily.pauseMs).toBe(10_000)
  })
})
