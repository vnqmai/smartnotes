import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const Navbar = () => {
  return (
    <header className="p-4 shadow">
      <div className="m-auto flex items-center justify-between flex-wrap max-w-7xl">
        <Link href="/notes" className="flex items-center gap-1">
          Notes
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <Button>
            <Plus size={20} className="mr-2" />
            Add Note
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar;