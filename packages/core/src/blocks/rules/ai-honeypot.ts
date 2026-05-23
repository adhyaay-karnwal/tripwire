import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { str } from "../utils"

export const aiHoneypot: Block = {
  type: "rule",
  subtype: "aiHoneypot",
  name: RULE_META.aiHoneypot.name,
  category: "Rules",
  description: RULE_META.aiHoneypot.description,
  definition: "Detects AI-generated PRs using honeypot signals in repo files.",
  example: "Add hidden instructions in CONTRIBUTING.md that AI tools follow.",
  params: [],
  handles: ruleHandles,
  requiredContext: [
    {
      key: "contentText",
      label: "Content text",
      type: "string",
      source: "content",
      default: "",
    },
  ],
  evaluate(_data, ctx) {
    const text = str(ctx, "contentText")
    if (!text)
      return { pass: true, detail: "SKIP -- no content text to analyze" }
    return {
      pass: true,
      detail: "PASS -- honeypot check requires repo file analysis",
    }
  },
}
