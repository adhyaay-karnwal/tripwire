import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Provider as ChatStoreProvider } from "@ai-sdk-tools/store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useWorkspace } from "#/providers/workspace-context"
import { useTRPC } from "#/integrations/trpc/react"
import { useChatEngine } from "#/lib/chat/use-chat-engine"
import {
  broadcastRuleMutation,
  broadcastWorkflowMutation,
  extractRuleIdsFromMessages,
  extractWorkflowIdsFromMessages,
} from "#/lib/workflow/events"
import type { UIMessage } from "#/types/chat"

export interface WorkflowContext {
  workflowId: string
}

interface ChatContextValue {
  messages: UIMessage[]
  isLoading: boolean
  isOpen: boolean
  error: Error | null
  isQuotaExhausted: boolean
  conversationId: string
  /** Effective repo for this chat (pinned / persisted / workspace). */
  repoId: string | undefined
  workflowContext: WorkflowContext | null

  sendMessage: (content: string) => void
  respondToToolApproval: (approvalId: string, approved: boolean) => void
  open: () => void
  close: () => void
  toggle: () => void
  clearChat: () => void
  loadChat: (chatId: string) => void
  newChat: () => string
  setWorkflowContext: (ctx: WorkflowContext | null) => void
  appendOptimisticMessage: (message: UIMessage) => void
  replaceOptimisticMessage: (id: string, message: UIMessage) => void
}

const defaultContextValue: ChatContextValue = {
  messages: [],
  isLoading: false,
  isOpen: false,
  error: null,
  isQuotaExhausted: false,
  conversationId: "",
  repoId: undefined,
  workflowContext: null,
  sendMessage: () => {},
  respondToToolApproval: () => {},
  open: () => {},
  close: () => {},
  toggle: () => {},
  clearChat: () => {},
  loadChat: () => void 0,
  newChat: () => "",
  setWorkflowContext: () => {},
  appendOptimisticMessage: () => {},
  replaceOptimisticMessage: () => {},
}

const ChatContext = createContext<ChatContextValue>(defaultContextValue)

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  return (
    <ChatStoreProvider>
      <ChatProviderClient>{children}</ChatProviderClient>
    </ChatStoreProvider>
  )
}

const STORAGE_KEY_CONV = "tw.askConversationId"
const STORAGE_KEY_OPEN = "tw.askOpen"

function getStoredValue(key: string): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem(key)
}

function setStoredValue(key: string, value: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value)
  }
}

