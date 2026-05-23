import { actionHandles } from "../handles"
import type { Block } from "../types"

export const commentAction: Block = {
  type: "action",
  subtype: "comment",
  name: "Comment",
  category: "Actions",
  description: "Post a comment on the PR or issue",
  definition: "Posts a comment on the PR or issue.",
  example: "Welcome first-time contributors with repo guidelines.",
  params: [
    {
      key: "message",
      name: "Message",
      type: "string",
      required: true,
      description: "Comment body text",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: comment`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
