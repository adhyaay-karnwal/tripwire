import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const issueOpened: Block = {
  type: "trigger",
  subtype: "issue_opened",
  name: "Issue Opened",
  category: "Triggers",
  description: "Fires when an issue is opened",
  definition: "Fires when a new issue is created.",
  example: "Screen new issues for spam or low-quality content.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: issue_opened` }
  },
}
