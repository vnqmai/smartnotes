import { useRouter } from "next/dist/client/components/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import {
  CreateNoteInput,
  createNoteSchema,
  UpdateNoteInput,
} from "@/lib/validation/note"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import LoadingButton from "./LoadingButton"
import { useState } from "react"

interface IAddEditNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  noteToEdit?: UpdateNoteInput
}

const AddEditNoteDialog = ({
  isOpen,
  onClose,
  noteToEdit,
}: IAddEditNoteDialogProps) => {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    values: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  })

  const onSubmit = async (data: CreateNoteInput | UpdateNoteInput) => {
    try {
      if (!noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error("Failed to submit form")
      } else {
        const response = await fetch(`/api/notes`, {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...data,
          }),
        })
        if (!response.ok) throw new Error("Failed to submit form")
      }

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error submitting form")
    }
  }

  const onDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notes`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
      if (!response.ok) throw new Error("Failed to delete note")
      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Error deleting note")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <form id="form-add-note" className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter a title"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter a content"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <LoadingButton type="submit" form="form-add-note" isLoading={form.formState.isSubmitting}>
            {noteToEdit ? "Update Note" : "Add Note"}
          </LoadingButton>
          {noteToEdit && (
            <LoadingButton
              type="button"
              variant={"destructive"}
              isLoading={isDeleting}
              disabled={form.formState.isSubmitting}
              onClick={(e) => onDelete(e, noteToEdit.id)}
            >
              Delete Note
            </LoadingButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditNoteDialog
