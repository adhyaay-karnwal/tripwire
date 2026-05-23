import { transformHandles } from "../handles"
import type { Block } from "../types"
import { num } from "../utils"

export const fetchPrFiles: Block = {
  type: "transform",
  subtype: "fetch_pr_files",
  name: "Fetch PR Files",
  category: "Transforms",
  description: "Get the list of files changed in the pull request",
  definition: "Gets the list of files changed in the pull request.",
  example: "Use before a file count check or sensitive path detection.",
  params: [],
  handles: transformHandles,
  requiredContext: [
    {
      key: "filesChanged",
      label: "Files changed",
      type: "number",
      source: "user",
      default: 5,
    },
  ],
  evaluate(_data, ctx) {
    const count = num(ctx, "filesChanged", 5)
    return {
      pass: true,
      detail: `Fetched ${count} changed files`,
      producedContext: { filesChanged: count },
    }
  },
}
