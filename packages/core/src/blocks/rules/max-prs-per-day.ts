import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const maxPrsPerDay: Block = {
  type: "rule",
  subtype: "maxPrsPerDay",
  name: RULE_META.maxPrsPerDay.name,
  category: "Rules",
  description: RULE_META.maxPrsPerDay.description,
  definition: "Flags contributors who open too many PRs in a single day.",
  example: "Set limit to 5 to catch spam PR floods.",
  params: [
    {
      key: "limit",
      name: "Maximum PRs per day",
      type: "number",
      default: 5,
      description: "Maximum pull requests a single user can open per day",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: "prsToday",
      label: "PRs opened today",
      type: "number",
      source: "manual",
      default: 1,
    },
  ],
  evaluate(data, ctx) {
    const limit = getParam<number>(data, "limit", 5)
    const actual = num(ctx, "prsToday", 1)
    const pass = actual <= limit
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- ${actual} PRs today (limit: ${limit})`,
    }
  },
}
