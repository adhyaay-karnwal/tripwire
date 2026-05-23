import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { ruleHandles } from "../handles"
import type { Block } from "../types"
import { str } from "../utils"

export const crypto: Block = {
  type: "rule",
  subtype: "crypto",
  name: RULE_META.cryptoAddressDetection.name,
  category: "Rules",
  description: RULE_META.cryptoAddressDetection.description,
  definition: "Detects crypto wallet addresses in PR or issue content.",
  example: "Catches spam PRs that try to inject crypto addresses.",
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
    if (!text) return { pass: true, detail: "SKIP -- no content text provided" }
    const cryptoPattern =
      /\b(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/
    const found = cryptoPattern.test(text)
    return {
      pass: !found,
      detail: found
        ? "FAIL -- crypto address detected in content"
        : "PASS -- no crypto addresses found",
    }
  },
}
