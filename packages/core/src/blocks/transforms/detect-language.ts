import { transformHandles } from "../handles"
import type { Block } from "../types"
import { str } from "../utils"

export const detectLanguage: Block = {
  type: "transform",
  subtype: "detect_language",
  name: "Detect Language",
  category: "Transforms",
  description: "Analyze content language for language requirement checks",
  definition: "Analyzes the content language of the PR or issue.",
  example: "Use before a language rule to detect non-English contributions.",
  params: [],
  handles: transformHandles,
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
    if (!text) return { pass: true, detail: "No content to analyze" }
    const looksEnglish = /^[a-zA-Z0-9\s.,!?;:'"()\-\n]+$/.test(
      text.slice(0, 200)
    )
    return {
      pass: true,
      detail: `Detected language: ${looksEnglish ? "English" : "non-English"}`,
      producedContext: { detectedLanguage: looksEnglish ? "English" : "other" },
    }
  },
}
