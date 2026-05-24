import { useMemo } from "react"
import type { UIMessage } from "#/types/chat"

interface ChatUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  costUSD: number
}

interface MessageMetadata {
  usage?: {
    inputTokens?: number
    outputTokens?: number
  }
  costUSD?: number
}

interface MessagePart {
  type: string
  text?: string
  content?: string
}

const CHARS_PER_TOKEN = 4

/** Compute cumulative chat usage from message metadata, with char-based estimation fallback. */
export function useChatUsage(messages: UIMessage[]): ChatUsage {
  return useMemo(() => {
    let inputTokens = 0
    let outputTokens = 0
    let costUSD = 0
    let hasMetadata = false

    for (const msg of messages) {
      const meta = (msg as unknown as { metadata?: MessageMetadata }).metadata
      if (meta?.usage) {
        hasMetadata = true
        inputTokens += meta.usage.inputTokens ?? 0
        outputTokens += meta.usage.outputTokens ?? 0
      }
      if (typeof meta?.costUSD === "number") {
        costUSD += meta.costUSD
      }
    }

    if (!hasMetadata && messages.length > 0) {
      for (const msg of messages) {
        const parts = (msg as unknown as { parts?: MessagePart[] }).parts
        let charCount = 0
        if (parts) {
          for (const p of parts) {
            charCount += (p.text ?? p.content ?? "").length
          }
        }
        const estimated = Math.ceil(charCount / CHARS_PER_TOKEN)
        if (msg.role === "user") inputTokens += estimated
        else outputTokens += estimated
      }
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUSD,
    }
  }, [messages])
}
