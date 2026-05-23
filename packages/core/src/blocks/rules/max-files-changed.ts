import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { filesChanged } from "../../signals/content/files-changed"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const maxFilesChanged: Block = {
  type: "rule",
  subtype: "maxFilesChanged",
  name: RULE_META.maxFilesChanged.name,
  category: "Rules",
  description: RULE_META.maxFilesChanged.description,
  definition: "Flags PRs that touch too many files at once.",
  example: "Set limit to 20 files to catch bulk-edit spam PRs.",
  params: [
    {
      key: "limit",
      name: "Maximum files changed",
      type: "number",
      default: 20,
      description: "Maximum number of files a PR can touch",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: filesChanged.id,
      label: filesChanged.name,
      type: "number",
      source: "user",
      default: 0,
    },
  ],
  evaluate(data, ctx) {
    const limit = getParam<number>(data, "limit", 20)
    const actual = num(ctx, filesChanged.id)
    const pass = actual <= limit
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- ${actual} files changed (limit: ${limit})`,
    }
  },
}
