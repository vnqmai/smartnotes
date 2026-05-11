import { useState, useRef, useEffect, RefObject } from "react"

export function useSmoothStream(text: string, isAssistant: boolean) {
  const [displayedText, setDisplayedText] = useState(text)
  const queueRef = useRef("")
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isAssistant) {
      setDisplayedText(text)
      return
    }

    if (text.length < queueRef.current.length) {
      setDisplayedText(text)
      queueRef.current = text
      return
    }

    queueRef.current = text

    const runAnimation = () => {
      setDisplayedText((prev) => {
        if (prev.length < queueRef.current.length) {
          // Tốc độ: lấy thêm 1-3 ký tự tùy độ trễ
          const diff = queueRef.current.length - prev.length
          const step = diff > 20 ? 3 : 1
          return queueRef.current.slice(0, prev.length + step)
        }
        return prev
      })
      rafRef.current = requestAnimationFrame(runAnimation)
    }

    rafRef.current = requestAnimationFrame(runAnimation)

    return () => cancelAnimationFrame(rafRef.current!)
  }, [text, isAssistant])

  return displayedText
}

export function useOpenChat(
  isOpen: boolean,
  inputRef: RefObject<HTMLInputElement>,
  scrollAreaRef: RefObject<HTMLDivElement>,
  endOfMessagesRef: RefObject<HTMLDivElement>,
  shouldAutoScrollRef: RefObject<boolean>
) {
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

  return
}
