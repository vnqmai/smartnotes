"use client";

import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { useState } from "react";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <header className="p-4 shadow">
      <div className="m-auto flex items-center justify-between flex-wrap max-w-7xl">
        <Link href="/notes" className="flex items-center gap-1">
          Notes
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <AddEditNoteDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </header>
  )
}

export default Navbar;