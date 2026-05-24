import type { ChatHistoryMessage } from "#/lib/chat/server"

/**
 * Merge a client-side save into DB-owned chat history.
 *
 * The server stream is authoritative for assistant/tool messages. Client saves
 * are useful as a fallback for user messages and titles, but they must not be
 * able to create or rewrite assistant/tool history, especially approvals.
 */
export function mergeMessagesPreservingResults(
  input: ChatHistoryMessage[],
  existing: ChatHistoryMessage[]
): ChatHistoryMessage[] {
  if (existing.length === 0) {
    return input.filter(isUserMessage).map(clone)
  }

  const merged = existing.map(clone)
  const knownIds = new Set(
    merged
      .map((message) => getMessageId(message))
      .filter((id): id is string => typeof id === "string")
  )

  for (const message of input) {
    if (!isUserMessage(message)) continue
    const id = getMessageId(message)
    if (id && knownIds.has(id)) continue
    merged.push(clone(message))
    if (id) knownIds.add(id)
  }

  return merged
}

type MessageLike = {
  id?: string
  role?: string
}

function isUserMessage(message: ChatHistoryMessage): boolean {
  return (message as MessageLike).role === "user"
}

function getMessageId(message: ChatHistoryMessage): string | undefined {
  const id = (message as MessageLike).id
  return typeof id === "string" ? id : undefined
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
