import { describe, it, expect } from "vitest"
import { scanHistory } from "./scan-history"
import { makeCtx } from "../../test-fixtures"

describe("blocks/transforms/scanHistory", () => {
  it("returns pass with 'Scanned repo history' detail", () => {
    const result = scanHistory.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toBe("Scanned repo history")
  })

  it("ignores data input", () => {
    const result = scanHistory.evaluate({ foo: "bar" }, makeCtx())
    expect(result.detail).toBe("Scanned repo history")
  })

  it("does not produce context", () => {
    const result = scanHistory.evaluate({}, makeCtx({ signals: { score: 50 } }))
    expect(result.producedContext).toBeUndefined()
  })
})
