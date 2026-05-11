import { GoogleGenAI } from "@google/genai"
import { ModelMessage } from "ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables")
}

const gemeniai = new GoogleGenAI({})

const getEmbeddings = async (text: string) => {
  const response = await gemeniai.models.embedContent({
    model: "gemini-embedding-2",
    // The GenAI SDK supports passing text directly as strings.
    // This avoids role/parts shape mismatches.
    contents: [text],
    config: {
      outputDimensionality: 1024,
    },
  })

  const embedding = response.embeddings?.[0].values

  if (!embedding) throw new Error("Failed to get embeddings")

  return embedding
}

const getMessageEmbeddings = async (message: ModelMessage) => {
  const text = extractModelMessageText(message)
  return getEmbeddings(text)
}

export { gemeniai as default, getEmbeddings, getMessageEmbeddings }

function extractModelMessageText(message: ModelMessage): string {
  const content: unknown = (message as unknown as { content?: unknown }).content

  if (typeof content === "string") return content

  if (Array.isArray(content)) {
    // ModelMessage content is usually an array of parts.
    const text = content
      .filter((p): p is { type: string; text?: string } => {
        return typeof p === "object" && p != null && (p as any).type === "text"
      })
      .map((p) => String(p.text ?? ""))
      .join("")
      .trim()

    if (text) return text
  }

  // Fallback: best-effort stringify
  return String(content ?? "")
}
