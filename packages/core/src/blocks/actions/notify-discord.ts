import { actionHandles } from "../handles"
import type { Block } from "../types"

export const notifyDiscord: Block = {
  type: "action",
  subtype: "notify_discord",
  name: "Notify Discord",
  category: "Actions",
  description: "Send a notification to a Discord webhook",
  definition: "Sends a notification to a Discord webhook.",
  example: "Post to your moderation channel when rules trigger.",
  params: [
    {
      key: "url",
      name: "Webhook URL",
      type: "string",
      required: true,
      description: "Discord webhook URL",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: notify_discord`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
