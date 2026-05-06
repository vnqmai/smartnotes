import Note from "@/components/Note";
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SmartNotes - Notes",
}

const NotesPage = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized")

  const allNotes = await prisma.note.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note key={note.id} note={note} />
      ))}

      {allNotes.length === 0 && <p className="text-center text-gray-600">You don't have any notes yest. Why not create one?</p>}
    </div>
  )
}

export default NotesPage
