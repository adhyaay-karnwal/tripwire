import { describe, it, expect } from "vitest"
import { andGate } from "./and"
import { makeCtx } from "../../test-fixtures"

describe("blocks/logic/andGate", () => {
  it("returns pass: true with executor-evaluated detail", () => {
    const result = andGate.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("AND -- evaluated by executor")
  })

  it("ignores data input", () => {
    const result = andGate.evaluate({ gate: "OR" }, makeCtx())
    expect(result.detail).toBe("AND -- evaluated by executor")
  })

  it("ignores ctx input", () => {
    const result = andGate.evaluate({}, makeCtx({ signals: { score: 0 } }))
    expect(result.pass).toBe(true)
  })

  it("has subtype AND for DB compatibility", () => {
    expect(andGate.subtype).toBe("AND")
    expect(andGate.type).toBe("logic")
  })
})
