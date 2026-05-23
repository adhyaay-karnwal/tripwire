import type { Signal } from "../types"

export const contentLanguage: Signal<string> = {
  id: "contentLanguage",
  name: "Content Language",
  category: "content",
  type: "string",
  description: "Detected dominant language of the content",
  resolve: () => "unknown",
}
