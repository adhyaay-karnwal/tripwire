import { describe, it, expect } from "vitest"
import { orGate } from "./or"
import { makeCtx } from "../../test-fixtures"

describe("blocks/logic/orGate", () => {
  it("returns pass: true with executor-evaluated detail", () => {
    const result = orGate.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("OR -- evaluated by executor")
  })

  it("ignores data input", () => {
    const result = orGate.evaluate({ gate: "AND" }, makeCtx())
    expect(result.detail).toBe("OR -- evaluated by executor")
  })

  it("ignores ctx input", () => {
    const result = orGate.evaluate({}, makeCtx({ signals: { score: 100 } }))
    expect(result.pass).toBe(true)
  })

  it("has subtype OR for DB compatibility", () => {
    expect(orGate.subtype).toBe("OR")
    expect(orGate.type).toBe("logic")
  })
})
