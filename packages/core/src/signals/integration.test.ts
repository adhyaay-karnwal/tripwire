import { describe, it, expect } from "vitest"
import { resolveAllSignals, SIGNALS, getSignal } from "./index"
import { daysAgo, makeUser } from "../test-fixtures"

describe("resolveAllSignals", () => {
  it("returns one value per registered signal", () => {
    const result = resolveAllSignals(makeUser())
    for (const signal of SIGNALS) {
      expect(result).toHaveProperty(signal.id)
    }
    expect(Object.keys(result).length).toBe(SIGNALS.length)
  })

  it("matches signal types — numbers are numbers, booleans are booleans", () => {
    const result = resolveAllSignals(makeUser())
    for (const signal of SIGNALS) {
      const value = result[signal.id]
      expect(typeof value).toBe(signal.type)
    }
  })

  it("produces trusted-user shape from a populated input", () => {
    const result = resolveAllSignals(
      makeUser({
        ghUser: {
          created_at: daysAgo(1000),
          public_repos: 25,
          followers: 200,
          following: 100,
          bio: "Engineer",
          company: "@acme",
          blog: "https://acme.dev",
          twitter_username: "trusted",
          two_factor_authentication: true,
        },
        repoReputation: {
          score: 88,
          totalAllows: 10,
          isWhitelisted: true,
        },
        enrichment: {
          hasProfileReadme: true,
          achievementCount: 4,
          nonForkRepoCount: 12,
          forkRepoCount: 3,
          filesChanged: 5,
          graphql: {
            contributionsLastYear: 800,
            sponsorsCount: 5,
            isGitHubStar: true,
            organizations: [
              { login: "acme", avatarUrl: "" },
              { login: "tripwire", avatarUrl: "" },
            ],
            socialAccounts: [{ provider: "twitter", url: "https://x.com/x" }],
            contributionYears: [2021, 2022, 2023, 2024],
          },
        },
      })
    )

    expect(result.accountAgeDays).toBe(1000)
    expect(result.publicRepos).toBe(25)
    expect(result.followers).toBe(200)
    expect(result.hasBio).toBe(true)
    expect(result.hasTwoFactor).toBe(true)
    expect(result.score).toBe(88)
    expect(result.isWhitelisted).toBe(true)
    expect(result.hasProfileReadme).toBe(true)
    expect(result.achievementCount).toBe(4)
    expect(result.nonForkRepos).toBe(12)
    expect(result.forkRepos).toBe(3)
    expect(result.filesChanged).toBe(5)
    expect(result.contributionsLastYear).toBe(800)
    expect(result.sponsorsCount).toBe(5)
    expect(result.isGitHubStar).toBe(true)
    expect(result.orgCount).toBe(2)
    expect(result.socialAccountCount).toBe(1)
    expect(result.contributionYears).toBe(4)
  })

  it("produces zeros and falses for a fully-null input", () => {
    const result = resolveAllSignals(
      makeUser({ ghUser: null, repoReputation: null, enrichment: null })
    )

    expect(result.accountAgeDays).toBe(0)
    expect(result.publicRepos).toBe(0)
    expect(result.hasBio).toBe(false)
    expect(result.hasTwoFactor).toBe(false)
    expect(result.score).toBe(0)
    expect(result.isWhitelisted).toBe(false)
    expect(result.hasProfileReadme).toBe(false)
    expect(result.nonForkRepos).toBe(0)
    expect(result.forkRepos).toBe(0)
    expect(result.isGitHubStar).toBe(false)
    expect(result.isSiteAdmin).toBe(false)
    expect(result.orgCount).toBe(0)
    expect(result.forkHeavy).toBe(false)
  })

  it("flags fork-heavy when fork repos dominate non-fork repos", () => {
    const result = resolveAllSignals(
      makeUser({ enrichment: { forkRepoCount: 60, nonForkRepoCount: 1 } })
    )
    expect(result.forkHeavy).toBe(true)
    expect(result.forkRepos).toBe(60)
    expect(result.nonForkRepos).toBe(1)
  })

  it("computes temporal-regularity CV from creation intervals", () => {
    const result = resolveAllSignals(
      makeUser({
        enrichment: {
          prTemporalData: {
            creationIntervals: [10, 20],
            timeToMerge: [120],
            maxPrsInOneHourWindow: 4,
          },
        },
      })
    )
    expect(result.sprayBurstCount).toBe(4)
    expect(result.temporalRegularityCV).toBeCloseTo(1 / 3, 5)
    expect(result.autoMergeFarmMedianTime).toBe(2)
  })
})

describe("getSignal", () => {
  it("returns a registered signal by id", () => {
    expect(getSignal("accountAgeDays")?.id).toBe("accountAgeDays")
    expect(getSignal("nonForkRepos")?.category).toBe("contributions")
  })

  it("returns undefined for an unknown id", () => {
    expect(getSignal("notARealSignal")).toBeUndefined()
  })
})
