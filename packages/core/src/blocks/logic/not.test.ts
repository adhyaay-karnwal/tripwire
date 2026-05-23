import { describe, it, expect } from "vitest"
import { notGate } from "./not"
import { makeCtx } from "../../test-fixtures"

describe("blocks/logic/notGate", () => {
  it("returns pass: true with executor-evaluated detail", () => {
    const result = notGate.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("NOT -- evaluated by executor")
  })

  it("ignores data input", () => {
    const result = notGate.evaluate({ gate: "AND" }, makeCtx())
    expect(result.detail).toBe("NOT -- evaluated by executor")
  })

  it("ignores ctx input", () => {
    const result = notGate.evaluate({}, makeCtx({ signals: { score: 25 } }))
    expect(result.pass).toBe(true)
  })

  it("has subtype NOT for DB compatibility", () => {
    expect(notGate.subtype).toBe("NOT")
    expect(notGate.type).toBe("logic")
  })
})
