import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const commentCreated: Block = {
  type: "trigger",
  subtype: "comment_created",
  name: "Comment Created",
  category: "Triggers",
  description: "Fires when a comment is created on an issue or PR",
  definition: "Fires when a comment is posted on an issue or PR.",
  example: "Scan comments for crypto addresses or spam links.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: comment_created` }
  },
}
