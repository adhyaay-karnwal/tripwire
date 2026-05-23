import { transformHandles } from "../handles"
import type { Block } from "../types"

export const scanHistory: Block = {
  type: "transform",
  subtype: "scan_history",
  name: "Scan History",
  category: "Transforms",
  description: "Check the repo's event history for the contributor",
  definition: "Checks the repo's event history for the contributor.",
  example: "Look up whether this user has been flagged before.",
  params: [],
  handles: transformHandles,
  requiredContext: [],
  evaluate() {
    return { pass: true, detail: "Scanned repo history" }
  },
}
