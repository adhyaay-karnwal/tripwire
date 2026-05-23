import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const prEdited: Block = {
  type: "trigger",
  subtype: "pr_edited",
  name: "PR Edited",
  category: "Triggers",
  description: "Fires when a pull request is edited",
  definition: "Fires when an existing pull request is edited.",
  example:
    "Re-evaluate a PR after the author updates the title or description.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: pr_edited` }
  },
}
