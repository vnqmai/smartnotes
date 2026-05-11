import { z } from "zod"
import { isViolatingCreateIntent } from "../constants/note-constants"

export const searchNotesSchema = z.object({
  query: z.string().min(1, "Query is required"),
})

export type SearchNotesInput = z.infer<typeof searchNotesSchema>

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>

export const createNoteForAISchema = createNoteSchema.refine(
  (data) => !isViolatingCreateIntent(data.title + "\n\n" + data.content),
  {
    message: "Note content contains forbidden keywords.",
  }
)

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
})

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
})
