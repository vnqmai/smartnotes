"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation";

export default function Page() {
  const {
    userId,
    isLoaded
  } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (userId) redirect("/notes");

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to SmartNotes</h1>
      <p className="text-lg text-gray-600 mb-8">Your personal note-taking app</p>
      <div className="flex gap-4">
        <Link href="/notes">
          <Button variant="outline">Open</Button>
        </Link>
      </div>
    </main>
  )
}
