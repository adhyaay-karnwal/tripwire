import { describe, it, expect } from "vitest"
import { fetchGithubUser } from "./fetch-github-user"
import { makeCtx } from "../../test-fixtures"

describe("blocks/transforms/fetchGithubUser", () => {
  it("returns profile fields as producedContext", () => {
    const ctx = makeCtx({
      signals: {
        accountAgeDays: 400,
        followers: 12,
        following: 7,
        publicRepos: 30,
        nonForkRepos: 20,
        publicGists: 4,
        hasProfileReadme: true,
      },
    })
    const result = fetchGithubUser.evaluate({}, ctx)
    expect(result.pass).toBe(true)
    expect(result.producedContext).toEqual({
      accountAgeDays: 400,
      followers: 12,
      following: 7,
      publicRepos: 30,
      nonForkRepos: 20,
      publicGists: 4,
      hasProfileReadme: true,
    })
    expect(result.detail).toContain("400d")
    expect(result.detail).toContain("30 repos")
    expect(result.detail).toContain("12 followers")
  })

  it("defaults all numeric fields to 0 and boolean to false", () => {
    const result = fetchGithubUser.evaluate({}, makeCtx())
    expect(result.producedContext).toEqual({
      accountAgeDays: 0,
      followers: 0,
      following: 0,
      publicRepos: 0,
      nonForkRepos: 0,
      publicGists: 0,
      hasProfileReadme: false,
    })
    expect(result.detail).toBe("Fetched profile: 0d old, 0 repos, 0 followers")
  })

  it("declares the full 7-field requiredContext", () => {
    const keys = fetchGithubUser.requiredContext?.map((c) => c.key) ?? []
    expect(keys).toEqual([
      "accountAgeDays",
      "followers",
      "following",
      "publicRepos",
      "nonForkRepos",
      "publicGists",
      "hasProfileReadme",
    ])
  })
})
