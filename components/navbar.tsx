"use client";

import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, Plus } from "lucide-react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { useState } from "react";
import AIChatBox from "./AIChatBox";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <header className="p-4 shadow">
      <div className="m-auto flex items-center justify-between flex-wrap max-w-7xl">
        <Link href="/notes" className="flex items-center gap-1">
          Notes
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <div className="flex items-center justify-end gap-1">
            <Button onClick={() => setIsChatOpen(true)}>
              <Bot size={20} className="mr-2" />
              Chat
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      <AddEditNoteDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      
      <AIChatBox isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

    </header>
  )
}

export default Navbar;