import { describe, it, expect } from "vitest"
import { repoScan } from "./repo-scan"
import { makeCtx } from "../../test-fixtures"

describe("blocks/triggers/repoScan", () => {
  it("passes with detail mentioning subtype", () => {
    const result = repoScan.evaluate({}, makeCtx())
    expect(result.pass).toBe(true)
    expect(result.detail).toContain("repo_scan")
  })
})
