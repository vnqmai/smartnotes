import Note from "@/components/Note"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SmartNotes - Notes",
}

const NotesPage = async () => {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const allNotes = await prisma.note.findMany({
    where: {
      userId,
    },
  })

  return (
    <>
      {allNotes.length === 0 && (
        <div className="mt-60 md:md-30 h-full flex flex-col items-center justify-center">
          <p className="mb-4 text-gray-600 text-center">You don't have any notes yest. Why not create one?</p>
          <Button>Add Note</Button>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </>
  )
}

export default NotesPage
