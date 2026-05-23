import { actionHandles } from "../handles"
import type { Block } from "../types"

export const sendWebhook: Block = {
  type: "action",
  subtype: "send_webhook",
  name: "Send Webhook",
  category: "Actions",
  description: "Send an HTTP POST to a custom webhook URL",
  definition: "Sends an HTTP POST to a custom webhook URL.",
  example: "Forward event data to your own API for custom processing.",
  params: [
    {
      key: "url",
      name: "Webhook URL",
      type: "string",
      required: true,
      description: "Target URL for the webhook POST",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: send_webhook`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
