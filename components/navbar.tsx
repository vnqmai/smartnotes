"use client";

import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, Moon, Plus, Sun } from "lucide-react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <header className="p-4 mb-3 sm:mb-5 md:mb-10 shadow">
      <div className="m-auto flex items-center justify-between flex-wrap max-w-7xl">
        <Link href="/notes" className="flex items-center gap-1">
          <div className="w-10 h-10 bg-[image:var(--bg-favicon)] bg-center bg-no-repeat bg-contain" />
          <span className="font-bold">
            SmartNotes
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <ThemeToggle />
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

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    resolvedTheme === "dark" ? (
      <Button className="rounded-full w-8 h-8 cursor-pointer" onClick={() => setTheme("light")}>
        <Sun size={20} />
      </Button>
    ) : (
      <Button className="rounded-full w-8 h-8 cursor-pointer" onClick={() => setTheme("dark")}>
        <Moon size={20} />
      </Button>
    )
  )
}
