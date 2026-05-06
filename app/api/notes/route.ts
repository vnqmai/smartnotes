import { smartNotesPineconeIndex } from "@/lib/db/pinecone"
import { prisma } from "@/lib/db/prisma"
import gemeniai from "@/lib/geminiai"
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note"
import { auth } from "@clerk/nextjs/server"

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const parsedResult = createNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    const { title, content } = parsedResult.data
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const embedding = await getEmbeddings(title, content)

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

    return Response.json({ note }, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json()
    const parsedResult = updateNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    const { title, content, id } = parsedResult.data
    const { userId } = await auth()

    const noteExists = await prisma.note.findUnique({
      where: { id },
    })

    if (!noteExists) {
      return Response.json({ error: "Note not found" }, { status: 404 })
    }

    if (!userId || userId !== noteExists.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const embedding = await getEmbeddings(title, content)

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
          userId,
        },
      })

      await smartNotesPineconeIndex.upsert({
        records: [
          {
            id: id,
            values: embedding,
            metadata: {
              userId,
            },
          },
        ],
      })

      return note
    })

    return Response.json({ note }, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json()
    const parsedResult = deleteNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    const { id } = parsedResult.data
    const { userId } = await auth()

    const noteExists = await prisma.note.findUnique({
      where: { id },
    })

    if (!noteExists) {
      return Response.json({ error: "Note not found" }, { status: 404 })
    }

    if (!userId || userId !== noteExists.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.delete({
        where: { id },
      })

      await smartNotesPineconeIndex.deleteOne({ id })

      return note
    })

    return Response.json({ note }, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

const getEmbeddings = async (title: string, content: string) => {
  const response = await gemeniai.models.embedContent({
    model: "gemini-embedding-2",
    contents: title + "\n\n" + content,
    config: {
      outputDimensionality: 1024,
    },
  })

  const embedding = response.embeddings?.[0].values

  if (!embedding) throw new Error("Failed to get embeddings")

  return embedding
}
