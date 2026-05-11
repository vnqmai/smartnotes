import { UserAvatar } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Bot, XCircle } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSmoothStream } from "@/hooks/chat-hooks"
import { getMessageText, getToolSummary, hasSuccessfulCreateNoteTool } from "@/lib/utils/chat-utils"

interface IAICHatBoxProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AIChatBox = ({ isOpen, setIsOpen }: IAICHatBoxProps) => {
  const [progress, setProgress] = useState<string>("")

  const router = useRouter();

  const { messages, sendMessage, error } = useChat({
    onToolCall() {
      setProgress("")
    },

    onFinish({ message }) {
      setProgress("")
      if (hasSuccessfulCreateNoteTool(message)) {
        router.refresh()
      }
    },
  })

  const [input, setInput] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const refreshedToolCallIdsRef = useRef<Set<string>>(new Set())
  const shouldAutoScrollRef = useRef<boolean>(true)

  useEffect(() => {
    if (!isOpen) return

    inputRef.current?.focus()
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })

    const scrollEl = scrollAreaRef.current
    const sentinel = endOfMessagesRef.current
    if (!scrollEl || !sentinel) return

    const onScroll = () => {
      const distanceFromBottom =
        scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
      // When user scrolls up, stop auto scrolling; when near bottom, re-enable.
      shouldAutoScrollRef.current = distanceFromBottom < 120
    }

    scrollEl.addEventListener("scroll", onScroll, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          shouldAutoScrollRef.current = true
        }
      },
      { root: scrollEl, threshold: 0.1 }
    )

    observer.observe(sentinel)

    return () => {
      scrollEl.removeEventListener("scroll", onScroll)
      observer.disconnect()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (!shouldAutoScrollRef.current) return

    // Scroll again whenever new chunks render (streaming updates mutate `messages`).
    requestAnimationFrame(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }, [isOpen, messages])

  useEffect(() => {
    // Refresh the notes list as soon as we receive a successful tool output,
    // without relying on finishReason (often it's "stop").
    for (const msg of messages) {
      const toolParts = (msg.parts ?? []).filter(
        (p) =>
          typeof p === "object" &&
          p != null &&
          (p as any).type === "tool-createNote" &&
          (p as any).state === "output-available",
      ) as any[]

      for (const part of toolParts) {
        const toolCallId = String(part.toolCallId ?? "")
        const output = part.output as { success?: boolean } | undefined
        if (!toolCallId) continue
        if (refreshedToolCallIdsRef.current.has(toolCallId)) continue
        if (output?.success) {
          refreshedToolCallIdsRef.current.add(toolCallId)
          router.refresh()
        }
      }
    }
  }, [messages, router])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProgress("Thingking...")
    const trimmed = input.trim()
    if (!trimmed) return

    setInput("")
    shouldAutoScrollRef.current = true
    await sendMessage({
      text: trimmed,
      metadata: { message: trimmed, role: "user" } as unknown,
    })
    setProgress("")
  }

  if (!isOpen) return null
  return (
    <div className="fixed bottom-0 md:bottom-5 right-0 md:right-3 z-10 bg-white w-full md:max-w-[600px] h-full md:max-h-[600px] border-2 rounded-2xl flex flex-col">
      <XCircle size={30} className="absolute right-0 top-0 translate-y-1 md:translate-y-[calc(-100%-10px)] cursor-pointer hover:box-shadow" onClick={() => setIsOpen(false)} />
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      >
        {
          messages
            .map((msg, index) => {
              const text = getMessageText(msg).trim()
              const toolSummary = getToolSummary(msg)

              // The stream can temporarily include an assistant shell (empty text),
              // which otherwise shows up as a blank extra bubble.
              if (
                (msg.role === "assistant" || msg.role === "system") &&
                !text &&
                !toolSummary
              ) {
                return null
              }

              return (
                <ChatMessage
                  key={msg.id ?? index}
                  message={
                    text ||
                    toolSummary
                  }
                  role={msg.role as ChatMessageRole}
                />
              )
            })
            .filter(Boolean)
        }
        {progress ? (
          <div className="text-xs text-gray-500 animate-bounce">Thinking...</div>
        ) : null}

        {error && (
          <div className="text-xs text-red-500">{error.message}</div>
        )}

        <div ref={endOfMessagesRef}></div>
      </div>
      <form className="p-5 flex w-full" onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="ml-2"
          type="submit"
          disabled={
            !!progress || !input.trim()
          }
        >
          Send
        </Button>
      </form>
    </div>
  )
}

export default AIChatBox

type ChatMessageRole = "user" | "assistant" | "system"

const ChatMessage = ({
  message,
  role,
}: {
  message: string
  role: ChatMessageRole
}) => {

  const displayedText = useSmoothStream(message, role === 'assistant')

  return (
    <div className={`flex items-center gap-2 w-fit ${role === 'user' ? 'flex-row-reverse ml-auto' : 'self-start'}`}>
      <div className="w-10 h-10 flex items-center justify-center">
        {role === "user" ? <UserAvatar /> : <Bot />}
      </div>
      <div className={`px-3 py-3 my-1 rounded-3xl ${role === 'user' ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'}`}>{displayedText}</div>
    </div>
  )
}
