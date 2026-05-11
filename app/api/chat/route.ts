export const dynamic = 'force-dynamic';

import { smartNotesPineconeIndex } from "@/lib/db/pinecone"
import { prisma } from "@/lib/db/prisma"
import { getEmbeddings } from "@/lib/geminiai"
import { auth } from "@clerk/nextjs/server"
import { google } from "@ai-sdk/google"
import {
  streamText,
  stepCountIs,
} from "ai"
import {
  CreateNoteInput,
  createNoteSchema,
  searchNotesSchema,
} from "@/lib/validation/note"
import { createNoteAction } from "@/lib/services/note-service"
import { validateToolInput } from "@/lib/safety/validator"
import { getSystemMessages } from "@/lib/constants/system-messages-constants"

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const rawMessages = body.messages
    const cleanMessages = rawMessages
      .map((msg: any) => {
        const textFromParts = msg.parts
          ?.filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("")

        const finalContent =
          textFromParts || msg.content || msg.metadata?.message || ""

        return {
          role: msg.role,
          content: finalContent,
        }
      })
      .filter((m: any) => m.content !== "")

    const lastUserMessage = cleanMessages[cleanMessages.length - 1]?.content

    if (!lastUserMessage) throw new Error("No user message found")

    const result = await streamText({
      model: google("gemini-3.1-flash-lite-preview"),
      allowSystemInMessages: true,
      messages: cleanMessages,
      temperature: 0.5,
      tools: {
        createNote: {
          description:
            "Create a note with a title and content. Only use this tool when the user explicitly wants to save information.",
          inputSchema: createNoteSchema,
          execute: async ({ title, content }: CreateNoteInput) => {
            try {
              const safety = validateToolInput(
                "createNote",
                cleanMessages[cleanMessages.length - 1]?.content || ""
              )

              if (!safety.isValid) {
                return {
                  success: false,
                  message: safety.error,
                }
              }

              const { userId } = await auth()
              if (!userId) {
                return {
                  success: false,
                  message: "Unauthorized",
                }
              }
              const note = await createNoteAction(userId, title, content)
              if (!note) {
                return {
                  success: false,
                  message: "Failed to create note.",
                }
              }
              return {
                success: true,
                message: "Note created.",
                data: note,
              }
            } catch (error) {
              console.error("Tool execution error:", error)
              return {
                success: false,
                message: "Could not connect to the notes service.",
              }
            }
          },
        },
        searchNotes: {
          description: "Search for relevant notes based on user query.",
          inputSchema: searchNotesSchema,
          execute: async () => {
            const [{ userId }, embedding] = await Promise.all([
              auth(),
              getEmbeddings(lastUserMessage),
            ])

            const vectorQueryResponse = await smartNotesPineconeIndex.query({
              vector: embedding,
              topK: 3,
              filter: { userId },
            })

            const noteIds =
              vectorQueryResponse.matches?.map((match) => match.id) || []

            const relevantNotes =
              noteIds.length > 0
                ? await prisma.note.findMany({
                    where: { id: { in: noteIds } },
                    select: { title: true, content: true },
                  })
                : []

            const formattedNotes = relevantNotes
              .map(
                (note) => `Title: ${note.title}\nContent: ${note.content ?? ""}`
              )
              .join("\n\n")

            return {
              success: true,
              message: formattedNotes,
              data: relevantNotes
            }
          },
        },
      },
      stopWhen: stepCountIs(3),
      system: getSystemMessages(),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error processing chat request:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }
}