function ChatProviderClient({ children }: ChatProviderProps) {
  const { repo, repos, setRepo } = useWorkspace()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(() => {
    return getStoredValue(STORAGE_KEY_OPEN) === "true"
  })

  const [conversationId, setConversationId] = useState(() => {
    const stored = getStoredValue(STORAGE_KEY_CONV)
    if (stored) return stored
    const id = crypto.randomUUID()
    setStoredValue(STORAGE_KEY_CONV, id)
    return id
  })

  const [workflowContext, setWorkflowContext] =
    useState<WorkflowContext | null>(null)

  // When a persisted chat is loaded, pin to the repoId it was created against
  // so subsequent /api/chat requests target that repo even if the user has
  // since switched workspace.
  const [pinnedRepoId, setPinnedRepoId] = useState<string | null>(null)

  // Track whether we've created the DB row for this conversation
  const createdConvIds = useRef(new Set<string>())

  const convQuery = useQuery(
    trpc.chats.get.queryOptions({ chatId: conversationId })
  )
  const persistedMessages =
    (convQuery.data?.messages as UIMessage[] | undefined) ?? []
  const persistedRepoId = convQuery.data?.repoId ?? null
  const conversationExists = !!convQuery.data

  const effectiveRepoId = pinnedRepoId ?? persistedRepoId ?? repo?.id

  const createConv = useMutation(trpc.chats.create.mutationOptions())

  const engine = useChatEngine({
    chatId: conversationId,
    repoId: effectiveRepoId,
    initialMessages: persistedMessages,
    extraRequestBody: {
      workflowId: workflowContext?.workflowId ?? undefined,
    },
    onFinishExtras: (messages) => {
      const mutatedWorkflowIds = extractWorkflowIdsFromMessages(messages)
      for (const wfId of mutatedWorkflowIds) {
        broadcastWorkflowMutation(wfId)
      }
      if (mutatedWorkflowIds.length > 0 && effectiveRepoId) {
        queryClient.invalidateQueries({
          queryKey: trpc.workflows.list.queryKey({ repoId: effectiveRepoId }),
        })
      }

      const mutatedRuleIds = extractRuleIdsFromMessages(messages)
      for (const ruleId of mutatedRuleIds) {
        broadcastRuleMutation(ruleId)
      }
      if (mutatedRuleIds.length > 0 && effectiveRepoId) {
        queryClient.invalidateQueries({
          queryKey: trpc.customRules.list.queryKey({ repoId: effectiveRepoId }),
        })
      }
    },
  })

  const updateIsOpen = useCallback((value: boolean) => {
    setIsOpen(value)
    setStoredValue(STORAGE_KEY_OPEN, String(value))
  }, [])

  const open = useCallback(() => updateIsOpen(true), [updateIsOpen])
  const close = useCallback(() => updateIsOpen(false), [updateIsOpen])
  const toggle = useCallback(
    () => updateIsOpen(!isOpen),
    [isOpen, updateIsOpen]
  )

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || engine.isQuotaExhausted) return

      if (!conversationExists && !createdConvIds.current.has(conversationId)) {
        createdConvIds.current.add(conversationId)
        createConv.mutate(
          { id: conversationId, repoId: effectiveRepoId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: trpc.chats.list.queryKey(),
              })
            },
          }
        )
      }

      engine.sendMessage(content)
      setTimeout(() => engine.refetchCustomer(), 2000)
    },
    [
      engine,
      conversationExists,
      conversationId,
      createConv,
      effectiveRepoId,
      queryClient,
      trpc.chats.list,
    ]
  )

  const respondToToolApproval = useCallback(
    (approvalId: string, approved: boolean) => {
      engine.addToolApprovalResponse({ id: approvalId, approved })
    },
    [engine]
  )

  const loadChat = useCallback(
    (chatId: string) => {
      setConversationId(chatId)
      setStoredValue(STORAGE_KEY_CONV, chatId)
      createdConvIds.current.add(chatId)

      // Pin the chat to its stored repo so subsequent sends target that
      // repo even if the user switches workspace. The caller should have
      // already fetched the chat into the query cache before calling this.
      const cached = queryClient.getQueryData(
        trpc.chats.get.queryKey({ chatId })
      ) as { repoId: string | null } | undefined
      const storedRepoId = cached?.repoId ?? null
      if (storedRepoId) {
        setPinnedRepoId(storedRepoId)
        if (repo?.id !== storedRepoId) {
          const target = repos.find((r) => r.id === storedRepoId)
          if (target) setRepo(target)
        }
      } else {
        setPinnedRepoId(null)
      }
    },
    [queryClient, trpc.chats.get, repo?.id, repos, setRepo]
  )

  const newChat = useCallback(() => {
    const id = crypto.randomUUID()
    setConversationId(id)
    setStoredValue(STORAGE_KEY_CONV, id)
    engine.setMessages([])
    setPinnedRepoId(null)
    return id
  }, [engine])

  const value: ChatContextValue = {
    messages: engine.messages,
    isLoading: engine.isLoading,
    isOpen,
    error: engine.error,
    isQuotaExhausted: engine.isQuotaExhausted,
    conversationId,
    repoId: effectiveRepoId,
    workflowContext,
    sendMessage,
    respondToToolApproval,
    open,
    close,
    toggle,
    clearChat: engine.clearChat,
    loadChat,
    newChat,
    setWorkflowContext,
    appendOptimisticMessage: engine.appendOptimisticMessage,
    replaceOptimisticMessage: engine.replaceOptimisticMessage,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useAIChat() {
  return useContext(ChatContext)
}
