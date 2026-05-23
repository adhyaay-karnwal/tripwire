import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { nonForkRepos } from "../../signals/contributions/non-fork-repos"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const repoActivityMinimum: Block = {
  type: "rule",
  subtype: "repoActivityMinimum",
  name: RULE_META.repoActivityMinimum.name,
  category: "Rules",
  description: RULE_META.repoActivityMinimum.description,
  definition: "Checks if the contributor owns enough public repos.",
  example: "Require at least 3 non-fork repos to show genuine activity.",
  params: [
    {
      key: "minRepos",
      name: "Minimum public repos",
      type: "number",
      default: 3,
      description: "Minimum number of public non-fork repositories",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: nonForkRepos.id,
      label: nonForkRepos.name,
      type: "number",
      source: "user",
      default: 0,
    },
  ],
  evaluate(data, ctx) {
    const threshold = getParam<number>(data, "minRepos", 3)
    const actual = num(ctx, nonForkRepos.id)
    const pass = actual >= threshold
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- ${actual} non-fork repos (requires >= ${threshold})`,
    }
  },
}
