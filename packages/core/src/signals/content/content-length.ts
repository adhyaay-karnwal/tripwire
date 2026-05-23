import type { Signal } from "../types"

export const contentLength: Signal<number> = {
  id: "contentLength",
  name: "Content Length",
  category: "content",
  type: "number",
  description: "Length of the content text in characters",
  resolve: ({ contentText }) => contentText?.length ?? 0,
}
