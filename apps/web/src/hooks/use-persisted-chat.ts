import { useChatEngine, type ChatEngine } from "#/lib/chat/use-chat-engine"
import type { UIMessage } from "#/types/chat"

interface UsePersistedChatOptions {
  chatId: string
  initialMessages?: UIMessage[]
  initialMessagesVersion?: number
  repoId?: string
}

export interface PersistedChat extends ChatEngine {
  chatId: string
  repoId: string | undefined
}

/** Full-screen chat route view: thin wrapper over `useChatEngine`. */
export function usePersistedChat({
  chatId,
  initialMessages,
  initialMessagesVersion,
  repoId,
}: UsePersistedChatOptions): PersistedChat {
  const engine = useChatEngine({
    chatId,
    repoId,
    initialMessages,
    initialMessagesVersion,
  })
  return { ...engine, chatId, repoId }
}
