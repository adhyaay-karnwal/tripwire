import type { Signal } from "../types"

export const publicGists: Signal<number> = {
  id: "publicGists",
  name: "Public Gists",
  category: "contributions",
  type: "number",
  description: "Number of public gists",
  resolve: ({ ghUser }) => ghUser?.public_gists ?? 0,
}
