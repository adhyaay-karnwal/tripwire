import { score } from "../../signals/reputation/score"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { getParam, num } from "../utils"

export const contributorScore: Block = {
  type: "rule",
  subtype: "contributorScore",
  name: "Contributor Score",
  category: "Rules",
  description: "Checks if the contributor's Tripwire score meets a threshold",
  params: [
    {
      key: "minScore",
      name: "Minimum score",
      type: "number",
      default: 50,
      description: "Minimum Tripwire contributor score (0-100)",
    },
  ],
  handles: ruleHandles,
  hidden: true,
  requiredContext: [
    {
      key: score.id,
      label: score.name,
      type: "number",
      source: "user",
      default: 0,
    },
  ],
  evaluate(data, ctx) {
    const threshold = getParam<number>(data, "minScore", 50)
    const actual = num(ctx, score.id)
    const pass = actual >= threshold
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- score is ${actual} (requires >= ${threshold})`,
    }
  },
}
