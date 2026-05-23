import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { hasProfileReadme } from "../../signals/profile/has-profile-readme"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { bool } from "../utils"

export const requireProfileReadme: Block = {
  type: "rule",
  subtype: "requireProfileReadme",
  name: RULE_META.requireProfileReadme.name,
  category: "Rules",
  description: RULE_META.requireProfileReadme.description,
  definition: "Checks if the contributor has a profile README.",
  example: "Accounts without a profile README are more likely to be bots.",
  params: [],
  handles: ruleHandles,
  requiredContext: [
    {
      key: hasProfileReadme.id,
      label: hasProfileReadme.name,
      type: "boolean",
      source: "user",
      default: false,
    },
  ],
  evaluate(_data, ctx) {
    const pass = bool(ctx, hasProfileReadme.id)
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- profile README ${pass ? "exists" : "missing"}`,
    }
  },
}
