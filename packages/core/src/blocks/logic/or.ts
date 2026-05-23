import { logicHandles } from "../handles"
import type { Block } from "../types"

export const orGate: Block = {
  type: "logic",
  subtype: "OR",
  name: "OR Gate",
  category: "Logic Gates",
  description: "Any input passing causes output to pass",
  definition: "Passes when any connected input passes.",
  example: "Connect Whitelist + Score Check so either one grants access.",
  params: [{ key: "gate", name: "Gate", type: "string", default: "OR" }],
  handles: logicHandles,
  requiredContext: [],
  evaluate() {
    return { pass: true, detail: "OR -- evaluated by executor" }
  },
}
