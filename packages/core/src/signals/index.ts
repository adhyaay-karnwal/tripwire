import type { Signal, SignalInput, SignalCategory } from "./types"

import { accountAgeDays } from "./account/account-age-days"
import { accountType } from "./account/account-type"
import { hasTwoFactor } from "./account/has-two-factor"
import { hasBio } from "./account/has-bio"
import { hasCompany } from "./account/has-company"
import { hasBlog } from "./account/has-blog"
import { hasTwitter } from "./account/has-twitter"

import { mergedPrs } from "./contributions/merged-prs"
import { closedPrs } from "./contributions/closed-prs"
import { mergeRatio } from "./contributions/merge-ratio"
import { publicRepos } from "./contributions/public-repos"
import { nonForkRepos } from "./contributions/non-fork-repos"
import { forkRepos } from "./contributions/fork-repos"
import { publicGists } from "./contributions/public-gists"
import { contributionsLastYear } from "./contributions/contributions-last-year"

import { followers } from "./social/followers"
import { following } from "./social/following"
import { sponsorsCount } from "./social/sponsors-count"
import { sponsoringCount } from "./social/sponsoring-count"
import { hasSponsorsListing } from "./social/has-sponsors-listing"
import { orgCount } from "./social/org-count"

import { contentLanguage } from "./content/content-language"
import { hasCryptoAddress } from "./content/has-crypto-address"
import { contentLength } from "./content/content-length"
import { filesChanged } from "./content/files-changed"

import { score } from "./reputation/score"
import { totalBlocks } from "./reputation/total-blocks"
import { totalAllows } from "./reputation/total-allows"
import { totalNearMisses } from "./reputation/total-near-misses"
import { isWhitelisted } from "./reputation/is-whitelisted"
import { isBlacklisted } from "./reputation/is-blacklisted"

import { sprayBurstCount } from "./red-flags/spray-burst-count"
import { temporalRegularityCV } from "./red-flags/temporal-regularity-cv"
import { autoMergeFarmMedianTime } from "./red-flags/auto-merge-farm-median-time"
import { forkHeavy } from "./red-flags/fork-heavy"

import { isGitHubStar } from "./badges/is-github-star"
import { isBountyHunter } from "./badges/is-bounty-hunter"
import { isDeveloperProgramMember } from "./badges/is-developer-program-member"
import { isCampusExpert } from "./badges/is-campus-expert"
import { isSiteAdmin } from "./badges/is-site-admin"

import { hasProfileReadme } from "./profile/has-profile-readme"
import { achievementCount } from "./profile/achievement-count"
import { socialAccountCount } from "./profile/social-account-count"
import { contributionYears } from "./profile/contribution-years"

export * from "./types"

export const SIGNALS: readonly Signal[] = [
  accountAgeDays,
  accountType,
  hasTwoFactor,
  hasBio,
  hasCompany,
  hasBlog,
  hasTwitter,

  mergedPrs,
  closedPrs,
  mergeRatio,
  publicRepos,
  nonForkRepos,
  forkRepos,
  publicGists,
  contributionsLastYear,

  followers,
  following,
  sponsorsCount,
  sponsoringCount,
  hasSponsorsListing,
  orgCount,

  contentLanguage,
  hasCryptoAddress,
  contentLength,
  filesChanged,

  score,
  totalBlocks,
  totalAllows,
  totalNearMisses,
  isWhitelisted,
  isBlacklisted,

  sprayBurstCount,
  temporalRegularityCV,
  autoMergeFarmMedianTime,
  forkHeavy,

  isGitHubStar,
  isBountyHunter,
  isDeveloperProgramMember,
  isCampusExpert,
  isSiteAdmin,

  hasProfileReadme,
  achievementCount,
  socialAccountCount,
  contributionYears,
] as const

export const SIGNAL_REGISTRY: readonly Signal[] = SIGNALS

export function getSignal(id: string): Signal | undefined {
  return SIGNALS.find((s) => s.id === id)
}

export function getSignalsByCategory(category: SignalCategory): Signal[] {
  return SIGNALS.filter((s) => s.category === category)
}

export function resolveAllSignals(input: SignalInput): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const signal of SIGNALS) {
    result[signal.id] = signal.resolve(input)
  }
  return result
}

export {
  accountAgeDays,
  accountType,
  hasTwoFactor,
  hasBio,
  hasCompany,
  hasBlog,
  hasTwitter,
  mergedPrs,
  closedPrs,
  mergeRatio,
  publicRepos,
  nonForkRepos,
  forkRepos,
  publicGists,
  contributionsLastYear,
  followers,
  following,
  sponsorsCount,
  sponsoringCount,
  hasSponsorsListing,
  orgCount,
  contentLanguage,
  hasCryptoAddress,
  contentLength,
  filesChanged,
  score,
  totalBlocks,
  totalAllows,
  totalNearMisses,
  isWhitelisted,
  isBlacklisted,
  sprayBurstCount,
  temporalRegularityCV,
  autoMergeFarmMedianTime,
  forkHeavy,
  isGitHubStar,
  isBountyHunter,
  isDeveloperProgramMember,
  isCampusExpert,
  isSiteAdmin,
  hasProfileReadme,
  achievementCount,
  socialAccountCount,
  contributionYears,
}
