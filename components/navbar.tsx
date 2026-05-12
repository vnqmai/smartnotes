"use client"

import { UserButton, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { Bot, LogOutIcon, Moon, Plus, SquareMenu, Sun } from "lucide-react"
import AddEditNoteDialog from "./AddEditNoteDialog"
import { useState } from "react"
import AIChatBox from "./AIChatBox"
import { useTheme } from "next-themes"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="mb-3 p-4 shadow sm:mb-5 md:mb-10">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between">
        <Link href="/notes" className="flex items-center gap-1">
          <div className="h-10 w-10 bg-[image:var(--bg-favicon)] bg-contain bg-center bg-no-repeat" />
          <span className="font-bold">SmartNotes</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
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

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />


          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <SquareMenu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="px-3 flex flex-col gap-1">
                <Button className="justify-start" onClick={() => setIsDialogOpen(true)}>
                  <Plus size={20} className="mr-2" />
                  Add Note
                </Button>
                <Button className="justify-start" onClick={() => setIsChatOpen(true)}>
                  <Bot size={20} className="mr-2" />
                  Chat
                </Button>
              </div>
              <SheetFooter>
                <SignOutButton>
                  <div className={buttonVariants({ variant: "outline", className: "justify-start" })}>
                    <LogOutIcon size={20} className="mr-2" />
                    Sign Out
                  </div>
                </SignOutButton>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AddEditNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <AIChatBox isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </header>
  )
}

export default Navbar

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  return resolvedTheme === "dark" ? (
    <Button
      className="h-8 w-8 cursor-pointer rounded-full"
      onClick={() => setTheme("light")}
    >
      <Sun size={20} />
    </Button>
  ) : (
    <Button
      className="h-8 w-8 cursor-pointer rounded-full"
      onClick={() => setTheme("dark")}
    >
      <Moon size={20} />
    </Button>
  )
}
