import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { accountAgeDays } from "../../signals/account/account-age-days"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const accountAge: Block = {
  type: "rule",
  subtype: "accountAge",
  name: RULE_META.accountAge.name,
  category: "Rules",
  description: RULE_META.accountAge.description,
  definition: "Checks if the contributor's GitHub account is old enough.",
  example: "Set minimum to 30 days to filter out throwaway accounts.",
  params: [
    {
      key: "days",
      name: "Minimum account age (days)",
      type: "number",
      default: 30,
      description: "Minimum number of days since account creation",
    },
  ],
  handles: ruleHandles,
  requiredContext: [
    {
      key: accountAgeDays.id,
      label: accountAgeDays.name,
      type: "number",
      source: "user",
      default: 0,
    },
  ],
  evaluate(data, ctx) {
    const threshold = getParam<number>(data, "days", 30)
    const actual = num(ctx, accountAgeDays.id)
    const pass = actual >= threshold
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- account is ${actual}d old (requires >= ${threshold}d)`,
    }
  },
}
