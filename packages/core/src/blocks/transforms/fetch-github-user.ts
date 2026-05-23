import { transformHandles } from "../handles"
import type { Block } from "../types"
import { bool, num } from "../utils"

export const fetchGithubUser: Block = {
  type: "transform",
  subtype: "fetch_github_user",
  name: "Fetch GitHub User",
  category: "Transforms",
  description:
    "Enrich the workflow context with the contributor's GitHub profile data",
  definition: "Fetches the contributor's GitHub profile data.",
  example: "Place before rule checks that need account age or repo count.",
  params: [],
  handles: transformHandles,
  requiredContext: [
    {
      key: "accountAgeDays",
      label: "Account age (days)",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "followers",
      label: "Followers",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "following",
      label: "Following",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "publicRepos",
      label: "Public repos",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "nonForkRepos",
      label: "Non-fork repos",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "publicGists",
      label: "Public gists",
      type: "number",
      source: "user",
      default: 0,
    },
    {
      key: "hasProfileReadme",
      label: "Has profile README",
      type: "boolean",
      source: "user",
      default: false,
    },
  ],
  evaluate(_data, ctx) {
    return {
      pass: true,
      detail: `Fetched profile: ${num(ctx, "accountAgeDays")}d old, ${num(ctx, "publicRepos")} repos, ${num(ctx, "followers")} followers`,
      producedContext: {
        accountAgeDays: num(ctx, "accountAgeDays"),
        followers: num(ctx, "followers"),
        following: num(ctx, "following"),
        publicRepos: num(ctx, "publicRepos"),
        nonForkRepos: num(ctx, "nonForkRepos"),
        publicGists: num(ctx, "publicGists"),
        hasProfileReadme: bool(ctx, "hasProfileReadme"),
      },
    }
  },
}
