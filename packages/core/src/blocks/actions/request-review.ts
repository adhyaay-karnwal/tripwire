import { actionHandles } from "../handles"
import type { Block } from "../types"

export const requestReview: Block = {
  type: "action",
  subtype: "request_review",
  name: "Request Review",
  category: "Actions",
  description: "Request a review from a specified user or team",
  definition: "Requests a review from a specified user or team.",
  example: "Auto-assign a reviewer when a PR touches sensitive files.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: request_review`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
