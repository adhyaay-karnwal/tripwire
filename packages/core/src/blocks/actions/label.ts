import { actionHandles } from "../handles"
import type { Block } from "../types"

export const label: Block = {
  type: "action",
  subtype: "label",
  name: "Add Label",
  category: "Actions",
  description: "Add a label to the PR or issue",
  definition: "Adds a label to the PR or issue.",
  example: "Add a needs-review label to flag PRs from new contributors.",
  params: [
    {
      key: "label",
      name: "Label",
      type: "string",
      required: true,
      description: "Label name to add",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: label`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
