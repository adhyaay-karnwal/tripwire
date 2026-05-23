import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { mergedPrs } from "../../signals/contributions/merged-prs"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const minMergedPrs: Block = {
  type: "rule",
  subtype: "minMergedPrs",
  name: RULE_META.minMergedPrs.name,
  category: "Rules",
  description: RULE_META.minMergedPrs.description,
  definition: "Checks if the contributor has enough merged PRs across GitHub.",
  example: "Require at least 15 merged PRs to prove real contribution history.",
  params: [
    {
      key: "count",
      name: "Minimum merged PRs",
      type: "number",
      default: 15,
      description: "Required number of merged PRs across GitHub",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: mergedPrs.id,
      label: mergedPrs.name,
      type: "number",
      source: "user",
      default: 0,
    },
  ],
  evaluate(data, ctx) {
    const threshold = getParam<number>(data, "count", 15)
    const actual = num(ctx, mergedPrs.id)
    const pass = actual >= threshold
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- ${actual} merged PRs (requires >= ${threshold})`,
    }
  },
}
