import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const issueEdited: Block = {
  type: "trigger",
  subtype: "issue_edited",
  name: "Issue Edited",
  category: "Triggers",
  description: "Fires when an issue is edited",
  definition: "Fires when an existing issue is edited.",
  example: "Re-check issue content after edits for policy violations.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: issue_edited` }
  },
}
