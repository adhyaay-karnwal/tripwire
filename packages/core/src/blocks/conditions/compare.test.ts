import { describe, it, expect } from "vitest"
import { compare } from "./compare"
import { makeCtx } from "../../test-fixtures"

describe("blocks/conditions/compare", () => {
  it("skips when field is not in context", () => {
    const result = compare.evaluate(
      { field: "score", operator: ">", value: "10" },
      makeCtx()
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("SKIP")
    expect(result.detail).toContain("score")
  })

  it("compares booleans via string equality", () => {
    const ctx = makeCtx({ signals: { hasProfileReadme: true } })
    const passResult = compare.evaluate(
      { field: "hasProfileReadme", operator: "==", value: "true" },
      ctx
    )
    expect(passResult.pass).toBe(true)
    const failResult = compare.evaluate(
      { field: "hasProfileReadme", operator: "==", value: "false" },
      ctx
    )
    expect(failResult.pass).toBe(false)
  })

  it("compares strings with == and !=", () => {
    const ctx = makeCtx({ username: "alice" })
    expect(
      compare.evaluate(
        { field: "username", operator: "==", value: "alice" },
        ctx
      ).pass
    ).toBe(true)
    expect(
      compare.evaluate(
        { field: "username", operator: "!=", value: "alice" },
        ctx
      ).pass
    ).toBe(false)
  })

  it("string matches with valid regex", () => {
    const ctx = makeCtx({ username: "bot-123" })
    const result = compare.evaluate(
      { field: "username", operator: "matches", value: "^bot-\\d+$" },
      ctx
    )
    expect(result.pass).toBe(true)
  })

  it("string matches falls back to includes on invalid regex", () => {
    const ctx = makeCtx({ username: "foo(bar)baz" })
    const passResult = compare.evaluate(
      { field: "username", operator: "matches", value: "(bar" },
      ctx
    )
    expect(passResult.pass).toBe(true)
    const failResult = compare.evaluate(
      { field: "username", operator: "matches", value: "(qux" },
      ctx
    )
    expect(failResult.pass).toBe(false)
  })

  it("covers all 6 numeric operators", () => {
    const ctx = makeCtx({ signals: { score: 50 } })
    expect(
      compare.evaluate({ field: "score", operator: ">", value: "40" }, ctx).pass
    ).toBe(true)
    expect(
      compare.evaluate({ field: "score", operator: ">=", value: "50" }, ctx)
        .pass
    ).toBe(true)
    expect(
      compare.evaluate({ field: "score", operator: "<", value: "60" }, ctx).pass
    ).toBe(true)
    expect(
      compare.evaluate({ field: "score", operator: "<=", value: "50" }, ctx)
        .pass
    ).toBe(true)
    expect(
      compare.evaluate({ field: "score", operator: "==", value: "50" }, ctx)
        .pass
    ).toBe(true)
    expect(
      compare.evaluate({ field: "score", operator: "!=", value: "50" }, ctx)
        .pass
    ).toBe(false)
  })
})
