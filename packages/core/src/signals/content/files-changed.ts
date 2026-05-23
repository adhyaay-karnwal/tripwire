import type { Signal } from "../types"

export const filesChanged: Signal<number> = {
  id: "filesChanged",
  name: "Files Changed",
  category: "content",
  type: "number",
  description: "Number of files changed in a pull request",
  resolve: ({ enrichment }) => enrichment?.filesChanged ?? 0,
}
