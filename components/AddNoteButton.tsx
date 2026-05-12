"use client"

import { useState, type ReactNode } from "react"
import AddEditNoteDialog from "./AddEditNoteDialog"
import { Button } from "./ui/button"

interface AddNoteButtonProps {
  children?: ReactNode
  className?: string
}

const AddNoteButton = ({ children = "Add Note", className }: AddNoteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className={className} onClick={() => setIsOpen(true)}>
        {children}
      </Button>
      <AddEditNoteDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default AddNoteButton
