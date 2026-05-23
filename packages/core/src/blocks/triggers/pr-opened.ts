import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const prOpened: Block = {
  type: "trigger",
  subtype: "pr_opened",
  name: "PR Opened",
  category: "Triggers",
  description: "Fires when a pull request is opened",
  definition: "Fires when a pull request is opened against the repo.",
  example: "Use as the starting point for PR screening workflows.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: pr_opened` }
  },
}
