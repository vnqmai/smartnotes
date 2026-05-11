import { smartNotesPineconeIndex } from "../db/pinecone"
import { prisma } from "../db/prisma"
import { getEmbeddings } from "../geminiai"

export async function createNoteAction(
  userId: string,
  title: string,
  content: string
) {
  try {
    const embedding = await getEmbeddings(title + "\n\n" + content)

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      })

      await smartNotesPineconeIndex.upsert({
        records: [
          {
            id: note.id,
            values: embedding,
            metadata: {
              userId,
            },
          },
        ],
      })

      return note
    })

    return note
  } catch (error) {
    console.error("Error creating note:", error)
    throw new Error("Failed to create note")
  }
}
