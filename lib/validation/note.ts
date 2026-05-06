import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required')
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
})