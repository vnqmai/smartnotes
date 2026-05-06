"use client"

import { useState } from "react"
import AddEditNoteDialog from "./AddEditNoteDialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Note as NodeModel } from "@prisma/client"

interface INoteProps {
  note: NodeModel
}

const Note = ({ note }: INoteProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const wasUpdated = note.updatedAt > note.createdAt

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString()  

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{note.title}</span>
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (Updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <AddEditNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        noteToEdit={note}
      />
    </>
  )
}

export default Note
