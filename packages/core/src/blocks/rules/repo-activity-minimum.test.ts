import { describe, it, expect } from "vitest"
import { repoActivityMinimum } from "./repo-activity-minimum"
import { makeCtx } from "../../test-fixtures"

describe("blocks/rules/repoActivityMinimum", () => {
  it("passes when non-fork repos meet threshold", () => {
    const ctx = makeCtx({ signals: { nonForkRepos: 5 } })
    const result = repoActivityMinimum.evaluate(
      { params: { minRepos: 3 } },
      ctx
    )
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("5 non-fork repos")
  })

  it("fails when non-fork repos are below threshold", () => {
    const ctx = makeCtx({ signals: { nonForkRepos: 1 } })
    const result = repoActivityMinimum.evaluate(
      { params: { minRepos: 3 } },
      ctx
    )
    expect(result.pass).toBe(false)
    expect(result.detail).toContain("requires >= 3")
  })

  it("uses default threshold of 3 when none provided", () => {
    const ctx = makeCtx({ signals: { nonForkRepos: 2 } })
    expect(repoActivityMinimum.evaluate({}, ctx).pass).toBe(false)
    const ctx2 = makeCtx({ signals: { nonForkRepos: 3 } })
    expect(repoActivityMinimum.evaluate({}, ctx2).pass).toBe(true)
  })

  it("treats missing nonForkRepos as 0 (fails)", () => {
    expect(
      repoActivityMinimum.evaluate({ params: { minRepos: 1 } }, makeCtx()).pass
    ).toBe(false)
  })

  it("regression: reads from nonForkRepos signal, not the dead publicNonForkRepos key", () => {
    const ctxWithDeadKey = makeCtx({
      signals: { publicNonForkRepos: 99, nonForkRepos: 0 },
    })
    expect(
      repoActivityMinimum.evaluate({ params: { minRepos: 3 } }, ctxWithDeadKey)
        .pass
    ).toBe(false)

    const ctxWithCorrectKey = makeCtx({
      signals: { publicNonForkRepos: 0, nonForkRepos: 10 },
    })
    expect(
      repoActivityMinimum.evaluate(
        { params: { minRepos: 3 } },
        ctxWithCorrectKey
      ).pass
    ).toBe(true)
  })
})
