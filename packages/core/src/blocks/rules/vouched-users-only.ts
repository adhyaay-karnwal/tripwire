import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { bool } from "../utils"

export const vouchedUsersOnly: Block = {
  type: "rule",
  subtype: "vouchedUsersOnly",
  name: RULE_META.vouchedUsersOnly.name,
  category: "Rules",
  description: RULE_META.vouchedUsersOnly.description,
  definition: "Only allows contributions from vouched/whitelisted users.",
  example: "Set scope to repo whitelist for strict contributor gating.",
  params: [
    {
      key: "vouchScope",
      name: "Vouch scope",
      type: "select",
      default: "repo",
      options: [
        { label: "Repo whitelist only", value: "repo" },
        { label: "Global vouches only", value: "global" },
        { label: "Both", value: "both" },
      ],
      description: "Which vouch source to check",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: "isVouched",
      label: "User is vouched/whitelisted",
      type: "boolean",
      source: "manual",
      default: false,
    },
  ],
  evaluate(_data, ctx) {
    const pass = bool(ctx, "isVouched")
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- user ${pass ? "is" : "is not"} vouched`,
    }
  },
}
