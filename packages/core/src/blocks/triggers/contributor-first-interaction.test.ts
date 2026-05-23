import { describe, it, expect } from "vitest"
import { contributorFirstInteraction } from "./contributor-first-interaction"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/contributorFirstInteraction", () => {
  it("passes with detail mentioning subtype", () => {
    const result = contributorFirstInteraction.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("contributor_first_interaction")
  })
})
