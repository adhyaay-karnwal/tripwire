import { logicHandles } from "../handles"
import type { Block } from "../types"

export const notGate: Block = {
  type: "logic",
  subtype: "NOT",
  name: "NOT Gate",
  category: "Logic Gates",
  description: "Inverts the input result",
  definition: "Inverts the result of its input.",
  example: "Flip a passing rule into a fail condition for exclusion logic.",
  params: [{ key: "gate", name: "Gate", type: "string", default: "NOT" }],
  handles: logicHandles,
  requiredContext: [],
  evaluate() {
    return { pass: true, detail: "NOT -- evaluated by executor" }
  },
}
