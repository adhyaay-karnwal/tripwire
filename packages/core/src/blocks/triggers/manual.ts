import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const manual: Block = {
  type: "trigger",
  subtype: "manual",
  name: "Manual Run",
  category: "Triggers",
  description: "Fires when manually triggered by a user",
  definition: "Fires when a maintainer triggers the workflow by hand.",
  example: "Run a one-off scan against a specific contributor.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: manual` }
  },
}
