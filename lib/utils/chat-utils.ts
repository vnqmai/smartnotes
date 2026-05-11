import { UIMessage } from "ai"

export const hasSuccessfulCreateNoteTool = (msg: UIMessage): boolean => {
  const parts = msg.parts ?? []
  const createNoteParts = parts.filter(
    (p) =>
      typeof p === "object" &&
      p != null &&
      (p as any).type === "tool-createNote" &&
      (p as any).state === "output-available",
  ) as any[]

  return createNoteParts.some((p) => (p.output as any)?.success === true)
}

export const getToolSummary = (msg: UIMessage): string => {
  const parts = msg.parts ?? []
  const toolParts = parts.filter(
    (p) => typeof p === "object" && p != null && String((p as any).type).startsWith("tool-"),
  ) as any[]

  if (toolParts.length === 0) return ""

  // Show the latest tool's status
  const last = toolParts[toolParts.length - 1]
  const toolName = String(last.type).replace(/^tool-/, "")
  const state = last.state ? ` (${last.state})` : ""

  const output = last.output as
    | { success?: boolean; message?: string }
    | undefined

  if (output?.message) {
    const prefix =
      output.success === false ? `Failed (${toolName})` : `Done (${toolName})`
    return `${prefix}: ${output.message}`
  }

  return `Tool: ${toolName}${state}`
}

export const getMessageText = (msg: UIMessage): string => {
  // Prefer parts (new UIMessage format)
  const textFromParts = msg.parts
    ?.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("")

  // Fallback for older message shapes
  const content = (msg as unknown as { content?: string }).content

  return (textFromParts || content || "").toString()
}