import { logicHandles } from "../handles"
import type { Block } from "../types"

export const andGate: Block = {
  type: "logic",
  subtype: "AND",
  name: "AND Gate",
  category: "Logic Gates",
  description: "All inputs must pass for output to pass",
  definition: "Passes only when all connected inputs pass.",
  example: "Connect Account Age + Merged PRs to require both checks.",
  params: [{ key: "gate", name: "Gate", type: "string", default: "AND" }],
  handles: logicHandles,
  requiredContext: [],
  evaluate() {
    return { pass: true, detail: "AND -- evaluated by executor" }
  },
}
