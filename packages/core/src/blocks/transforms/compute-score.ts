import { transformHandles } from "../handles"
import type { Block } from "../types"
import { num } from "../utils"

export const computeScore: Block = {
  type: "transform",
  subtype: "compute_score",
  name: "Compute Score",
  category: "Transforms",
  description: "Calculate the contributor's Tripwire reputation score",
  definition: "Calculates the contributor's Tripwire reputation score.",
  example: "Use before a condition node to branch on score thresholds.",
  params: [],
  handles: transformHandles,
  requiredContext: [
    {
      key: "score",
      label: "Contributor score",
      type: "number",
      source: "user",
      default: 50,
    },
  ],
  evaluate(_data, ctx) {
    const score = num(ctx, "score", 50)
    return {
      pass: true,
      detail: `Computed score: ${score}/100`,
      producedContext: { score },
    }
  },
}
