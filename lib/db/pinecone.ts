import { Pinecone } from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY

if (!apiKey) {
  throw new Error(
    "PINECONE_API_KEY is not defined in the environment variables"
  )
}

const pinecone = new Pinecone({
  apiKey,
})

export const smartNotesPineconeIndex = pinecone.index("smartnotes")
