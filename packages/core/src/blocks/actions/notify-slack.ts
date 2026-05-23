import { actionHandles } from "../handles"
import type { Block } from "../types"

export const notifySlack: Block = {
  type: "action",
  subtype: "notify_slack",
  name: "Notify Slack",
  category: "Actions",
  description: "Send a notification to a Slack webhook",
  definition: "Sends a notification to a Slack webhook.",
  example: "Alert your team channel when a suspicious PR is detected.",
  params: [
    {
      key: "url",
      name: "Webhook URL",
      type: "string",
      required: true,
      description: "Slack incoming webhook URL",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: notify_slack`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
